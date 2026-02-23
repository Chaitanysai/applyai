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

/* =======================
   Gemini AI Setup
======================= */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ output: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

/* =======================
   File Upload Setup
======================= */
const upload = multer({
  dest: path.join(__dirname, "storage/resumes")
});

/* =======================
   SSE Logging
======================= */
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

/* =======================
   Health Check
======================= */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* =======================
   Credentials
======================= */
app.post("/api/save-credentials", (req, res) => {
  const { portal, username, password } = req.body;
  saveCredentials(portal, username, password);
  res.json({ success: true });
});

/* =======================
   Resume Upload
======================= */
app.post("/api/upload-resume", upload.single("resume"), (req, res) => {
  res.json({ path: req.file.path });
});

/* =======================
   Run Automation
======================= */
app.post("/api/run", async (req, res) => {
  const { portal, resumePath } = req.body;
  const creds = getCredentials(portal);

  runAutomation(portal, creds, resumePath, sendLog);

  res.json({ started: true });
});

/* =======================
   Serve Frontend
======================= */
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

/* =======================
   Start Server
======================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Running on", PORT);
});
