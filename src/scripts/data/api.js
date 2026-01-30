import CONFIG from "../config.js";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/v1/register`,
  LOGIN: `${CONFIG.BASE_URL}/v1/login`,
  STORIES: `${CONFIG.BASE_URL}/v1/stories?location=1`,
};

// === GET STORIES DENGAN TOKEN LOGIN ===
export async function getStoriesWithLocation() {
  const token = localStorage.getItem("authToken"); // ambil token dari localStorage
  if (!token) {
    console.warn("Token belum tersedia. Silakan login terlebih dahulu.");
    return [];
  }

  try {
    const response = await fetch(ENDPOINTS.STORIES, {
      headers: {
        Authorization: `Bearer ${token}`, // gunakan token login
      },
    });

    console.log("Response:", response);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.listStory;
  } catch (error) {
    console.error("Gagal saat mengambil data stories:", error);
    return [];
  }
}

// === REGISTER ===
export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  } catch (error) {
    console.error("Gagal register:", error);
    throw error;
  }
}

// === LOGIN ===
export async function loginUser({ email, password }) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    // simpan token login ke localStorage
    localStorage.setItem("authToken", result.loginResult.token);
    return result;
  } catch (error) {
    console.error("Gagal login:", error);
    throw error;
  }
}

// === LOGOUT ===
export function logoutUser() {
  localStorage.removeItem("authToken");
}

// 
export async function addNewStory({ description, photo, lat, lon }) {
  const token = localStorage.getItem("authToken");

  if (!token) throw new Error("Anda belum login.");

  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  formData.append("lat", lat);
  formData.append("lon", lon);

  try {
    const response = await fetch(`${CONFIG.BASE_URL}/v1/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  } catch (error) {
    console.error("Gagal menambah story:", error);
    throw error;
  }
}
