// const BASE = 'https://travel-portal-backend-17lc.onrender.com';
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

// ── Auth ──────────────────────────────────────────────
export async function login(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.token) localStorage.setItem('admin_token', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('admin_token');
}

export function isAuthenticated() {
  return !!getToken();
}

// ── Destinations ──────────────────────────────────────
export async function getDestinationsApi() {
  return request('/api/public/destinations');
}

export async function getDestinationApi(slug) {
  return request(`/api/public/destinations/${slug}`);
}

export async function createDestination(body) {
  return request('/api/admin/destinations', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateDestination(id, body) {
  return request(`/api/admin/destinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteDestination(id) {
  return request(`/api/admin/destinations/${id}`, { method: 'DELETE' });
}

// ── Treks ─────────────────────────────────────────────
export async function getTreksApi() {
  return request('/api/public/treks');
}

export async function getTrekApi(slug) {
  return request(`/api/public/treks/${slug}`);
}

export async function createTrek(body) {
  return request('/api/admin/treks', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateTrek(id, body) {
  return request(`/api/admin/treks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// ── Packages ──────────────────────────────────────────
export async function getPackagesApi() {
  return request('/api/public/packages');
}

export async function getPackageApi(slug) {
  return request(`/api/public/packages/${slug}`);
}

export async function createPackage(body) {
  return request('/api/admin/packages', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updatePackage(id, body) {
  return request(`/api/admin/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// ── Itinerary ────────────────────────────────────────
export async function getItineraryApi(referenceId, type = 0) {
  return request(`/api/public/itinerary?referenceId=${referenceId}&type=${type}&referenceType=${type}&packageId=${referenceId}`);
}

export async function createItinerary(body) {
  return request('/api/admin/itinerary', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateItinerary(id, body) {
  return request(`/api/admin/itinerary/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteItinerary(id) {
  return request(`/api/admin/itinerary/${id}`, { method: 'DELETE' });
}

// ── FAQs ──────────────────────────────────────────────
export async function getFaqsApi(referenceId, type) {
  return request(`/api/public/faqs?referenceId=${referenceId}&type=${type}`);
}

export async function createFaq(body) {
  return request('/api/admin/faqs', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateFaq(id, body) {
  return request(`/api/admin/faqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteFaq(id) {
  return request(`/api/admin/faqs/${id}`, { method: 'DELETE' });
}

// ── Reviews ───────────────────────────────────────────
export async function getPendingReviews() {
  return request('/api/admin/reviews/pending');
}

export async function getAllReviewsApi() {
  return request('/api/public/reviews/all');
}

export async function approveReview(id) {
  return request(`/api/admin/reviews/${id}/approve`, { method: 'PUT' });
}

// ── Images ────────────────────────────────────────────────────────────────────
export const uploadImage = async (slug, file) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary credentials missing in .env');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (slug) formData.append('public_id', slug);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await res.json();
  return { url: data.secure_url };
};

export async function saveImage(body) {
  return request('/api/admin/images/save', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteImage(id) {
  return request(`/api/admin/images/${id}`, { method: 'DELETE' });
}
    