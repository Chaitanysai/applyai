function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.add("hidden");
  });

  document.querySelectorAll(".nav-buttons button")
    .forEach(btn => btn.classList.remove("active"));

  const activeSection = document.getElementById(id);
  activeSection.classList.remove("hidden");
  activeSection.style.opacity = 0;

  setTimeout(() => activeSection.style.opacity = 1, 10);

  const activeButton = [...document.querySelectorAll(".nav-buttons button")]
    .find(btn => btn.textContent.toLowerCase() === id);

  if (activeButton) activeButton.classList.add("active");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

async function checkStatus() {
  try {
    const res = await fetch("/health");
    const pill = document.getElementById("status");

    if (res.ok) {
      pill.textContent = "Backend Online";
      pill.classList.remove("offline");
    } else {
      throw new Error();
    }
  } catch {
    const pill = document.getElementById("status");
    pill.textContent = "Backend Offline";
    pill.classList.add("offline");
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

  showToast("Credentials saved successfully");
}

async function uploadResume() {
  const file = document.getElementById("resumeFile").files[0];
  const formData = new FormData();
  formData.append("resume", file);

  await fetch("/api/upload-resume", {
    method: "POST",
    body: formData
  });

  showToast("Resume uploaded successfully");
}

async function runAutomation() {
  await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ portal: "linkedin", resumePath: "" })
  });

  startLogs();
  showToast("Automation started");
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
showSection("credentials");
