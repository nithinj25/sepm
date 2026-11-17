// Mock data layer for the demo. Stands in for the REST API in docs/design/architecture.md.
// Data is kept in localStorage so changes survive a page refresh.

const SEED = {
  departments: [
    { id: 1, name: "Cardiology" },
    { id: 2, name: "ENT" },
  ],
  doctors: [
    { id: "d1", name: "Dr. Meera Rao", email: "rao@ohams.test", departmentId: 1, active: true },
    { id: "d2", name: "Dr. Arjun Shetty", email: "shetty@ohams.test", departmentId: 2, active: true },
  ],
  availability: {
    d1: [1, 2, 3, 4, 5].map((day) => ({ day, start: "09:00", end: "13:00", active: true })),
    d2: [1, 3, 5].map((day) => ({ day, start: "14:00", end: "17:00", active: true })),
  },
  leave: { d1: [], d2: [] },
  appointments: [],
};

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; // local date, not UTC
}

function seedAppointments() {
  const patients = ["A. Kumar", "S. Iyer", "R. Nair", "P. Gowda", "K. Reddy", "M. Joseph"];
  const reasons = ["Chest pain", "Follow-up", "BP check", "Ear pain", "Sinus", "Routine check"];
  const list = [];
  let n = 1;
  for (let day = -2; day <= 4; day++) {
    for (let i = 0; i < 3; i++) {
      const doc = i % 2 === 0 ? "d1" : "d2";
      const hour = doc === "d1" ? 9 + i : 14 + i;
      list.push({
        id: "a" + n,
        patient: patients[n % patients.length],
        doctorId: doc,
        date: todayISO(day),
        time: String(hour).padStart(2, "0") + ":00",
        reason: reasons[n % reasons.length],
        status: day < 0 ? (n % 4 === 0 ? "no_show" : "completed") : n % 7 === 0 ? "cancelled" : "booked",
      });
      n++;
    }
  }
  return list;
}

const Store = {
  load() {
    let raw = null;
    try { raw = localStorage.getItem("ohams"); } catch (e) {}
    if (raw) return JSON.parse(raw);
    const data = { ...SEED, appointments: seedAppointments() };
    this.save(data);
    return data;
  },
  save(data) {
    try { localStorage.setItem("ohams", JSON.stringify(data)); } catch (e) {}
  },
  reset() {
    try { localStorage.removeItem("ohams"); } catch (e) {}
  },
};
