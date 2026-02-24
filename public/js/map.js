// Интерактивная карта мира
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('map')) return;
  
  console.log('Инициализация карты...');
  
  // Инициализация карты Leaflet
  const map = L.map('map').setView([20, 0], 2);
  
  // Добавление слоя карты
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);
  
  // Континенты и их координаты
  const continents = [
    {
      name: "Евразия",
      coords: [50, 100],
      description: "Самый большой материк, площадь 54 млн км²",
      facts: ["54 млн км²", "70% населения Земли", "Высшая точка: Эверест (8848 м)"]
    },
    {
      name: "Африка",
      coords: [0, 20],
      description: "Второй по величине материк",
      facts: ["30 млн км²", "Самый жаркий материк", "Самая длинная река: Нил"]
    },
    {
      name: "Северная Америка",
      coords: [45, -100],
      description: "Третий по величине материк",
      facts: ["24 млн км²", "Великие озёра", "Гранд-Каньон"]
    },
    {
      name: "Южная Америка",
      coords: [-20, -60],
      description: "Четвёртый по величине материк",
      facts: ["18 млн км²", "Амазонка", "Анды"]
    },
    {
      name: "Австралия",
      coords: [-25, 135],
      description: "Самый маленький материк",
      facts: ["8,5 млн км²", "Самый сухой материк", "Большой Барьерный риф"]
    },
    {
      name: "Антарктида",
      coords: [-80, 0],
      description: "Самый холодный материк",
      facts: ["14 млн км²", "90% льда Земли", "Средняя температура: -57°C"]
    }
  ];
  
  // Океаны
  const oceans = [
    {
      name: "Тихий океан",
      coords: [0, -160],
      description: "Самый большой океан",
      area: "165 млн км²"
    },
    {
      name: "Атлантический океан",
      coords: [0, -30],
      description: "Второй по величине океан",
      area: "106 млн км²"
    },
    {
      name: "Индийский океан",
      coords: [-20, 70],
      description: "Третий по величине океан",
      area: "73 млн км²"
    },
    {
      name: "Северный Ледовитый океан",
      coords: [85, 0],
      description: "Самый маленький океан",
      area: "14 млн км²"
    },
    {
      name: "Южный океан",
      coords: [-60, 0],
      description: "Океан, окружающий Антарктиду",
      area: "20 млн км²"
    }
  ];
  
  // Создание маркеров для континентов
  continents.forEach(continent => {
    const marker = L.marker(continent.coords).addTo(map);
    
    const popupContent = `
      <div class="map-popup">
        <h3>${continent.name}</h3>
        <p>${continent.description}</p>
        <ul>
          ${continent.facts.map(fact => `<li>${fact}</li>`).join('')}
        </ul>
        <button class="btn btn-primary learn-more" data-continent="${continent.name}">
          Узнать больше
        </button>
      </div>
    `;
    
    marker.bindPopup(popupContent);
    
    // Добавляем круг для визуализации размера
    L.circle(continent.coords, {
      color: '#3498db',
      fillColor: '#3498db',
      fillOpacity: 0.2,
      radius: 1000000
    }).addTo(map);
  });
  
  // Создание маркеров для океанов
  oceans.forEach(ocean => {
    const marker = L.marker(ocean.coords, {
      icon: L.divIcon({
        className: 'ocean-marker',
        html: '🌊',
        iconSize: [40, 40]
      })
    }).addTo(map);
    
    const popupContent = `
      <div class="map-popup">
        <h3>${ocean.name}</h3>
        <p>${ocean.description}</p>
        <p><strong>Площадь:</strong> ${ocean.area}</p>
      </div>
    `;
    
    marker.bindPopup(popupContent);
  });
  
  // Добавление слоя с границами стран
  const countriesLayer = L.layerGroup().addTo(map);
  
  // Загрузка данных о странах (упрощённый вариант)
  const countries = [
    { name: "Россия", coords: [60, 100], capital: "Москва" },
    { name: "США", coords: [40, -100], capital: "Вашингтон" },
    { name: "Китай", coords: [35, 105], capital: "Пекин" },
    { name: "Бразилия", coords: [-15, -55], capital: "Бразилиа" },
    { name: "Австралия", coords: [-25, 135], capital: "Канберра" }
  ];
  
  countries.forEach(country => {
    L.marker(country.coords, {
      icon: L.divIcon({
        className: 'country-marker',
        html: '📍',
        iconSize: [30, 30]
      })
    })
    .bindPopup(`<strong>${country.name}</strong><br>Столица: ${country.capital}`)
    .addTo(countriesLayer);
  });
  
  // Элементы управления
  const controlPanel = document.createElement('div');
  controlPanel.className = 'map-controls';
  controlPanel.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 1000;
    max-width: 250px;
  `;
  
  controlPanel.innerHTML = `
    <h4 style="margin-top: 0; color: #2c3e50;">Управление картой</h4>
    <div style="margin-bottom: 10px;">
      <label style="display: block; margin-bottom: 5px; font-size: 14px;">Слои карты:</label>
      <label style="display: block; margin-bottom: 5px;">
        <input type="checkbox" id="showContinents" checked> Континенты
      </label>
      <label style="display: block; margin-bottom: 5px;">
        <input type="checkbox" id="showOceans" checked> Океаны
      </label>
      <label style="display: block; margin-bottom: 5px;">
        <input type="checkbox" id="showCountries"> Страны
      </label>
    </div>
    <div style="margin-bottom: 10px;">
      <button id="zoomIn" class="btn" style="padding: 5px 10px; margin-right: 5px;">+</button>
      <button id="zoomOut" class="btn" style="padding: 5px 10px;">-</button>
      <button id="resetView" class="btn" style="padding: 5px 10px; margin-left: 5px;">Сброс</button>
    </div>
    <div>
      <p style="font-size: 12px; color: #666; margin: 0;">
        <strong>Инструкция:</strong> Кликните на маркер для информации
      </p>
    </div>
  `;
  
  document.getElementById('map').appendChild(controlPanel);
  
  // Обработчики для элементов управления
  document.getElementById('showContinents').addEventListener('change', function(e) {
    const markers = document.querySelectorAll('.leaflet-marker-icon');
    markers.forEach(marker => {
      if (marker.classList.contains('ocean-marker') || 
          marker.classList.contains('country-marker')) {
        return;
      }
      marker.style.display = e.target.checked ? '' : 'none';
    });
  });
  
  document.getElementById('showOceans').addEventListener('change', function(e) {
    const markers = document.querySelectorAll('.ocean-marker');
    markers.forEach(marker => {
      marker.style.display = e.target.checked ? '' : 'none';
    });
  });
  
  document.getElementById('showCountries').addEventListener('change', function(e) {
    if (e.target.checked) {
      countriesLayer.addTo(map);
    } else {
      map.removeLayer(countriesLayer);
    }
  });
  
  document.getElementById('zoomIn').addEventListener('click', () => {
    map.zoomIn();
  });
  
  document.getElementById('zoomOut').addEventListener('click', () => {
    map.zoomOut();
  });
  
  document.getElementById('resetView').addEventListener('click', () => {
    map.setView([20, 0], 2);
  });
  
  // Добавление стилей для маркеров
  const style = document.createElement('style');
  style.textContent = `
    .map-popup {
      min-width: 200px;
    }
    
    .map-popup h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    
    .map-popup ul {
      padding-left: 20px;
      margin: 10px 0;
    }
    
    .map-popup li {
      margin-bottom: 5px;
    }
    
    .learn-more {
      background: #3498db;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
      width: 100%;
    }
    
    .leaflet-popup-content {
      margin: 15px;
    }
    
    .ocean-marker, .country-marker {
      background: none;
      border: none;
    }
  `;
  document.head.appendChild(style);
  
  // Обработка кнопок "Узнать больше"
  map.on('popupopen', function(e) {
    const popup = e.popup;
    const learnMoreBtn = popup._contentNode.querySelector('.learn-more');
    
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', function() {
        const continent = this.getAttribute('data-continent');
        window.location.href = `/topics?continent=${encodeURIComponent(continent)}`;
      });
    }
  });
  
  // Информационная панель
  const infoPanel = document.createElement('div');
  infoPanel.className = 'map-info';
  infoPanel.style.cssText = `
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px 15px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 1000;
    max-width: 300px;
    font-size: 14px;
  `;
  
  infoPanel.innerHTML = `
    <strong>Интерактивная карта мира</strong><br>
    <span id="map-coords">Координаты: [20, 0]</span><br>
    <span id="map-zoom">Масштаб: 2</span>
  `;
  
  document.getElementById('map').appendChild(infoPanel);
  
  // Обновление информации о координатах и масштабе
  map.on('mousemove', function(e) {
    document.getElementById('map-coords').textContent = 
      `Координаты: [${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)}]`;
  });
  
  map.on('zoom', function() {
    document.getElementById('map-zoom').textContent = 
      `Масштаб: ${map.getZoom()}`;
  });
});