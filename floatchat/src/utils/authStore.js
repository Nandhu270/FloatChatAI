const USERS_KEY = "floatchat_users";
const SESSION_KEY = "floatchat_session";

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

export function addUser(user) {
  const users = getUsers();
  users.push({
    username: user.username.trim(),
    email: user.email.trim().toLowerCase(),
    password: user.password,
  });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function validateUser(email, password) {
  const users = getUsers();
  return users.find(
    (u) =>
      u.email === email.trim().toLowerCase() &&
      u.password === password
  );
}

export function setSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      username: user.username,
      email: user.email,
    })
  );
}

export function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
