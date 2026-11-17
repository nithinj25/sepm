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
  // Role guard: send the user back to login if they open a page for another role.
  require(role) {
    const u = this.user();
    if (!u || u.role !== role) {
      location.href = "index.html?denied=" + role;
      return null;
    }
    return u;
  },
};
