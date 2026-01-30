import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getStoriesWithLocation } from "../../data/api.js";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapPage = () => {
  const render = async () => `
    <section class="map-page container">
      <h2>Peta Cerita Pengguna</h2>
      <div id="map" style="height: 500px; margin-top: 20px;"></div>
      <ul id="storyList" class="story-list" style="margin-top: 20px;"></ul>
    </section>
  `;

  const afterRender = async () => {
    const stories = await getStoriesWithLocation();

    // Inisialisasi peta
    const map = L.map("map").setView([-2.5489, 118.0149], 5);

    // === Tile Layer dan Layer Control (🆕 Ditambahkan di sini) ===
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    );

    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, etc.",
      }
    );

    // Tambahkan default layer (OpenStreetMap)
    osm.addTo(map);

    // Tambahkan kontrol layer
    const baseLayers = {
      OpenStreetMap: osm,
      Satellite: satellite,
    };
    L.control.layers(baseLayers).addTo(map);
    // === Akhir tambahan Layer Control ===

    const markers = {};
    const storyList = document.getElementById("storyList");

    // tampilkan marker dan daftar story
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`
          <strong>${story.name}</strong><br/>
          ${story.description}<br/>
          <img src="${story.photoUrl}" alt="${story.name}" width="100"/>
        `);
        marker.storyId = story.id;
        markers[story.id] = marker;

        // tambahkan ke list
        const li = document.createElement("li");
        li.classList.add("story-item");
        li.dataset.id = story.id;
        li.innerHTML = `
          <strong>${story.name}</strong><br/>
          ${story.description}
        `;
        storyList.appendChild(li);
      }
    });

    // klik marker → highlight di list
    map.on("popupopen", (e) => {
      const id = e.popup._source.storyId;
      document
        .querySelectorAll(".story-item")
        .forEach((li) => li.classList.remove("active"));
      const activeLi = document.querySelector(`.story-item[data-id="${id}"]`);
      if (activeLi) activeLi.classList.add("active");
    });

    // klik list → fokus ke marker
    storyList.addEventListener("click", (e) => {
      const li = e.target.closest(".story-item");
      if (li) {
        const marker = markers[li.dataset.id];
        if (marker) {
          map.setView(marker.getLatLng(), 10);
          marker.openPopup();
        }
      }
    });
  };

  return { render, afterRender };
};

export default MapPage;
