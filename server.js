require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const { saveCredentials, getCredentials } = require("./credentialStore");
const { runAutomation } = require("./engine");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  dest: path.join(__dirname, "storage/resumes")
});

let clients = [];

function sendLog(message) {
  clients.forEach(res => res.write(`data: ${message}\n\n`));
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/save-credentials", (req, res) => {
  const { portal, username, password } = req.body;
  saveCredentials(portal, username, password);
  res.json({ success: true });
});

app.post("/api/upload-resume", upload.single("resume"), (req, res) => {
  res.json({ path: req.file.path });
});

app.post("/api/run", async (req, res) => {
  const { portal, resumePath } = req.body;
  const creds = getCredentials(portal);
  runAutomation(portal, creds, resumePath, sendLog);
  res.json({ started: true });
});

app.get("/api/logs", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  clients.push(res);
});

/* Serve frontend */
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running on", PORT));
