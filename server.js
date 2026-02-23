require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { saveCredentials, getCredentials } = require("./credentialStore");
const { runAutomation } = require("./engine");

const app = express();

app.use(cors());
app.use(express.json());

/* ==============================
   GEMINI AI SETUP
============================== */

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    return res.json({
      output: text || "No response generated."
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      error: "Gemini request failed"
    });
  }
});

/* ==============================
   FILE UPLOAD
============================== */

const upload = multer({
  dest: path.join(__dirname, "storage/resumes")
});

/* ==============================
   SSE LOGS
============================== */

let clients = [];

function sendLog(message) {
  clients.forEach(res => res.write(`data: ${message}\n\n`));
}

app.get("/api/logs", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  clients.push(res);
});

/* ==============================
   HEALTH
============================== */

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ==============================
   CREDENTIALS
============================== */

app.post("/api/save-credentials", (req, res) => {
  const { portal, username, password } = req.body;
  saveCredentials(portal, username, password);
  res.json({ success: true });
});

/* ==============================
   RESUME UPLOAD
============================== */

app.post("/api/upload-resume", upload.single("resume"), (req, res) => {
  res.json({ path: req.file.path });
});

/* ==============================
   RUN AUTOMATION
============================== */

app.post("/api/run", async (req, res) => {
  const { portal, resumePath } = req.body;

  const creds = getCredentials(portal);

  runAutomation(portal, creds, resumePath, sendLog);

  res.json({ started: true });
});

/* ==============================
   SERVE FRONTEND
============================== */

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

/* ==============================
   START SERVER
============================== */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Running on", PORT);
});
