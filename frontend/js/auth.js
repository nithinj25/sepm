// Demo login: stores the chosen role in sessionStorage. The real app uses JWT (see architecture.md).

const Auth = {
  login(role, doctorId) {
    sessionStorage.setItem("ohams_user", JSON.stringify({ role, doctorId }));
  },
  user() {
    try { return JSON.parse(sessionStorage.getItem("ohams_user")); } catch (e) { return null; }
  },
  logout() {
    sessionStorage.removeItem("ohams_user");
    location.href = "index.html";
  },
};
