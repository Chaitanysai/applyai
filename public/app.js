let totalApplications = 0;
let uploadedResumePath = null;

/* SECTION SWITCH */
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.add("hidden");
  });

  document.querySelectorAll(".sidebar button").forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById(id).classList.remove("hidden");

  document.querySelector(
    `.sidebar button[onclick="showSection('${id}')"]`
  ).classList.add("active");
}

/* STATUS */
async function checkStatus() {
  try {
    const res = await fetch("/health");
    if (!res.ok) throw new Error();
    document.getElementById("status").innerText = "Backend Online";
  } catch {
    document.getElementById("status").innerText = "Backend Offline";
  }
}
checkStatus();

/* SAVE CREDENTIALS */
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

/* UPLOAD RESUME */
async function uploadResume() {
  const fileInput = document.getElementById("resumeFile");
  if (!fileInput.files.length) {
    alert("Select a file first");
    return;
  }

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);

  const res = await fetch("/api/upload-resume", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  uploadedResumePath = data.path;

  alert("Resume Uploaded");
}

/* RUN AUTOMATION */
async function runAutomation() {
  if (!uploadedResumePath) {
    alert("Upload resume first");
    return;
  }

  const portal = document.getElementById("portal").value;

  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      portal,
      resumePath: uploadedResumePath
    })
  });

  if (res.ok) {
    totalApplications++;
    document.getElementById("totalApps").innerText = totalApplications;
    alert("Automation Started");
  }
}

/* GEMINI AI */
async function askAI() {
  const input = document.getElementById("aiInput").value;
  const output = document.getElementById("aiOutput");

  if (!input) {
    output.innerText = "Enter a prompt first.";
    return;
  }

  output.innerText = "Thinking...";

  try {
    const res = await fetch("/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();

    if (data.output) {
      output.innerText = data.output;
    } else if (data.error) {
      output.innerText = "Error: " + data.error;
    } else {
      output.innerText = "Unexpected response.";
    }

  } catch (err) {
    output.innerText = "AI request failed.";
  }
}
