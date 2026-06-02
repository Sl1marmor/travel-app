// src/api/apiFetch.js

const API = process.env.NODE_ENV === "production"
  ? "https://travel-app-f9xf.onrender.com/api"
  : "http://localhost:4000/api";

// Зберігаємо JWT токен між запитами
export const token = { value: localStorage.getItem("token") || null };

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Помилка запиту");
  return data;
}
