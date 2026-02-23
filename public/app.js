// Floating blobs
const blob1 = document.createElement("div");
blob1.className = "blob one";
document.body.appendChild(blob1);

const blob2 = document.createElement("div");
blob2.className = "blob two";
document.body.appendChild(blob2);

// Dark/Light Toggle
const toggle = document.createElement("button");
toggle.textContent = "🌗";
toggle.style.position = "fixed";
toggle.style.top = "20px";
toggle.style.right = "20px";
toggle.onclick = () => document.body.classList.toggle("light");
document.body.appendChild(toggle);

// Stats Dashboard
const stats = document.createElement("div");
stats.className = "stats-grid reveal";
stats.innerHTML = `
<div class="stat-card"><div>Total Applications</div><div class="stat-number" id="totalApps">0</div></div>
<div class="stat-card"><div>Success Rate</div><div class="stat-number">76%</div></div>
<div class="stat-card"><div>Active Portals</div><div class="stat-number">4</div></div>
`;
document.querySelector(".main-content").prepend(stats);

// Real-time Counter
let count = 0;
function incrementCounter() {
  count++;
  document.getElementById("totalApps").textContent = count;
}

// Scroll Reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// AI Assistant Bubble
const ai = document.createElement("div");
ai.className = "ai-bubble";
ai.innerHTML = "🤖";
ai.onclick = () => showToast("AI Assistant coming soon 🚀");
document.body.appendChild(ai);

// Toast
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Section Switch
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Backend Status
async function checkStatus() {
  try {
    const res = await fetch("/health");
    if (!res.ok) throw new Error();
  } catch {
    document.querySelector(".dot").style.background = "red";
  }
}

async function runAutomation() {
  incrementCounter();
  showToast("Automation Started 🚀");
}

checkStatus();
