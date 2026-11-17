const user = Auth.require("doctor") || { doctorId: null };
let data = Store.load();
const me = data.doctors.find((d) => d.id === user.doctorId);
document.getElementById("who").textContent = me ? me.name : "";

const badge = (s) => `<span class="badge ${s}">${s.replace("_", "-").toUpperCase()}</span>`;
const mine = () => data.appointments.filter((a) => a.doctorId === user.doctorId);

function setStatus(id, status) {
  const a = data.appointments.find((x) => x.id === id);
  if (status === "cancelled") {
    const reason = prompt("Reason for cancelling?");
    if (!reason) return;
    a.cancellationReason = reason;
  }
  a.status = status;
  Store.save(data);
  render();
}

function render() {
  const today = todayISO();
  const rows = mine()
    .filter((a) => a.date === today)
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((a) => `<tr><td>${a.time}</td><td>${a.patient}</td><td>${a.reason}</td><td>${badge(a.status)}</td><td>${
      a.status === "booked"
        ? `<button onclick="setStatus('${a.id}','completed')">Done</button>
           <button onclick="setStatus('${a.id}','no_show')">No-show</button>
           <button onclick="setStatus('${a.id}','cancelled')">Cancel</button>`
        : "–"
    }</td></tr>`);
  document.getElementById("todayRows").innerHTML = rows.join("") || `<tr><td colspan="5">No appointments today.</td></tr>`;

  const week = mine()
    .filter((a) => a.date >= today && a.date <= todayISO(6))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .map((a) => `<tr><td>${a.date}</td><td>${a.time}</td><td>${a.patient}</td><td>${a.reason}</td><td>${badge(a.status)}</td></tr>`);
  document.getElementById("weekRows").innerHTML = week.join("") || `<tr><td colspan="5">Nothing booked.</td></tr>`;
}

// ---- Availability editor (PUT /api/doctors/me/availability in the real API) ----
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function renderAvailability() {
  const slots = data.availability[user.doctorId] || [];
  document.getElementById("availRows").innerHTML = DAYS.map((name, day) => {
    const s = slots.find((x) => x.day === day) || { start: "09:00", end: "13:00", active: false };
    return `<tr data-day="${day}"><td>${name}</td>
      <td><input type="time" value="${s.start}"></td>
      <td><input type="time" value="${s.end}"></td>
      <td><input type="checkbox" ${s.active ? "checked" : ""}></td></tr>`;
  }).join("");
  const leave = data.leave[user.doctorId] || [];
  document.getElementById("leaveList").innerHTML = leave.map((d) => `<li>${d}</li>`).join("") || "<li>None</li>";
}

function addLeave() {
  const d = document.getElementById("leaveDate").value;
  if (!d) return;
  data.leave[user.doctorId] = [...new Set([...(data.leave[user.doctorId] || []), d])].sort();
  renderAvailability();
}

function saveAvailability() {
  const rows = [...document.querySelectorAll("#availRows tr")];
  const slots = [];
  for (const tr of rows) {
    const [start, end, active] = tr.querySelectorAll("input");
    if (active.checked && end.value <= start.value) {
      alert(DAYS[tr.dataset.day] + ": end time must be after start time");
      return;
    }
    slots.push({ day: Number(tr.dataset.day), start: start.value, end: end.value, active: active.checked });
  }
  data.availability[user.doctorId] = slots;
  Store.save(data);
  document.getElementById("saved").textContent = "Saved ✓";
}

renderAvailability();

document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("active", b === btn));
    document.querySelectorAll("main section").forEach((s) => s.classList.toggle("hidden", s.id !== btn.dataset.tab));
  };
});

render();
