document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
    });
    
    const continents = [
        { name: "Евразия", lat: 50, lng: 100, desc: "Самый большой материк" },
        { name: "Африка", lat: 0, lng: 20, desc: "Самый жаркий" },
        { name: "Северная Америка", lat: 45, lng: -100, desc: "Великие озёра" },
        { name: "Южная Америка", lat: -20, lng: -60, desc: "Амазонка" },
        { name: "Австралия", lat: -25, lng: 135, desc: "Самый сухой" },
        { name: "Антарктида", lat: -80, lng: 0, desc: "Самый холодный" }
    ];
    
    continents.forEach(c => {
        const marker = L.marker([c.lat, c.lng]).addTo(map);
        marker.bindPopup(`<b>${c.name}</b><br>${c.desc}`);
    });
    
    document.getElementById('btn-map')?.addEventListener('click', () => {
        map.eachLayer(layer => { if (layer instanceof L.TileLayer) map.removeLayer(layer); });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    });
    
    document.getElementById('btn-satellite')?.addEventListener('click', () => {
        map.eachLayer(layer => { if (layer instanceof L.TileLayer) map.removeLayer(layer); });
        satelliteLayer.addTo(map);
    });
    
    document.getElementById('btn-reset')?.addEventListener('click', () => {
        map.setView([20, 0], 2);
    });
});
