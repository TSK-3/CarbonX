const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

export const api = {
  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body)
    }),
  login: (body) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body)
    }),
  listFarms: (token) => request("/api/farms", { token }),
  getFarm: (token, id) => request(`/api/farms/${id}`, { token }),
  createFarm: (token, body) =>
    request("/api/farms", {
      method: "POST",
      token,
      body: JSON.stringify(body)
    }),
  calculateFarm: (token, id) =>
    request(`/api/farms/${id}/calculate`, {
      method: "POST",
      token
    })
};
