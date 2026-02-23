const API = "";

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

async function checkStatus() {
  try {
    const res = await fetch("/health");
    if (res.ok) {
      document.getElementById("status").innerHTML =
        "Backend Status: <span style='color:green'>Online</span>";
    }
  } catch {
    document.getElementById("status").innerHTML =
      "Backend Status: <span style='color:red'>Offline</span>";
  }
}

async function saveCredentials() {
  const portal = document.getElementById("portal").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  await fetch("/api/save-credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ portal, username, password })
  });

  alert("Credentials Saved");
}

async function uploadResume() {
  const file = document.getElementById("resumeFile").files[0];
  const formData = new FormData();
  formData.append("resume", file);

  await fetch("/api/upload-resume", {
    method: "POST",
    body: formData
  });

  alert("Resume Uploaded");
}

async function runAutomation() {
  await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ portal: "linkedin", resumePath: "" })
  });

  alert("Automation Started");
  startLogs();
}

function startLogs() {
  const eventSource = new EventSource("/api/logs");
  eventSource.onmessage = function (event) {
    const logBox = document.getElementById("logBox");
    logBox.innerHTML += event.data + "<br>";
    logBox.scrollTop = logBox.scrollHeight;
  };
}

checkStatus();
