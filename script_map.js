// --- INISIALISASI PETA ---
const map = L.map("map", {
  zoomControl: false,
  attributionControl: false
}).setView([-2, 118], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: ""
}).addTo(map);

// Daftar koordinat kota besar Indonesia
const cityCoords = {
  "Jakarta": [-6.2, 106.8],
  "Bandung": [-6.91, 107.61],
  "Surabaya": [-7.25, 112.75],
  "Medan": [3.60, 98.67],
  "Makassar": [-5.14, 119.41],
  "Yogyakarta": [-7.8, 110.37],
  "Semarang": [-6.99, 110.42],
  "Palembang": [-2.98, 104.75],
  "Denpasar": [-8.65, 115.22],
  "Balikpapan": [-1.27, 116.83]
};

// Baca CSV lokal
Papa.parse("data.csv", {
  download: true,
  header: true,
  complete: function(results) {
    const counts = {};

    // Hitung jumlah per lokasi
    results.data.forEach(row => {
      if (!row.lokasi) return;
      const lokasi = row.lokasi.trim();
      counts[lokasi] = (counts[lokasi] || 0) + 1;
    });

    // Plot ke peta
    Object.keys(counts).forEach(lokasi => {
      if (!cityCoords[lokasi]) return;

      const [lat, lng] = cityCoords[lokasi];
      const jumlah = counts[lokasi];

      L.circleMarker([lat, lng], {
        radius: 5 + jumlah * 2, // ukuran lingkaran = jumlah data
        fillColor: "#007bff",
        color: "#333",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      })
      .bindPopup(`<b>${lokasi}</b><br>Jumlah pengisi: ${jumlah}`)
      .addTo(map);
    });
  }
});
