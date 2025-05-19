export function initLayerMap(containerId, onClick) {
  const baseMaps = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }),
    "Topo Map": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap contributors'
    }),
    "Carto Dark": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    })
  };

  const map = L.map(containerId, {
    center: [-2.5489, 118.0149],
    zoom: 5,
    layers: [baseMaps["OpenStreetMap"]]
  });

  L.control.layers(baseMaps).addTo(map);

  let marker;
  map.on('click', (e) => {
    if (marker) {
      marker.setLatLng(e.latlng);
    } else {
      marker = L.marker(e.latlng).addTo(map);
    }
    if (typeof onClick === 'function') {
      onClick(e.latlng.lat, e.latlng.lng);
    }
  });

  return map;
}
