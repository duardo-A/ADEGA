const months = ["MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ", "JAN", "FEV"];

const regions = {
  "Centro-Oeste": {
    grainFactor: 1,
    cattleFactor: 1.03,
    locations: [
      { name: "Sorriso, MT", lat: -12.545, lon: -55.711 },
      { name: "Rio Verde, GO", lat: -17.792, lon: -50.919 },
      { name: "Dourados, MS", lat: -22.223, lon: -54.812 }
    ]
  },
  Sul: {
    grainFactor: 1.04,
    cattleFactor: 0.98,
    locations: [
      { name: "Cascavel, PR", lat: -24.955, lon: -53.455 },
      { name: "Passo Fundo, RS", lat: -28.263, lon: -52.407 },
      { name: "Chapeco, SC", lat: -27.101, lon: -52.615 }
    ]
  },
  Sudeste: {
    grainFactor: 1.02,
    cattleFactor: 1,
    locations: [
      { name: "Ribeirao Preto, SP", lat: -21.177, lon: -47.81 },
      { name: "Uberaba, MG", lat: -19.747, lon: -47.939 },
      { name: "Linhares, ES", lat: -19.394, lon: -40.065 }
    ]
  },
  Nordeste: {
    grainFactor: 0.97,
    cattleFactor: 0.96,
    locations: [
      { name: "Luis Eduardo Magalhaes, BA", lat: -12.095, lon: -45.786 },
      { name: "Balsas, MA", lat: -7.532, lon: -46.037 },
      { name: "Petrolina, PE", lat: -9.389, lon: -40.502 }
    ]
  },
  Norte: {
    grainFactor: 0.95,
    cattleFactor: 0.97,
    locations: [
      { name: "Palmas, TO", lat: -10.184, lon: -48.334 },
      { name: "Santarem, PA", lat: -2.443, lon: -54.708 },
      { name: "Vilhena, RO", lat: -12.741, lon: -60.145 }
    ]
  }
};

const grains = [
  { name: "Soja", unit: "saca 60 kg", price: 142.8, change: 1.8, icon: "🌱" },
  { name: "Milho", unit: "saca 60 kg", price: 68.4, change: -0.7, icon: "🌽" },
  { name: "Canola", unit: "saca 60 kg", price: 126.1, change: 2.3, icon: "🌼" },
  { name: "Aveia", unit: "saca 60 kg", price: 54.9, change: 0.9, icon: "🌾" }
];

const cattle = [
  { breed: "Nelore", market: "boi gordo padrao", price: 318 },
  { breed: "Angus", market: "premio carne premium", price: 336 },
  { breed: "Brangus", market: "cruza industrial", price: 329 },
  { breed: "Braford", market: "cruza britanica", price: 327 },
  { breed: "Senepol", market: "rustico tropical", price: 324 },
  { breed: "Tabapua", market: "zebu leite/corte", price: 315 }
];

const cattleMonths = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const cattleSeason = [0.97, 0.98, 0.99, 1.01, 1.03, 1.04, 1.02, 1, 1.02, 1.06, 1.09, 1.08];
let selectedCattleIndex = 0;
let selectedChartMonth = 10;

const crops = [
  { crop: "Soja", icon: "🌱", region: "Centro-Oeste", plant: [7, 9], harvest: [11, 1], cycle: "110 a 140 dias", note: "Janela forte apos regularizacao das chuvas." },
  { crop: "Milho 1a safra", icon: "🌽", region: "Centro-Oeste", plant: [7, 9], harvest: [11, 1], cycle: "120 a 150 dias", note: "Boa resposta a solo corrigido e nitrogenio." },
  { crop: "Milho safrinha", icon: "🌽", region: "Centro-Oeste", plant: [11, 0], harvest: [3, 5], cycle: "120 a 150 dias", note: "Plantio logo apos colheita da soja." },
  { crop: "Algodao", icon: "☁", region: "Centro-Oeste", plant: [8, 10], harvest: [3, 5], cycle: "150 a 180 dias", note: "Exige janela seca na colheita." },
  { crop: "Sorgo", icon: "🌾", region: "Centro-Oeste", plant: [11, 1], harvest: [4, 5], cycle: "100 a 120 dias", note: "Alternativa resistente para segunda safra." },
  { crop: "Canola", icon: "🌼", region: "Sul", plant: [1, 2], harvest: [6, 7], cycle: "130 a 150 dias", note: "Prefere clima frio e boa drenagem." },
  { crop: "Aveia", icon: "🌾", region: "Sul", plant: [1, 3], harvest: [6, 8], cycle: "120 a 160 dias", note: "Muito usada para grao e cobertura." },
  { crop: "Trigo", icon: "🌾", region: "Sul", plant: [2, 4], harvest: [7, 8], cycle: "110 a 150 dias", note: "Atenção ao frio e a umidade na espigacao." },
  { crop: "Feijao", icon: "", region: "Sudeste", plant: [6, 8], harvest: [9, 10], cycle: "80 a 100 dias", note: "Permite escalonamento em areas irrigadas." },
  { crop: "Cafe", icon: "☕", region: "Sudeste", plant: [8, 10], harvest: [2, 5], cycle: "perene", note: "Colheita concentra no periodo mais seco." },
  { crop: "Arroz", icon: "🌾", region: "Norte", plant: [7, 10], harvest: [0, 2], cycle: "100 a 130 dias", note: "Calendario depende de chuva e varzea." },
  { crop: "Mandioca", icon: "🥔", region: "Nordeste", plant: [8, 0], harvest: [5, 10], cycle: "10 a 18 meses", note: "Cultura rustica, ajustada ao regime local." },
  { crop: "Cana-de-acucar", icon: "🎋", region: "Sudeste", plant: [7, 10], harvest: [2, 8], cycle: "12 a 18 meses", note: "Colheita longa, ajustada ao teor de ATR e chuva." },
  { crop: "Girassol", icon: "🌻", region: "Centro-Oeste", plant: [10, 1], harvest: [3, 5], cycle: "90 a 120 dias", note: "Boa opcao para segunda safra e rotacao." },
  { crop: "Amendoim", icon: "🥜", region: "Sudeste", plant: [7, 9], harvest: [11, 1], cycle: "120 a 150 dias", note: "Exige solo bem drenado e colheita sem excesso de umidade." },
  { crop: "Cevada", icon: "🌾", region: "Sul", plant: [1, 3], harvest: [6, 8], cycle: "120 a 140 dias", note: "Cultura de inverno com foco em qualidade industrial." },
  { crop: "Centeio", icon: "🌾", region: "Sul", plant: [1, 2], harvest: [6, 8], cycle: "120 a 150 dias", note: "Boa rusticidade para cobertura e grao." },
  { crop: "Batata", icon: "🥔", region: "Sudeste", plant: [0, 2], harvest: [4, 6], cycle: "90 a 120 dias", note: "Pode variar bastante conforme altitude e irrigacao." },
  { crop: "Tomate", icon: "🍅", region: "Sudeste", plant: [1, 4], harvest: [5, 8], cycle: "100 a 130 dias", note: "Planejar tutoramento, irrigacao e controle fitossanitario." },
  { crop: "Cebola", icon: "🧅", region: "Sul", plant: [1, 3], harvest: [7, 9], cycle: "150 a 180 dias", note: "Fotoperiodo e cultivar definem a melhor janela." },
  { crop: "Uva", icon: "🍇", region: "Sul", plant: [5, 7], harvest: [10, 0], cycle: "perene", note: "Poda e clima seco na maturacao sao decisivos." },
  { crop: "Cacau", icon: "🍫", region: "Norte", plant: [7, 10], harvest: [2, 5], cycle: "perene", note: "Prefere calor, umidade e sombreamento bem manejado." },
  { crop: "Pastagem", icon: "🌿", region: "Centro-Oeste", plant: [7, 10], harvest: [0, 4], cycle: "perene", note: "Reforma no inicio das chuvas melhora pegamento e vigor." }
];

const fallbackForecast = [
  { hour: "09:00", temp: 25, code: 0 },
  { hour: "12:00", temp: 29, code: 1 },
  { hour: "15:00", temp: 31, code: 2 },
  { hour: "18:00", temp: 27, code: 3 },
  { hour: "21:00", temp: 22, code: 80 },
  { hour: "00:00", temp: 20, code: 61 }
];

const codeMap = {
  0: ["☀", "Céu limpo"],
  1: ["🌤", "Poucas nuvens"],
  2: ["⛅", "Parcialmente nublado"],
  3: ["☁", "Nublado"],
  45: ["🌫", "Neblina"],
  48: ["🌫", "Neblina"],
  51: ["🌦", "Garoa"],
  53: ["🌦", "Garoa"],
  55: ["🌦", "Garoa"],
  61: ["🌧", "Chuva"],
  63: ["🌧", "Chuva"],
  65: ["⛈", "Chuva forte"],
  80: ["🌧", "Pancadas"],
  81: ["🌧", "Pancadas"],
  82: ["⛈", "Temporal"],
  95: ["⛈", "Trovoadas"]
};

const dashboardPanel = document.querySelector(".dashboard");
const toolbarPanel = document.querySelector(".toolbar");
const marketPanel = document.querySelector("#mercado");

if (dashboardPanel && toolbarPanel && marketPanel) {
  toolbarPanel.classList.add("toolbar--market");
  dashboardPanel.insertBefore(toolbarPanel, marketPanel);
  toolbarPanel.id = "mercado";
  marketPanel.id = "mercado-panel";
  if (window.location.hash === "#mercado") {
    requestAnimationFrame(() => toolbarPanel.scrollIntoView({ block: "start" }));
    window.addEventListener("load", () => toolbarPanel.scrollIntoView({ block: "start" }), { once: true });
    setTimeout(() => toolbarPanel.scrollIntoView({ block: "start" }), 80);
  }
}

const regionSelect = document.querySelector("#regionSelect");
const locationSelect = document.querySelector("#locationSelect");
const cropSelect = document.querySelector("#cropSelect");
const marketGrid = document.querySelector("#marketGrid");
const cattleList = document.querySelector("#cattleList");
const cattleChart = document.querySelector("#cattleChart");
const chartTitle = document.querySelector("#chartTitle");
const chartBestMonth = document.querySelector("#chartBestMonth");
const chartNote = document.querySelector("#chartNote");
const monthRow = document.querySelector("#monthRow");
const calendarGrid = document.querySelector("#calendarGrid");
const cropDetail = document.querySelector("#cropDetail");

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
let weatherRequestId = 0;

function wrapSpan([start, end]) {
  return end >= start ? end - start + 1 : 12 - start + end + 1;
}

function rangeSegments([start, end]) {
  if (end >= start) {
    return [{ start, span: end - start + 1 }];
  }

  return [
    { start, span: 12 - start },
    { start: 0, span: end + 1 }
  ];
}

function formatRange(range) {
  return `${months[range[0]]} a ${months[range[1]]}`;
}

function setupControls() {
  Object.keys(regions).forEach((region) => {
    regionSelect.add(new Option(region, region));
  });

  crops.forEach((item, index) => {
    cropSelect.add(new Option(item.crop, String(index)));
  });

  regionSelect.value = "Centro-Oeste";
  cropSelect.value = "0";
  updateLocations();
}

function updateLocations() {
  locationSelect.innerHTML = "";
  regions[regionSelect.value].locations.forEach((place, index) => {
    locationSelect.add(new Option(place.name, String(index)));
  });
  locationSelect.value = "0";
}

function renderMarket() {
  const factor = regions[regionSelect.value].grainFactor;
  marketGrid.innerHTML = grains.map((grain) => {
    const price = grain.price * factor;
    const trendClass = grain.change < 0 ? "trend trend--down" : "trend";
    const sign = grain.change > 0 ? "+" : "";
    return `
      <article class="market-card">
        <div class="market-card__top">
          <h3>${grain.icon} ${grain.name}</h3>
          <span class="${trendClass}">${sign}${grain.change.toFixed(1)}%</span>
        </div>
        <strong>${money.format(price)}</strong>
        <span>${grain.unit} • base regional ${regionSelect.value}</span>
      </article>
    `;
  }).join("");

  document.querySelector("#heroSoy").textContent = money.format(grains[0].price * factor);
}

function renderCattle() {
  const factor = regions[regionSelect.value].cattleFactor;
  cattleList.innerHTML = cattle.map((item, index) => `
    <button class="cattle-row ${index === selectedCattleIndex ? "is-active" : ""}" type="button" data-cattle="${index}">
      <div>
        <strong>${item.breed}</strong>
        <span>${item.market}</span>
      </div>
      <div class="cattle-price">${money.format(item.price * factor)}/@</div>
    </button>
  `).join("");

  document.querySelector("#heroCattle").textContent = `${money.format(cattle[0].price * factor)}/@`;
  renderCattleChart();
}

function renderCattleChart() {
  const item = cattle[selectedCattleIndex] || cattle[0];
  const factor = regions[regionSelect.value].cattleFactor;
  const values = cattleSeason.map((multiplier) => Math.round(item.price * factor * multiplier));
  const min = Math.min(...values) - 8;
  const max = Math.max(...values) + 8;
  const width = 720;
  const height = 250;
  const pad = { top: 20, right: 24, bottom: 42, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const points = values.map((value, index) => {
    const x = pad.left + (innerW * index) / (values.length - 1);
    const y = pad.top + innerH - ((value - min) / (max - min)) * innerH;
    return { x, y, value, month: cattleMonths[index], index };
  });
  const best = points.reduce((winner, point) => point.value > winner.value ? point : winner, points[0]);
  const selected = points[selectedChartMonth] || best;
  selectedChartMonth = selected.index;

  chartTitle.textContent = `${item.breed}: preco medio por mes`;
  chartBestMonth.textContent = `Pico: ${best.month}`;
  chartNote.innerHTML = `
    <strong>${selected.month}: ${money.format(selected.value)}/@</strong>
    <span>${selected.index === best.index ? "Melhor ponto estimado para venda." : `Diferença para o pico: ${money.format(best.value - selected.value)}/@.`}</span>
  `;

  cattleChart.innerHTML = `
    <svg class="price-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafico de preco mensal da arroba">
      <defs>
        <linearGradient id="chartLine" x1="0" x2="1">
          <stop offset="0%" stop-color="#c8ff00" />
          <stop offset="100%" stop-color="#ff5a1f" />
        </linearGradient>
        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(200,255,0,0.24)" />
          <stop offset="100%" stop-color="rgba(200,255,0,0)" />
        </linearGradient>
      </defs>
      ${[0, 1, 2, 3].map((line) => {
        const y = pad.top + (innerH * line) / 3;
        return `<line class="chart-grid-line" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" />`;
      }).join("")}
      ${points.map((point) => `<line class="chart-month-line" x1="${point.x}" y1="${pad.top}" x2="${point.x}" y2="${height - pad.bottom}" />`).join("")}
      <path class="chart-area" d="M ${points[0].x} ${height - pad.bottom} L ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} L ${points[points.length - 1].x} ${height - pad.bottom} Z" />
      <polyline class="chart-line" points="${points.map((point) => `${point.x},${point.y}`).join(" ")}" />
      ${points.map((point) => `
        <g class="chart-point ${point.index === selected.index ? "is-selected" : ""}" data-month="${point.index}" tabindex="0">
          <circle cx="${point.x}" cy="${point.y}" r="${point.index === best.index ? 7 : 5}" />
          <text x="${point.x}" y="${height - 16}" text-anchor="middle">${point.month}</text>
          ${point.index === best.index ? `<text class="chart-badge" x="${point.x}" y="${point.y - 14}" text-anchor="middle">${money.format(point.value)}</text>` : ""}
        </g>
      `).join("")}
    </svg>
  `;
}

function renderCalendar() {
  monthRow.innerHTML = `<div>Cultura</div>${months.map((month) => `<div>${month}</div>`).join("")}`;

  const visibleCrops = crops;
  calendarGrid.innerHTML = visibleCrops.map((item, index) => {
    const plantBars = rangeSegments(item.plant).map((segment) => `
      <span class="bar bar--plant" style="--start:${segment.start};--span:${segment.span}" title="Plantio: ${formatRange(item.plant)}"></span>
    `).join("");
    const harvestBars = rangeSegments(item.harvest).map((segment) => `
      <span class="bar bar--harvest" style="--start:${segment.start};--span:${segment.span}" title="Colheita: ${formatRange(item.harvest)}"></span>
    `).join("");
    return `
      <div class="calendar-row">
        <div class="crop-name">${item.icon}<span>${item.crop}</span></div>
        ${months.map(() => `<div class="month-cell"></div>`).join("")}
        ${plantBars}
        ${harvestBars}
      </div>
    `;
  }).join("");

  const now = new Date();
  const currentIndex = months.indexOf(now.toLocaleString("pt-BR", { month: "short" }).slice(0, 3).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  const safeIndex = currentIndex >= 0 ? currentIndex : 1;
  calendarGrid.style.setProperty("--today-left", `calc(172px + (100% - 172px) * ${(safeIndex + now.getDate() / 31) / 12})`);
  renderCropDetail();
}

function renderCropDetail() {
  const item = crops[Number(cropSelect.value)] || crops[0];
  cropDetail.innerHTML = `
    <div class="detail-box"><span>Cultura</span><strong>${item.icon} ${item.crop}</strong></div>
    <div class="detail-box"><span>Plantio</span><strong>${formatRange(item.plant)}</strong></div>
    <div class="detail-box"><span>Colheita</span><strong>${formatRange(item.harvest)}</strong></div>
    <div class="detail-box"><span>Ciclo</span><strong>${item.cycle}</strong></div>
    <div class="detail-box"><span>Observação técnica</span><strong>${item.note}</strong></div>
  `;
}

function weatherLabel(code) {
  return codeMap[code] || ["☁", "Variação climática"];
}

function renderWeather(list, place) {
  const [icon, desc] = weatherLabel(list[0].code);
  document.querySelector("#weatherIcon").textContent = icon;
  document.querySelector("#weatherPlace").textContent = place.name;
  document.querySelector("#weatherTemp").textContent = `${Math.round(list[0].temp)}°C`;
  document.querySelector("#weatherDesc").textContent = desc;
  document.querySelector("#weatherStrip").innerHTML = list.map((item) => {
    const [tileIcon] = weatherLabel(item.code);
    return `
      <article class="weather-tile">
        <span>${item.hour}</span>
        <b>${tileIcon}</b>
        <strong>${Math.round(item.temp)}°C</strong>
      </article>
    `;
  }).join("");
}

async function fetchWeather() {
  const requestId = ++weatherRequestId;
  const place = regions[regionSelect.value].locations[Number(locationSelect.value)] || regions[regionSelect.value].locations[0];
  const status = document.querySelector("#weatherStatus");
  status.textContent = "Atualizando";
  try {
    const params = new URLSearchParams({
      latitude: place.lat,
      longitude: place.lon,
      hourly: "temperature_2m,weather_code",
      forecast_days: "2",
      timezone: "auto"
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error("Falha na previsão");
    const data = await response.json();
    const now = new Date();
    const startIndex = Math.max(0, data.hourly.time.findIndex((time) => new Date(time) >= now));
    const list = data.hourly.time.slice(startIndex, startIndex + 6).map((time, index) => ({
      hour: new Date(time).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      temp: data.hourly.temperature_2m[startIndex + index],
      code: data.hourly.weather_code[startIndex + index]
    }));
    if (requestId !== weatherRequestId) return;
    renderWeather(list.length ? list : fallbackForecast, place);
    status.textContent = "Open-Meteo";
  } catch (error) {
    if (requestId !== weatherRequestId) return;
    renderWeather(fallbackForecast, place);
    status.textContent = "Modo demo";
  }
}

function refreshAll() {
  renderMarket();
  renderCattle();
  renderCalendar();
  fetchWeather();
}

regionSelect.addEventListener("change", () => {
  updateLocations();
  refreshAll();
});

locationSelect.addEventListener("change", fetchWeather);
cropSelect.addEventListener("change", renderCropDetail);
cattleList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-cattle]");
  if (!row) return;
  selectedCattleIndex = Number(row.dataset.cattle);
  selectedChartMonth = 10;
  renderCattle();
});

cattleChart.addEventListener("click", (event) => {
  const point = event.target.closest("[data-month]");
  if (!point) return;
  selectedChartMonth = Number(point.dataset.month);
  renderCattleChart();
});

cattleChart.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const point = event.target.closest("[data-month]");
  if (!point) return;
  event.preventDefault();
  selectedChartMonth = Number(point.dataset.month);
  renderCattleChart();
});

setupControls();
refreshAll();
