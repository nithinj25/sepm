const user = Auth.user() || { role: "doctor", doctorId: "d1" };
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

document.querySelectorAll(".tabs button").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("active", b === btn));
    document.querySelectorAll("main section").forEach((s) => s.classList.toggle("hidden", s.id !== btn.dataset.tab));
  };
});

render();
