// Reference types
export const REF_TYPE = { PACKAGE: 0, TREK: 1, DESTINATION: 2 };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/public';

// Helper function for GET requests
async function fetchGet(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // cache: 'no-store' // uncomment if you want fresh data on every load
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status} on ${endpoint}`);
    const json = await res.json();
    // Handle ApiResponse<T> wrapper with success+data fields
    if (json && json.success !== undefined && json.data !== undefined) {
      return json.data;
    }
    // Handle wrapper with just .data (no success field) e.g. { data: [...], Count: N }
    if (json && json.data !== undefined && !Array.isArray(json) && typeof json === 'object') {
      return json.data;
    }
    return json;
  } catch (error) {
    console.error(`Fetch GET Error [${endpoint}]:`, error);
    return null;
  }
}

// Helper function for POST requests
async function fetchPost(endpoint, body) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status} on ${endpoint}`);
    const json = await res.json();
    if (json && json.success !== undefined && json.data !== undefined) {
      return json.data;
    }
    return json;
  } catch (error) {
    console.error(`Fetch POST Error [${endpoint}]:`, error);
    return null;
  }
}

// ── Destinations ──────────────────────────────────────────────────────────────
export async function getDestinations() {
  const data = await fetchGet('/destinations');
  return Array.isArray(data) ? data : [];
}

export async function getDestinationBySlug(slug) {
  const data = await fetchGet(`/destinations/${slug}`);
  return data;
}

// ── Packages ──────────────────────────────────────────────────────────────────
export async function getPackages() {
  const data = await fetchGet('/packages');
  return Array.isArray(data) ? data : [];
}

export async function getPackageBySlug(slug) {
  const data = await fetchGet(`/packages/${slug}`);
  return data;
}

export async function getPackagesByDestination(destinationId) {
  const data = await fetchGet(`/packages/destination/${destinationId}`);
  return Array.isArray(data) ? data : [];
}

// ── Treks ─────────────────────────────────────────────────────────────────────
export async function getTreks() {
  const data = await fetchGet('/treks');
  return Array.isArray(data) ? data : [];
}

export async function getTrekBySlug(slug) {
  const data = await fetchGet(`/treks/${slug}`);
  return data;
}

// ── Itinerary ─────────────────────────────────────────────────────────────────
export async function getItinerary(referenceId, referenceType = REF_TYPE.PACKAGE) {
  const data = await fetchGet(`/itinerary?referenceId=${referenceId}&type=${referenceType}&referenceType=${referenceType}&packageId=${referenceId}`);
  return Array.isArray(data) ? data : [];
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export async function getReviews(referenceId, referenceType) {
  const data = await fetchGet(`/reviews?referenceId=${referenceId}&type=${referenceType}`);
  return Array.isArray(data) ? data : [];
}

export async function getAllReviews() {
  const data = await fetchGet('/reviews/all');
  return Array.isArray(data) ? data : [];
}

export async function submitReview(reviewData) {
  const data = await fetchPost('/reviews', reviewData);
  return data;
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
export async function getFaqs(referenceId, referenceType) {
  const data = await fetchGet(`/faqs?referenceId=${referenceId}&type=${referenceType}`);
  return Array.isArray(data) ? data : [];
}

// ── Gallery Images ────────────────────────────────────────────────────────────
export async function getGallery(parentId, referenceType) {
  const data = await fetchGet(`/images?parentId=${parentId}&type=${referenceType}`);
  return Array.isArray(data) ? data : [];
}

// ── Enquiries ─────────────────────────────────────────────────────────────────
export async function submitEnquiry(enquiryData) {
  const data = await fetchPost('/enquiry', enquiryData);
  return data;
}
