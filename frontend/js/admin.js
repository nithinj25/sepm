Auth.require("admin");
let data = Store.load();

const badge = (s) => `<span class="badge ${s}">${s.replace("_", "-").toUpperCase()}</span>`;
const doctor = (id) => data.doctors.find((d) => d.id === id) || {};
const dept = (id) => (data.departments.find((d) => d.id === id) || {}).name || "–";

function renderStats() {
  const today = todayISO();
  const week = data.appointments.filter((a) => a.date >= today && a.date <= todayISO(6));
  const cancelled = data.appointments.filter((a) => a.status === "cancelled").length;
  document.getElementById("sToday").textContent = data.appointments.filter((a) => a.date === today && a.status !== "cancelled").length;
  document.getElementById("sWeek").textContent = week.filter((a) => a.status !== "cancelled").length;
  document.getElementById("sCancel").textContent =
    (data.appointments.length ? Math.round((100 * cancelled) / data.appointments.length) : 0) + "%";
}

function renderAppointments() {
  const fDate = document.getElementById("fDate").value;
  const fDoc = document.getElementById("fDoctor").value;
  const fStatus = document.getElementById("fStatus").value;
  const rows = data.appointments
    .filter((a) => (!fDate || a.date === fDate) && (!fDoc || a.doctorId === fDoc) && (!fStatus || a.status === fStatus))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .map((a) => {
      const d = doctor(a.doctorId);
      return `<tr><td>${a.date}</td><td>${a.time}</td><td>${a.patient}</td><td>${d.name}</td><td>${dept(d.departmentId)}</td><td>${badge(a.status)}</td></tr>`;
    });
  document.getElementById("apptRows").innerHTML = rows.join("") || `<tr><td colspan="6">No appointments match.</td></tr>`;
}

function renderDoctors() {
  document.getElementById("docRows").innerHTML = data.doctors
    .map((d) => `<tr><td>${d.name}</td><td>${d.email}</td><td>${dept(d.departmentId)}</td>
      <td>${d.active ? "Active" : "Inactive"}</td>
      <td><button onclick="toggleDoctor('${d.id}')">${d.active ? "Deactivate" : "Activate"}</button></td></tr>`)
    .join("");
  const fDoc = document.getElementById("fDoctor");
  fDoc.length = 1;
  data.doctors.forEach((d) => fDoc.add(new Option(d.name, d.id)));
}

function renderDepartments() {
  document.getElementById("deptList").innerHTML = data.departments.map((d) => `<li>${d.name}</li>`).join("");
  const sel = document.getElementById("nDept");
  sel.length = 0;
  data.departments.forEach((d) => sel.add(new Option(d.name, d.id)));
}

function addDoctor() {
  const name = document.getElementById("nName").value.trim();
  const email = document.getElementById("nEmail").value.trim();
  if (!name || !email) return alert("Name and email are required");
  data.doctors.push({ id: "d" + Date.now(), name, email, departmentId: Number(document.getElementById("nDept").value), active: true });
  Store.save(data);
  document.getElementById("nName").value = document.getElementById("nEmail").value = "";
  renderDoctors();
}

function toggleDoctor(id) {
  const d = doctor(id);
  d.active = !d.active;
  Store.save(data);
  renderDoctors();
}

function addDepartment() {
  const name = document.getElementById("nDeptName").value.trim();
  if (!name) return;
  if (data.departments.some((d) => d.name.toLowerCase() === name.toLowerCase())) return alert("Department already exists");
  data.departments.push({ id: Math.max(0, ...data.departments.map((d) => d.id)) + 1, name });
  Store.save(data);
  document.getElementById("nDeptName").value = "";
  renderDepartments();
}

function clearFilters() {
  ["fDate", "fDoctor", "fStatus"].forEach((id) => (document.getElementById(id).value = ""));
  renderAppointments();
}

["fDate", "fDoctor", "fStatus"].forEach((id) => (document.getElementById(id).onchange = renderAppointments));

renderStats();
renderDepartments();
renderDoctors();
renderAppointments();
