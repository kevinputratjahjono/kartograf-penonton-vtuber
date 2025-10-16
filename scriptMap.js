// Inisialisasi peta tanpa kontrol zoom & attribution
const map = L.map('map', {
  zoomControl: false,
  attributionControl: false
}).setView([-2.5, 118], 5);

// Tambah tile layer dasar
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Fungsi warna gradasi hijau → merah
function getColor(d) {
  return d > 80 ? '#800026' :
         d > 60 ? '#BD0026' :
         d > 40 ? '#E31A1C' :
         d > 20 ? '#FD8D3C' :
         d > 10 ? '#FEB24C' :
         d > 5  ? '#ADFF2F' :
         d > 0  ? '#7CFC00' :
                  '#00FF00';
}

// Style tiap provinsi
function style(feature) {
  return {
    fillColor: getColor(feature.properties.value || 0),
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '',
    fillOpacity: 0.7
  };
}

// Variabel global untuk layer geojson
let geojsonLayer;

// Load GeoJSON
let geojsonUrl = "indonesia_provinces.geojson"; // cukup pakai relative path
fetch(geojsonUrl)
  .then(res => res.json())
  .then(data => {
    data.features.forEach(f => {
      f.properties.value = Math.floor(Math.random() * 100);
    });

    geojsonLayer = L.geoJson(data, {  // ✅ simpan ke variabel global
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  });

// Highlight interaktif
function highlightFeature(e) {
  const layer = e.target;
  layer.setStyle({
    weight: 2,
    color: '#333',
    dashArray: '',
    fillOpacity: 0.8
  });
  layer.bringToFront();
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target); // ✅ ini yang benar
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

// Info box
const info = L.control({position: 'topright'});
info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};
info.update = function (props) {
  this._div.innerHTML = '<h4>Data Provinsi</h4>' + (props ?
    '<b>' + (props.NAME_1 || props.name) + '</b><br />' +
    (props.value || 0) + ' data'
    : 'Arahkan mouse ke provinsi');
};
info.addTo(map);

// Legend
const legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 5, 10, 20, 40, 60, 80];
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(map);

