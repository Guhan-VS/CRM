const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('access_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  localStorage.setItem('access_token', data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem('access_token');
}

export async function fetchMe() {
  const res = await fetch(`${API_BASE}/users/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, { headers: authHeaders() });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function postData(endpoint, payload) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || JSON.stringify(err));
  }
  return res.json();
}

export async function patchData(endpoint, id, payload) {
  const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || JSON.stringify(err));
  }
  return res.json();
}

export async function handleQueryAction(queryId, action) {
  const res = await fetch(`${API_BASE}/queries/${queryId}/approve`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ action })
  });
  if (!res.ok) throw new Error('Action failed');
  return res.json();
}
