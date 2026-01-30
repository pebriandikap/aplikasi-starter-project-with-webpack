import { addNewStory } from "../data/api.js";

const AddStoryPage = () => {
  let selectedLat = null;
  let selectedLng = null;
  let mediaStream = null;

  const render = async () => `
  <section class="container">
    <h2>Tambah Story Baru</h2>

    <form id="addStoryForm" class="auth-form">
      <label>Deskripsi</label>
      <textarea id="description" required placeholder="Tulis ceritamu di sini..."></textarea>

      <label>Upload Foto</label>
      <input type="file" id="photo" accept="image/*" required />

      <label>Atau Ambil Foto dengan Kamera</label>
      <div class="camera-section">
        <button type="button" id="openCameraBtn">Buka Kamera</button>
        <video id="cameraPreview" autoplay playsinline style="display:none; width:100%; border-radius:8px;"></video>
        <canvas id="photoCanvas" style="display:none;"></canvas>
        <button type="button" id="captureBtn" style="display:none;">Ambil Foto</button>
        <button type="button" id="closeCameraBtn" style="display:none;">Tutup Kamera</button>
      </div>

      <label>Pilih Lokasi di Peta</label>
      <div id="selectMap" style="height: 300px; border: 1px solid #ccc; border-radius: 8px;"></div>
      <p id="coordsInfo">Belum ada lokasi yang dipilih.</p>

      <button type="submit">Kirim Story</button>
      <div id="loader" class="loader" style="display:none;"></div>
    </form>
  </section>
`;

  const afterRender = async () => {
    // 🔹 Utility: Membuat notifikasi kecil (toast) dengan timeout auto-hilang
    const showToast = (msg, type = "info") => {
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    };

    // 🔹 Inisialisasi media stream untuk akses kamera
    const openCameraBtn = document.getElementById("openCameraBtn");
    const closeCameraBtn = document.getElementById("closeCameraBtn");
    const captureBtn = document.getElementById("captureBtn");
    const video = document.getElementById("cameraPreview");
    const canvas = document.getElementById("photoCanvas");
    const photoInput = document.getElementById("photo");

    openCameraBtn.addEventListener("click", async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = mediaStream;
        video.style.display = "block";
        captureBtn.style.display = "inline-block";
        closeCameraBtn.style.display = "inline-block";
        openCameraBtn.style.display = "none";
        showToast("Kamera dibuka", "info");
      } catch (err) {
        console.error(err);
        showToast("Gagal mengakses kamera", "error");
      }
    });

    captureBtn.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Konversi hasil tangkapan menjadi Blob (file)
      canvas.toBlob((blob) => {
        const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;

        showToast("Foto berhasil diambil!", "success");
      }, "image/jpeg");

      // tampilkan preview hasil (opsional)
      video.style.display = "none";
      captureBtn.style.display = "none";
    });

    closeCameraBtn.addEventListener("click", () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop()); // stop semua track
        mediaStream = null;
        showToast("Kamera ditutup", "info");
      }
      video.style.display = "none";
      captureBtn.style.display = "none";
      closeCameraBtn.style.display = "none";
      openCameraBtn.style.display = "inline-block";
    });

    //  Inisialisasi peta untuk pilih lokasi
    const map = L.map("selectMap").setView([-6.2, 106.816666], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    let marker = null;
    map.on("click", (e) => {
      selectedLat = e.latlng.lat;
      selectedLng = e.latlng.lng;

      if (marker) map.removeLayer(marker);
      marker = L.marker([selectedLat, selectedLng]).addTo(map);

      document.getElementById("coordsInfo").textContent =
        `Lokasi: ${selectedLat.toFixed(4)}, ${selectedLng.toFixed(4)}`;
    });

    // submit form tambah story

    const form = document.getElementById("addStoryForm");
    const loader = document.getElementById("loader");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = document.getElementById("description").value.trim();
      const photo = document.getElementById("photo").files[0];

      if (!description) return showToast("Deskripsi harus diisi!", "error");
      if (!photo) return showToast("Ambil atau pilih foto terlebih dahulu!", "error");
      if (!selectedLat || !selectedLng)
        return showToast("Pilih lokasi di peta!", "error");

      loader.style.display = "block"; 

      try {
        // 🔸 Panggil fungsi API untuk kirim data ke backend (POST formData)
        await addNewStory({
          description,
          photo,
          lat: selectedLat,
          lon: selectedLng,
        });

        // tampil pesan sukses
        showToast("Story berhasil dikirim!", "success");
        form.reset();
        window.location.hash = "#/map";
      } catch (error) {
        // 🔸 tampil pesan error
        console.error(error);
        showToast("Gagal menambah story: " + error.message, "error");
      } finally {
        loader.style.display = "none";
      }
    });
  };

  return { render, afterRender };
};

export default AddStoryPage;
