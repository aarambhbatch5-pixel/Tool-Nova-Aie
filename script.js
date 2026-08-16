const $ = (id) => document.getElementById(id);

$("year").textContent = new Date().getFullYear();

$("menuBtn").addEventListener("click", () => {
  const nav = $("navLinks");
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
});

const modal = $("toolModal");
function openTool(id){
  document.querySelectorAll(".tool-panel").forEach(x => x.classList.remove("active"));
  $(id).classList.add("active");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.addEventListener("click", () => openTool(btn.dataset.open));
});
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}
$("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if(e.target === modal) closeModal(); });

$("ageBtn").addEventListener("click", () => {
  const value = $("dob").value;
  const out = $("ageResult");
  if(!value){ out.textContent = "Please select your date of birth."; return; }
  const dob = new Date(value + "T00:00:00");
  const today = new Date();
  if(dob > today){ out.textContent = "Date of birth cannot be in the future."; return; }
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();
  if(days < 0){
    months--;
    const previousMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += previousMonthDays;
  }
  if(months < 0){ years--; months += 12; }
  out.textContent = `${years} years, ${months} months, ${days} days`;
});

$("calcBtn").addEventListener("click", () => {
  const expr = $("calcDisplay").value.trim();
  const out = $("calcResult");
  if(!/^[0-9+\-*/().%\s]+$/.test(expr)){ out.textContent = "Use only numbers and + - * / % ( )."; return; }
  try {
    const result = Function('"use strict"; return (' + expr + ')')();
    out.textContent = Number.isFinite(result) ? `Result: ${result}` : "Invalid calculation.";
  } catch { out.textContent = "Invalid calculation."; }
});

$("passLength").addEventListener("input", e => $("lengthValue").textContent = e.target.value);
$("passBtn").addEventListener("click", () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  let pass = "";
  for(let i=0;i<Number($("passLength").value);i++) pass += chars[Math.floor(Math.random()*chars.length)];
  $("passResult").textContent = pass;
});
$("copyPass").addEventListener("click", async () => {
  const text = $("passResult").textContent;
  if(!text) return;
  try { await navigator.clipboard.writeText(text); $("copyPass").textContent = "Copied ✓"; setTimeout(()=>$("copyPass").textContent="Copy",1200); }
  catch { $("copyPass").textContent = "Copy failed"; }
});

function updateText(){
  const text = $("textInput").value;
  $("charCount").textContent = text.length;
  $("spaceCount").textContent = (text.match(/ /g) || []).length;
  $("wordCount").textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
}
$("textInput").addEventListener("input", updateText);

$("searchBox").addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  let found = 0;
  document.querySelectorAll(".tool-card").forEach(card => {
    const match = card.dataset.name.includes(q);
    card.style.display = match ? "" : "block";
    if(match) found++;
  });
  $("noResults").hidden = found !== 0;
});
