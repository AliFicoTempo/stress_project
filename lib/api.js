// lib/api.js
const BASE = "/api/gas";

async function apiGet(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE}?${qs}`;
  const r = await fetch(url);
  return r.json();
}

async function apiPost(body = {}) {
  const r = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return r.json();
}

export async function login(username, password) {
  return apiPost({ action: "login", username, password });
}

export async function getShipments({ start, end, name } = {}) {
  const params = {};
  if (start) params.start = start;
  if (end) params.end = end;
  if (name) params.name = name;
  return apiGet({ action: "getShipments", ...params });
}

export async function addShipment(payload) {
  return apiPost({ action: "addShipment", ...payload });
}

export async function updateShipment(payload) {
  return apiPost({ action: "updateShipment", ...payload });
}

export async function deleteShipment(payload) {
  return apiPost({ action: "deleteShipment", ...payload });
}

export async function getAnalytics({ start, end, name } = {}) {
  const params = {};
  if (start) params.start = start;
  if (end) params.end = end;
  if (name) params.name = name;
  return apiGet({ action: "getAnalytics", ...params });
}

export async function getAllUsers() {
  return apiGet({ action: "getAllUsers" });
}