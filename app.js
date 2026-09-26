"use strict";

// GitHub Pages no permite definir frame-ancestors como cabecera HTTP. La página
// permanece oculta cuando está embebida y, cuando el navegador lo permite, sale
// del frame. La protección definitiva se documenta junto con el hosting.
function enforceFrameProtection() {
  if (window.top === window.self) {
    document.documentElement.classList.remove("frame-check-pending");
    return;
  }

  document.documentElement.classList.add("is-framed");
  try {
    window.top.location.href = window.location.href;
  } catch {
    // En un iframe con sandbox la navegación puede estar bloqueada: se conserva
    // el estado oculto para no ofrecer una superficie clickjacking.
  }
}

enforceFrameProtection();

const WHATSAPP_NUMBER = "5493476658161";
const CATALOG_MAX_BYTES = 1_000_000;
const CATALOG_MAX_PRODUCTS = 150;
const PRODUCT_TEXT_MAX_LENGTH = 240;
const APP_IMAGE_ORIGIN = "https://iphone-style-ar.github.io";
const APP_IMAGE_REPOSITORY = "/iphone-style-ar/iPhone-Style/";

const fallbackCatalog = [
  { category: "Usado premium", name: "iPhone 13", storage: "128 GB", color: "Midnight", battery: "84%", transfer: "$553.316", installment: "$250.837", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5174.jpeg" },
  { category: "Usado premium", name: "iPhone 13", storage: "128 GB", color: "Midnight", battery: "88%", transfer: "$569.590", installment: "$258.214", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5174.jpeg" },
  { category: "Usado premium", name: "iPhone 13", storage: "256 GB", color: "Red", battery: "100%", transfer: "$602.138", installment: "$272.969", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5174.jpeg" },
  { category: "Usado premium", name: "iPhone 15", storage: "128 GB", color: "Blue", battery: "84%", transfer: "$813.700", installment: "$368.877", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5178.jpeg" },
  { category: "Usado premium", name: "iPhone 15", storage: "128 GB", color: "Black", battery: "90%", transfer: "$846.248", installment: "$383.632", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5178.jpeg" },
  { category: "Usado premium", name: "iPhone 15 Pro", storage: "128 GB", color: "Black", battery: "86%", transfer: "$1.025.262", installment: "$464.785", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5183.jpeg" },
  { category: "Usado premium", name: "iPhone 15 Pro", storage: "128 GB", color: "White", battery: "87%", transfer: "$1.025.262", installment: "$464.785", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5183.jpeg" },
  { category: "Usado premium", name: "iPhone 15 Pro", storage: "128 GB", color: "Black", battery: "88%", transfer: "$1.025.262", installment: "$464.785", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5183.jpeg" },
  { category: "Usado premium", name: "iPhone 15 Pro", storage: "128 GB", color: "Black", battery: "91%", transfer: "$1.041.536", installment: "$472.163", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5183.jpeg" },
  { category: "Usado premium", name: "iPhone 15 Pro", storage: "128 GB", color: "Black", battery: "100%", transfer: "$1.074.084", installment: "$486.918", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5183.jpeg" },
  { category: "Usado premium", name: "iPhone 15 Pro Max", storage: "256 GB", color: "Black", battery: "100%", transfer: "$1.269.372", installment: "$575.449", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5184.jpeg" },
  { category: "Usado premium", name: "iPhone 16", storage: "128 GB", color: "Black", battery: "90%", transfer: "$1.074.084", installment: "$486.918", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5185.jpeg" },
  { category: "Usado premium", name: "iPhone 16", storage: "128 GB", color: "Black", battery: "93%", transfer: "$1.074.084", installment: "$486.918", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5185.jpeg" },
  { category: "Usado premium", name: "iPhone 16", storage: "128 GB", color: "Pink", battery: "93%", transfer: "$1.074.084", installment: "$486.918", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5185.jpeg" },
  { category: "Usado premium", name: "iPhone 16 Pro", storage: "128 GB", color: "White", battery: "91%", transfer: "$1.301.920", installment: "$590.204", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5187.jpeg" },
  { category: "Usado premium", name: "iPhone 16 Pro Max", storage: "256 GB", color: "Black", battery: "92%", transfer: "$1.497.208", installment: "$678.734", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5189.jpeg" },
  { category: "Outlet", name: "iPhone 13 Pro Max", storage: "128 GB", color: "Sierra Blue", battery: "68%", detail: "Sin Face ID", transfer: "$699.782", installment: "$317.235", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5177.jpeg" },
  { category: "Outlet", name: "iPhone 13 Pro Max", storage: "128 GB", color: "Alpine Green", battery: "76%", detail: "Cámara x0,5 no funciona", transfer: "$699.782", installment: "$317.235", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5177.jpeg" },
  { category: "Outlet", name: "iPhone 16 Pro", storage: "128 GB", color: "Natural", battery: "91%", detail: "Pantalla cambiada", transfer: "$1.139.180", installment: "$516.428", image: "https://iphone-style-ar.github.io/iPhone-Style/img/IMG_5187.jpeg" },
];

// Valores sincronizados desde la planilla de inventario.
const paymentDetails = [
  { usd: "US$ 340", cash: "$537.200", installment6: "$134.640", installment9: "$97.138", installment12: "$82.536", installment18: "$59.943" },
  { usd: "US$ 350", cash: "$553.000", installment6: "$138.600", installment9: "$99.995", installment12: "$84.964", installment18: "$61.706" },
  { usd: "US$ 370", cash: "$584.600", installment6: "$146.520", installment9: "$105.709", installment12: "$89.819", installment18: "$65.232" },
  { usd: "US$ 500", cash: "$790.000", installment6: "$198.000", installment9: "$142.850", installment12: "$121.377", installment18: "$88.151" },
  { usd: "US$ 520", cash: "$821.600", installment6: "$205.920", installment9: "$148.564", installment12: "$126.232", installment18: "$91.677" },
  { usd: "US$ 630", cash: "$995.400", installment6: "$249.480", installment9: "$179.990", installment12: "$152.935", installment18: "$111.070" },
  { usd: "US$ 630", cash: "$995.400", installment6: "$249.480", installment9: "$179.990", installment12: "$152.935", installment18: "$111.070" },
  { usd: "US$ 630", cash: "$995.400", installment6: "$249.480", installment9: "$179.990", installment12: "$152.935", installment18: "$111.070" },
  { usd: "US$ 640", cash: "$1.011.200", installment6: "$253.440", installment9: "$182.847", installment12: "$155.362", installment18: "$112.833" },
  { usd: "US$ 660", cash: "$1.042.800", installment6: "$261.360", installment9: "$188.561", installment12: "$160.218", installment18: "$116.359" },
  { usd: "US$ 780", cash: "$1.232.400", installment6: "$308.881", installment9: "$222.845", installment12: "$189.348", installment18: "$137.515" },
  { usd: "US$ 660", cash: "$1.042.800", installment6: "$261.360", installment9: "$188.561", installment12: "$160.218", installment18: "$116.359" },
  { usd: "US$ 660", cash: "$1.042.800", installment6: "$261.360", installment9: "$188.561", installment12: "$160.218", installment18: "$116.359" },
  { usd: "US$ 660", cash: "$1.042.800", installment6: "$261.360", installment9: "$188.561", installment12: "$160.218", installment18: "$116.359" },
  { usd: "US$ 800", cash: "$1.264.000", installment6: "$316.801", installment9: "$228.559", installment12: "$194.203", installment18: "$141.041" },
  { usd: "US$ 920", cash: "$1.453.600", installment6: "$364.321", installment9: "$262.843", installment12: "$223.334", installment18: "$162.198" },
  { usd: "US$ 430", cash: "$679.400", installment6: "$170.280", installment9: "$122.851", installment12: "$104.384", installment18: "$75.810" },
  { usd: "US$ 430", cash: "$679.400", installment6: "$170.280", installment9: "$122.851", installment12: "$104.384", installment18: "$75.810" },
  { usd: "US$ 700", cash: "$1.106.000", installment6: "$277.200", installment9: "$199.989", installment12: "$169.928", installment18: "$123.411" },
];

fallbackCatalog.forEach((product, index) => Object.assign(product, paymentDetails[index]));

// Fuente de verdad del catálogo. Google Sheets publica este CSV al actualizar la planilla.
const CATALOG_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQomt3Xo_DZR7eqN9v1u6dshs5se0jl1BDyUwb0LFCBahX9DHDda2FqDj5t2sESNWDvwtQksAepJAuu/pub?gid=0&single=true&output=csv";
const DEFAULT_PRODUCT_IMAGE = "logo-iph-style.png.PNG";
const CATALOG_REFRESH_INTERVAL = 60_000;
const CATALOG_REQUEST_TIMEOUT = 12_000;
let catalog = fallbackCatalog.map((product) => ({ ...product }));

const catalogCategories = [
  {
    id: "nuevos-sellados",
    category: "Nuevo sellado",
    eyebrow: "Estreno garantizado",
    title: "Nuevos en caja sellada.",
    description: "Equipos nuevos con un año de garantía oficial Apple.",
    guarantee: "1 año de garantía oficial Apple",
  },
  {
    id: "usados-premium",
    category: "Usado premium",
    eyebrow: "Selección verificada",
    title: "Usados premium.",
    description: "Equipos revisados, con batería informada y 90 días de garantía.",
    guarantee: "90 días de garantía",
  },
  {
    id: "outlet",
    category: "Outlet",
    eyebrow: "Oportunidades seleccionadas",
    title: "Outlet.",
    description: "Equipos con detalles específicos informados de forma clara y 30 días de garantía.",
    guarantee: "30 días de garantía",
  },
];

// La estructura se mantiene separada de los productos: cada actualización de la
// planilla se agrupa de nuevo sin que haya que tocar la navegación.
const catalogModelSections = {
  "nuevos-sellados": [
    { id: "nuevos-sellados-iphone-17", label: "iPhone 17", family: "IPHONE 17", kind: "base" },
    { id: "nuevos-sellados-iphone-17-pro", label: "iPhone 17 Pro", family: "IPHONE 17 PRO", kind: "pro" },
    { id: "nuevos-sellados-iphone-17-pro-max", label: "iPhone 17 Pro Max", family: "IPHONE 17 PRO MAX", kind: "exact" },
  ],
  "usados-premium": [
    { id: "usados-premium-iphone-13", label: "iPhone 13", family: "IPHONE 13", kind: "generation" },
    { id: "usados-premium-iphone-14", label: "iPhone 14", family: "IPHONE 14", kind: "generation" },
    { id: "usados-premium-iphone-15", label: "iPhone 15", family: "IPHONE 15", kind: "generation" },
    { id: "usados-premium-iphone-16", label: "iPhone 16", family: "IPHONE 16", kind: "generation" },
    { id: "usados-premium-iphone-17", label: "iPhone 17", family: "IPHONE 17", kind: "generation" },
  ],
};

const installmentOptions = [
  { label: "3 cuotas", key: "installment" },
  { label: "6 cuotas", key: "installment6" },
  { label: "9 cuotas", key: "installment9" },
  { label: "12 cuotas", key: "installment12" },
  { label: "18 cuotas", key: "installment18" },
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const catalogGroups = document.querySelector("#catalog-groups");
const catalogStatus = document.querySelector("#catalog-status");
let selectedTradeInProduct = null;
let catalogFingerprint = "";
let catalogRefreshInFlight = false;

function sanitizeCatalogText(value = "", maxLength = PRODUCT_TEXT_MAX_LENGTH) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function createElement(tagName, { className = "", text = "", attributes = {}, dataset = {} } = {}) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
  Object.entries(dataset).forEach(([name, value]) => { element.dataset[name] = String(value); });
  return element;
}

function normalizeHeader(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toUpperCase();
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function sheetCategory(row) {
  const text = normalizeHeader(row.join(" "));
  if (text.includes("NUEVOS EN CAJA")) return "Nuevo sellado";
  if (text.includes("USADOS PREMIUM")) return "Usado premium";
  if (text.includes("OUTLET")) return "Outlet";
  return null;
}

function normalizeCatalogCategory(value = "") {
  const text = normalizeHeader(value);
  if (text.includes("NUEVO")) return "Nuevo sellado";
  if (text.includes("PREMIUM") || text.includes("USADO")) return "Usado premium";
  if (text.includes("OUTLET")) return "Outlet";
  return null;
}

function sheetValue(row, headers, name) {
  const index = headers.indexOf(name);
  return index >= 0 ? sanitizeCatalogText(row[index]) : "";
}

function firstSheetValue(row, headers, names) {
  return names.map((name) => sheetValue(row, headers, name)).find(Boolean) || "";
}

function displayPrice(value) {
  const cleanValue = String(value || "").trim();
  if (!cleanValue) return "A consultar";
  return cleanValue.startsWith("$") ? cleanValue : `$${cleanValue}`;
}

function imageUrls(value) {
  const image = sanitizeCatalogText(value, 2_000).match(/https?:\/\/[^\s"')]+/i)?.[0] || "";
  if (!image) return [DEFAULT_PRODUCT_IMAGE];

  try {
    const url = new URL(image);
    if (url.protocol !== "https:") return [DEFAULT_PRODUCT_IMAGE];

    const driveFileId = url.hostname === "drive.google.com"
      ? url.pathname.match(/\/d\/([^/]+)/)?.[1] || url.searchParams.get("id")
      : null;
    if (driveFileId) {
      const id = encodeURIComponent(driveFileId);
      return [
        `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
        `https://drive.usercontent.google.com/download?id=${id}&export=view&confirm=t`,
        `https://drive.google.com/uc?export=view&id=${id}`,
      ];
    }

    if (url.hostname === "github.com" && url.pathname.startsWith(`${APP_IMAGE_REPOSITORY}blob/`)) {
      const [owner, repository, , branch, ...filePath] = url.pathname.split("/").filter(Boolean);
      if (owner && repository && branch && filePath.length) {
        return [`https://raw.githubusercontent.com/${owner}/${repository}/${branch}/${filePath.map(encodeURIComponent).join("/")}`];
      }
    }

    const isSameRepositoryRawImage = url.hostname === "raw.githubusercontent.com"
      && url.pathname.startsWith(APP_IMAGE_REPOSITORY);
    const isSameOriginImage = url.origin === APP_IMAGE_ORIGIN;
    const isGoogleContentImage = url.hostname.endsWith(".googleusercontent.com");

    if (isSameRepositoryRawImage || isSameOriginImage || isGoogleContentImage) return [url.href];
  } catch {
    // Una URL inválida o fuera de los orígenes permitidos no llega al DOM.
  }

  return [DEFAULT_PRODUCT_IMAGE];
}

function createProductImage(product, { alt = "", loading = "" } = {}) {
  const sources = (product.imageFallbacks?.length ? product.imageFallbacks : [product.image || DEFAULT_PRODUCT_IMAGE])
    .filter((source) => source === DEFAULT_PRODUCT_IMAGE || imageUrls(source)[0] === source);
  const safeSources = sources.length ? sources : [DEFAULT_PRODUCT_IMAGE];
  const image = createElement("img", {
    className: "product-image product-image-main",
    attributes: {
      src: safeSources[0],
      alt: sanitizeCatalogText(alt),
      decoding: "async",
      referrerpolicy: "no-referrer",
    },
    dataset: {
      imageSources: JSON.stringify(safeSources),
      imageSourceIndex: "0",
    },
  });
  if (loading) image.loading = loading;
  return image;
}

function createProductDetails(product) {
  const omitted = new Set([
    "MODELO", "GB", "CAPACIDAD", "COLOR", "BATERIA", "DETALLES", "IMAGEN",
    "USD", "PESOS", "EFECTIVO", "TRANSFERENCIA", "3 CUOTAS FIJAS", "6 CUOTAS FIJAS",
    "9 CUOTAS FIJAS", "12 CUOTAS FIJAS", "18 CUOTAS FIJAS",
  ]);
  const core = [
    ["Color", product.color],
    ["Batería", product.battery ? `${product.battery}%` : ""],
    ["Detalles", product.detail],
  ];
  const extras = Object.entries(product.sheetDetails || {})
    .filter(([key, value]) => value && !omitted.has(normalizeHeader(key)));

  const fragment = document.createDocumentFragment();
  [...core, ...extras].filter(([, value]) => value).forEach(([label, value]) => {
    const item = document.createElement("div");
    item.append(
      createElement("dt", { text: sanitizeCatalogText(label, 80) }),
      createElement("dd", { text: sanitizeCatalogText(value) }),
    );
    fragment.append(item);
  });
  return fragment;
}

function parseCatalogSheet(csv) {
  const rows = parseCsv(csv);
  let category = null;
  let headers = [];
  let headerLabels = [];
  const products = [];

  rows.forEach((row) => {
    const categoryFromRow = sheetCategory(row);
    if (categoryFromRow) {
      category = categoryFromRow;
      headers = [];
      headerLabels = [];
      return;
    }

    const normalizedRow = row.map(normalizeHeader);
    const hasImageColumn = normalizedRow.some((header) => ["IMAGEN", "FOTO", "FOTOS", "URL IMAGEN", "LINK IMAGEN"].includes(header));
    const hasModelColumn = normalizedRow.some((header) => ["MODELO", "NOMBRE", "EQUIPO"].includes(header));
    if (hasImageColumn && hasModelColumn) {
      headers = normalizedRow;
      headerLabels = row.map((cell) => sanitizeCatalogText(cell, 80));
      return;
    }

    if (!headers.length) return;
    if (products.length >= CATALOG_MAX_PRODUCTS) return;
    const name = firstSheetValue(row, headers, ["MODELO", "NOMBRE", "EQUIPO"]);
    if (!name) return;

    const storage = firstSheetValue(row, headers, ["GB", "CAPACIDAD"]);
    const categoryFromColumn = normalizeCatalogCategory(firstSheetValue(row, headers, ["CATEGORIA", "TIPO", "ESTADO"]));
    const productCategory = categoryFromColumn || category;
    if (!productCategory) return;
    const sheetDetails = Object.fromEntries(
      headers.map((header, index) => [headerLabels[index] || header, sanitizeCatalogText(row[index])]),
    );
    const imageValue = firstSheetValue(row, headers, ["IMAGEN", "FOTO", "FOTOS", "URL IMAGEN", "LINK IMAGEN"]);
    const imageFallbacks = imageUrls(imageValue);
    products.push({
      category: productCategory,
      name,
      storage: storage ? (/\b(?:GB|TB)\b/i.test(storage) ? storage : `${storage} GB`) : "Capacidad a confirmar",
      color: firstSheetValue(row, headers, ["COLOR", "COLOR DEL EQUIPO"]) || "Color a confirmar",
      battery: firstSheetValue(row, headers, ["BATERIA", "BATERIA %", "SALUD DE BATERIA"]),
      detail: sheetValue(row, headers, "DETALLES"),
      image: imageFallbacks[0],
      imageFallbacks,
      usd: displayPrice(firstSheetValue(row, headers, ["USD", "PRECIO USD"])),
      cash: displayPrice(firstSheetValue(row, headers, ["PESOS", "EFECTIVO", "PRECIO EFECTIVO"])),
      transfer: displayPrice(sheetValue(row, headers, "TRANSFERENCIA")),
      installment: displayPrice(sheetValue(row, headers, "3 CUOTAS FIJAS")),
      installment6: displayPrice(sheetValue(row, headers, "6 CUOTAS FIJAS")),
      installment9: displayPrice(sheetValue(row, headers, "9 CUOTAS FIJAS")),
      installment12: displayPrice(sheetValue(row, headers, "12 CUOTAS FIJAS")),
      installment18: displayPrice(sheetValue(row, headers, "18 CUOTAS FIJAS")),
      sheetDetails,
    });
  });

  return products;
}

function productMeta(product) {
  const items = [product.color];
  if (product.battery) items.push(`Batería: ${product.battery}`);
  if (product.detail) items.push(product.detail);
  return items.filter(Boolean).join(" · ");
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function storeAppointmentMessage(store) {
  return `Hola iPhone Style!\nMe gustaría agendar una cita en la sucursal de ${store}.\n\nTambién quisiera saber dónde se encuentra ubicada la sucursal de ${store}.\n\n¿Me comparten los horarios disponibles? ✨`;
}

function productDescription(product) {
  return `${product.name} · ${product.storage} · ${productMeta(product)}`;
}

function buyMessage(product) {
  const pricing = product.usd === "A consultar" || product.cash === "A consultar"
    ? "Quisiera confirmar el precio y la disponibilidad."
    : `Lo vi en la web a ${formatUsdPrice(product.usd)} USD (efectivo ${product.cash}).`;
  return `Hola iPhone Style!\nMe interesa comprar el ${product.name} · ${product.storage}.\n${pricing}\n¡Quiero coordinar una cita en alguna de sus sucursales! ✨`;
}

function formatUsdPrice(value) {
  return String(value || "A consultar").replace("US$", "$").replace(/\s+/g, " ").trim();
}

function createProductCard(product, index) {
  const productName = sanitizeCatalogText(product.name);
  const storage = sanitizeCatalogText(product.storage, 80);
  const productCard = createElement("article", {
    className: `product-card reveal-delay-${index % 3}`,
    dataset: { productIndex: index },
  });
  productCard.setAttribute("data-reveal", "");

  const detailButton = createElement("button", {
    className: "product-detail-trigger",
    attributes: {
      type: "button",
      "aria-label": `Ver ficha de ${productName} ${storage}`,
    },
    dataset: { selectProduct: index },
  });

  const productHeading = createElement("div", { className: "product-card-top" });
  const headingCopy = document.createElement("div");
  headingCopy.append(
    createElement("h3", { text: `${productName} · ${storage}` }),
    createElement("p", { text: sanitizeCatalogText(productMeta(product)) }),
  );
  productHeading.append(headingCopy);

  const visual = createElement("div", { className: "product-visual" });
  visual.append(createProductImage(product, {
    alt: `${productName} ${sanitizeCatalogText(product.color, 80)} de ${storage}`,
    loading: "lazy",
  }));

  const pricing = createElement("div", {
    className: "product-pricing",
    attributes: { "aria-label": `Precios de ${productName}` },
  });
  const usdPrice = createElement("p", { className: "product-usd-price" });
  usdPrice.append(
    document.createTextNode("Precio en USD: "),
    createElement("strong", { text: sanitizeCatalogText(formatUsdPrice(product.usd), 80) }),
  );
  const paymentCopy = createElement("p", {
    className: "product-payment-copy",
    text: `Efectivo: ${sanitizeCatalogText(product.cash, 80)} · Transferencia: ${sanitizeCatalogText(product.transfer, 80)}`,
  });
  const gift = createElement("div", {
    className: "product-gift",
    attributes: { "aria-label": "Regalo incluido con la compra" },
  });
  gift.append(
    createElement("span", { text: "🎁", attributes: { "aria-hidden": "true" } }),
  );
  const giftCopy = document.createElement("p");
  giftCopy.append(
    createElement("strong", { text: "Con tu compra te regalamos" }),
    document.createTextNode("Cargador rápido + cable + funda + vidrio templado + garantía."),
  );
  gift.append(giftCopy);

  const installmentPanel = createElement("div", { className: "installment-panel" });
  installmentPanel.append(createElement("p", { className: "installment-heading", text: "Cuotas fijas en pesos" }));
  const installmentRows = createElement("div", { className: "installment-rows" });
  installmentOptions.forEach(({ label, key }) => {
    const row = createElement("div", { className: "installment-row" });
    row.append(
      createElement("span", { text: `${label} de` }),
      createElement("strong", { text: sanitizeCatalogText(product[key], 80) }),
    );
    installmentRows.append(row);
  });
  installmentPanel.append(installmentRows);
  pricing.append(usdPrice, paymentCopy, gift, installmentPanel);

  const footer = createElement("div", { className: "product-footer" });
  const buyLink = createElement("a", {
    className: "product-buy",
    text: "Comprar",
    attributes: {
      href: whatsappUrl(buyMessage(product)),
      target: "_blank",
      rel: "noopener noreferrer",
      referrerpolicy: "no-referrer",
      "aria-label": `Comprar ${productName} ${storage}`,
    },
  });
  const tradeInButton = createElement("button", {
    className: "product-trade-in",
    text: "Plan Canje",
    attributes: { type: "button" },
    dataset: { tradeInProduct: index },
  });
  footer.append(buyLink, tradeInButton);
  productCard.append(detailButton, productHeading, visual, pricing, footer);
  return productCard;
}
function createIphone18ModelSections(products) {
  const models = new Map();

  products.forEach(({ product }) => {
    const family = normalizeHeader(product.name);
    if (!family.startsWith("IPHONE 18")) return;

    if (!models.has(family)) {
      models.set(family, sanitizeCatalogText(product.name));
    }
  });

  return [...models.entries()].map(([family, label]) => ({
    id: `nuevos-sellados-${family.toLowerCase().replace(/\s+/g, "-")}`,
    label,
    family,
    kind: "exact-name",
  }));
}
function matchesCatalogModel(product, section) {
  const productName = normalizeHeader(product.name);
  if (!productName) return false;
  if (section.kind === "exact-name") {
    return productName === section.family;
  }
  if (section.kind === "generation") {
    return productName === section.family || productName.startsWith(`${section.family} `);
  }

  if (section.kind === "base") {
    return productName === section.family
      || (productName.startsWith(`${section.family} `) && !productName.startsWith(`${section.family} PRO`));
  }

  if (section.kind === "pro") {
    return productName === section.family
      || (productName.startsWith(`${section.family} `) && !productName.startsWith(`${section.family} MAX`));
  }

  return productName === section.family || productName.startsWith(`${section.family} `);
}

function createCatalogGrid(products) {
  const grid = createElement("div", { className: "catalog-grid" });
  products.forEach(({ product, index }) => grid.append(createProductCard(product, index)));
  return grid;
}

function createCatalogModelGroup(section, products, description) {
  const modelGroup = createElement("section", {
    className: "catalog-model-group",
    attributes: { id: section.id, "aria-labelledby": `${section.id}-title` },
  });
  const heading = createElement("div", { className: "catalog-model-heading" });
  heading.setAttribute("data-reveal", "");
  heading.append(
    createElement("h4", { text: section.label, attributes: { id: `${section.id}-title` } }),
    createElement("p", { text: description }),
  );
  modelGroup.append(heading);
  modelGroup.append(createCatalogGrid(products));

  return modelGroup;
}

function createCatalogGroup(group) {
  const products = catalog
    .map((product, index) => ({ product, index }))
    .filter(({ product }) => product.category === group.category);

  if (!products.length) return null;

  const groupElement = createElement("section", {
    className: "catalog-group",
    attributes: { id: group.id, "aria-labelledby": `${group.id}-title` },
  });
  const heading = createElement("div", { className: "catalog-group-heading" });
  heading.setAttribute("data-reveal", "");
  const headingTitle = document.createElement("div");
  headingTitle.append(
    createElement("p", { className: "eyebrow", text: group.eyebrow }),
    createElement("h3", { text: group.title, attributes: { id: `${group.id}-title` } }),
  );
  heading.append(headingTitle, createElement("p", { text: group.description }));
  groupElement.append(heading);

    const modelSections = group.id === "nuevos-sellados"
    ? [...(catalogModelSections[group.id] || []), ...createIphone18ModelSections(products)]
    : catalogModelSections[group.id];
  if (!modelSections) {
    groupElement.append(createCatalogGrid(products));
    return groupElement;
  }

  const modelGroups = createElement("div", { className: "catalog-model-groups" });
  const assignedIndexes = new Set();
  modelSections.forEach((section) => {
    const matchingProducts = products.filter(({ product, index }) => {
      const isMatch = matchesCatalogModel(product, section);
      if (isMatch) assignedIndexes.add(index);
      return isMatch;
    });
    const modelDescription = group.id === "nuevos-sellados"
      ? "Elegí la configuración que más te gusta."
      : "Equipos disponibles de esta generación.";
    if (matchingProducts.length) {
      modelGroups.append(createCatalogModelGroup(section, matchingProducts, modelDescription));
    }
  });

  const ungroupedProducts = products.filter(({ index }) => !assignedIndexes.has(index));
  if (ungroupedProducts.length) {
    const extraSection = {
      id: `${group.id}-otros-modelos`,
      label: group.id === "nuevos-sellados" ? "Más equipos nuevos" : "Más usados premium",
    };
    modelGroups.append(createCatalogModelGroup(extraSection, ungroupedProducts, "Otros equipos disponibles en esta selección."));
  }

  groupElement.append(modelGroups);
  return groupElement;
}

async function fetchLiveCatalog() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), CATALOG_REQUEST_TIMEOUT);
  const requestUrl = new URL(CATALOG_CSV_URL);

  // Evita que el navegador reutilice una respuesta antigua entre actualizaciones.
  requestUrl.searchParams.set("_", String(Date.now()));

  try {
    const response = await fetch(requestUrl, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`Google Sheets respondió ${response.status}`);

    const csv = await response.text();
    if (csv.length > CATALOG_MAX_BYTES) throw new Error("La planilla supera el tamaño permitido");
    const liveCatalog = parseCatalogSheet(csv);
    if (!liveCatalog.length) throw new Error("La planilla no devolvió equipos");
    return liveCatalog;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function loadCatalog() {
  if (catalogRefreshInFlight) return;
  catalogRefreshInFlight = true;
  let nextCatalog;

  try {
    nextCatalog = await fetchLiveCatalog();
  } catch (error) {
    // Si la página ya mostró datos válidos, nunca los reemplazamos por una copia
    // antigua durante un error temporal de red.
    if (catalogFingerprint) {
      console.warn("No se pudo actualizar el catálogo desde Google Sheets.", error);
      return;
    }
    nextCatalog = fallbackCatalog.map((product) => ({ ...product }));
    console.warn("No se pudo actualizar el catálogo desde Google Sheets.", error);
  } finally {
    catalogRefreshInFlight = false;
  }

  const nextFingerprint = JSON.stringify(nextCatalog);
  if (nextFingerprint === catalogFingerprint) return;
  catalogFingerprint = nextFingerprint;
  catalog = nextCatalog;

  const groups = catalogCategories.map(createCatalogGroup).filter(Boolean);
  catalogGroups.replaceChildren(...groups);
  catalogGroups.setAttribute("aria-busy", "false");
  catalogStatus.classList.add("is-ready");
  catalogStatus.hidden = true;
  observeReveals(catalogGroups.querySelectorAll("[data-reveal]"));
  document.dispatchEvent(new CustomEvent("catalog:updated"));
}

function observeReveals(elements = document.querySelectorAll("[data-reveal]")) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        activeObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px" },
  );
  elements.forEach((element) => observer.observe(element));
}

function openModal(dialog) {
  if (!dialog || dialog.open) return;
  dialog.showModal();
  requestAnimationFrame(() => dialog.classList.add("is-open"));
  dialog.querySelector("[data-close-modal]")?.focus();
}

function closeModal(dialog) {
  if (!dialog?.open) return;
  dialog.classList.remove("is-open");
  dialog.classList.add("is-closing");

  const finish = () => {
    dialog.classList.remove("is-closing");
    dialog.close();
  };

  if (prefersReducedMotion) {
    finish();
  } else {
    window.setTimeout(finish, 250);
  }
}

function prepareTradeIn(product = null) {
  selectedTradeInProduct = product;
  const form = document.querySelector("#trade-in-form");
  const target = document.querySelector("#trade-in-target");
  form.reset();
  form.elements.storage.value = "128 GB";

  if (product) {
    target.textContent = `Querés llevarte un ${product.name} · ${product.storage}. Contanos sobre el tuyo y cotizamos la diferencia.`;
  } else {
    target.textContent = "Contanos sobre el equipo que entregás y te cotizamos la diferencia.";
  }
}

function openTradeIn(product = null) {
  const dialog = document.querySelector("#trade-in-dialog");
  prepareTradeIn(product);

  const revealForm = () => {
    openModal(dialog);
    window.requestAnimationFrame(() => document.querySelector("#trade-in-model")?.focus());
  };
  const activeDialog = document.querySelector("dialog.modal[open]");

  if (activeDialog && activeDialog !== dialog) {
    closeModal(activeDialog);
    window.setTimeout(revealForm, prefersReducedMotion ? 0 : 260);
    return;
  }

  revealForm();
}

function setupTradeInForm() {
  const form = document.querySelector("#trade-in-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const fieldValue = (name, maxLength = PRODUCT_TEXT_MAX_LENGTH) => sanitizeCatalogText(values.get(name), maxLength);
    const details = fieldValue("details") || "Sin detalles adicionales informados";
    const desiredProduct = selectedTradeInProduct
      ? `Me interesa el ${selectedTradeInProduct.name} · ${selectedTradeInProduct.storage}.`
      : "Me interesa hacer un Plan Canje.";
    const message = `Hola iPhone Style!\n${desiredProduct}\n\nPLAN CANJE — equipo a entregar\n📱 Modelo: ${fieldValue("model", 80)}\n💾 Capacidad: ${fieldValue("storage", 80)}\n🔋 Batería: ${fieldValue("battery", 12)}%\n✨ Estado: ${fieldValue("condition", 120)}\n📝 Detalles: ${details}\n\n¿Me pasarían la diferencia a abonar?`;
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  });
}

function setupModals() {
  document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.dataset.openModal;
      if (modalId === "trade-in-dialog") {
        openTradeIn();
        return;
      }
      if (modalId === "product-dialog") openModal(document.getElementById(modalId));
    });
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeModal(dialog);
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeModal(dialog);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.closest("dialog")));
  });

  document.querySelector("#product-trade-in")?.addEventListener("click", () => {
    if (selectedTradeInProduct) openTradeIn(selectedTradeInProduct);
  });
}

function showProduct(product) {
  const dialog = document.querySelector("#product-dialog");
  selectedTradeInProduct = product;
  dialog.querySelector("#product-dialog-title").textContent = `${product.name} · ${product.storage}`;
  dialog.querySelector("#product-dialog-copy").textContent = "Con la compra de cualquier equipo te llevás un cargador de carga rápida + cable + funda + vidrio templado + una garantía de regalo. 🎁 Compra seguro y tranquilo en iPhone Style.";
  dialog.querySelector("#product-modal-visual").replaceChildren(createProductImage(product, {
    alt: `${product.name} ${product.color} de ${product.storage}`,
  }));
  dialog.querySelector("#product-dialog-specs").replaceChildren(createProductDetails(product));
  openModal(dialog);
}

function setupImageFallbacks() {
  document.addEventListener("error", (event) => {
    if (!(event.target instanceof Element)) return;
    const image = event.target.closest(".product-image");
    if (!image) return;
    let sources = [];
    try {
      sources = JSON.parse(image.dataset.imageSources || "[]");
    } catch {
      sources = [];
    }
    sources = Array.isArray(sources)
      ? sources.filter((source) => source === DEFAULT_PRODUCT_IMAGE || imageUrls(source)[0] === source)
      : [];
    const nextIndex = Number(image.dataset.imageSourceIndex || 0) + 1;
    if (sources[nextIndex]) {
      image.dataset.imageSourceIndex = String(nextIndex);
      image.src = sources[nextIndex];
      return;
    }
    if (image.src.endsWith(DEFAULT_PRODUCT_IMAGE)) return;
    image.src = DEFAULT_PRODUCT_IMAGE;
  }, true);
}

function setupCatalogEvents() {
  catalogGroups.addEventListener("click", (event) => {
    const tradeInButton = event.target.closest("[data-trade-in-product]");
    if (tradeInButton) {
      const product = catalog[Number(tradeInButton.dataset.tradeInProduct)];
      if (product) openTradeIn(product);
      return;
    }

    const button = event.target.closest("[data-select-product]");
    if (!button) return;
    const product = catalog[Number(button.dataset.selectProduct)];
    if (product) showProduct(product);
  });
}

function setupMagneticButtons() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover || prefersReducedMotion) return;

  document.querySelectorAll("[data-magnetic]").forEach((button) => {
    button.addEventListener("pointerenter", () => button.classList.add("is-magnetic-active"));
    button.addEventListener("pointerleave", () => {
      button.classList.remove("is-magnetic-active");
    });
  });
}

function setupHeroDeviceMotion() {
  const stage = document.querySelector("[data-hero-device]");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!stage || !canHover || prefersReducedMotion) return;

  stage.addEventListener("pointerenter", () => stage.classList.add("is-pointer-active"));
  stage.addEventListener("pointerleave", () => stage.classList.remove("is-pointer-active"));
}

function setupHeroScrollDepth() {
  const layer = document.querySelector("[data-hero-parallax]");
  const copy = document.querySelector("[data-hero-copy-parallax]");
  if (!layer || !copy || prefersReducedMotion) return;

  const hero = layer.closest(".hero-device");
  if (!hero || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(([entry]) => {
    const isPastHeroStart = entry.boundingClientRect.top < 0 && entry.isIntersecting;
    layer.classList.toggle("is-scroll-depth-active", isPastHeroStart);
    copy.classList.toggle("is-scroll-depth-active", isPastHeroStart);
  }, { threshold: [0, 0.75] });
  observer.observe(hero);
}

function setupHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let pendingFrame = null;
  const updateHeader = () => {
    pendingFrame = null;
    header.classList.toggle("is-compact", window.scrollY > 28);
  };
  const requestUpdate = () => {
    if (pendingFrame !== null) return;
    pendingFrame = window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", requestUpdate, { passive: true });
}

function setupScrollScenes() {
  const scenes = document.querySelectorAll("[data-scroll-scene]");
  if (!scenes.length || prefersReducedMotion || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("scroll-scenes-ready");
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-scroll-active");
        activeObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -9%" },
  );
  scenes.forEach((scene) => observer.observe(scene));
}

function setupTradeInMediaMotion() {
  const media = document.querySelector("[data-trade-in-media]");
  const image = media?.querySelector("img");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!media || !image || !canHover || prefersReducedMotion) return;

  media.addEventListener("pointerenter", () => image.classList.add("is-pointer-active"));
  media.addEventListener("pointerleave", () => {
    image.classList.remove("is-pointer-active");
  });
}

function setupCatalogMenu() {
  const menu = document.querySelector("[data-catalog-menu]");
  const trigger = document.querySelector("[data-catalog-menu-trigger]");
  const panel = document.querySelector("#catalog-menu");
  if (!menu || !trigger || !panel) return () => {};

  const categoryTabs = [...panel.querySelectorAll("[data-catalog-category]")];
  const modelPanels = [...panel.querySelectorAll("[data-catalog-panel]")];

  let keyboardTriggered = false;

  function setOpen(isOpen, { instant = false, focusTrigger = false } = {}) {
    if (instant) menu.classList.add("is-instant");

    menu.classList.toggle("is-open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
    panel.inert = !isOpen;

    if (focusTrigger) trigger.focus();
    if (instant) {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => menu.classList.remove("is-instant")));
    }
  }

  function selectCategory(id, { focus = false } = {}) {
    const selectedTab = categoryTabs.find((tab) => tab.dataset.catalogCategory === id);
    const selectedPanel = modelPanels.find((modelPanel) => modelPanel.dataset.catalogPanel === id);
    if (!selectedTab || selectedTab.hidden || !selectedPanel) return;

    categoryTabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });
    modelPanels.forEach((modelPanel) => {
      modelPanel.hidden = modelPanel !== selectedPanel;
    });
    if (focus) selectedTab.focus();
  }

  function availableCategoryTabs() {
    return categoryTabs.filter((tab) => !tab.hidden);
  }

  function syncAvailability() {
    categoryTabs.forEach((tab) => {
      tab.hidden = !document.getElementById(tab.dataset.catalogCategory);
    });

    panel.querySelectorAll("[data-catalog-target]").forEach((link) => {
      link.hidden = !document.getElementById(link.dataset.catalogTarget);
    });
    const newModelsList = panel.querySelector(
      '[data-catalog-panel="nuevos-sellados"] .catalog-nav-model-list',
    );

    newModelsList
      ?.querySelectorAll("[data-dynamic-iphone18]")
      .forEach((link) => link.remove());

    catalogGroups
      .querySelectorAll(
        '#nuevos-sellados .catalog-model-group[id^="nuevos-sellados-iphone-18"]',
      )
      .forEach((section) => {
        const label = section.querySelector("h4")?.textContent;
        if (!newModelsList || !label) return;

        const link = createElement("a", {
          text: label,
          attributes: {
            href: `#${section.id}`,
            "data-catalog-target": section.id,
            "data-dynamic-iphone18": "",
          },
        });

        link.addEventListener("click", (event) => {
          event.preventDefault();
          setOpen(false);
          goToCatalogTarget(section.id);
        });

        newModelsList.append(link);
      });
    const selectedTab = categoryTabs.find((tab) => tab.getAttribute("aria-selected") === "true");
    if (!selectedTab || selectedTab.hidden) {
      const firstAvailableTab = availableCategoryTabs()[0];
      if (firstAvailableTab) selectCategory(firstAvailableTab.dataset.catalogCategory);
    }
  }

  function goToCatalogTarget(id) {
    const hash = `#${id}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);

    const scrollToGroup = () => {
      const group = document.getElementById(id);
      if (!group) return false;
      group.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      return true;
    };

    if (scrollToGroup()) return;

    const observer = new MutationObserver(() => {
      if (scrollToGroup()) observer.disconnect();
    });
    observer.observe(catalogGroups, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), CATALOG_REQUEST_TIMEOUT);
  }

  trigger.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen, { instant: keyboardTriggered });
    keyboardTriggered = false;
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true, { instant: true });
      panel.querySelector('[role="tab"][aria-selected="true"]')?.focus();
    } else if (event.key === "Escape") {
      setOpen(false, { instant: true, focusTrigger: true });
    } else if (event.key === "Enter" || event.key === " ") {
      keyboardTriggered = true;
    }
  });

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => selectCategory(tab.dataset.catalogCategory));
    tab.addEventListener("keydown", (event) => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const availableTabs = availableCategoryTabs();
      const currentIndex = availableTabs.indexOf(tab);
      if (currentIndex < 0) return;
      let nextIndex = currentIndex;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (currentIndex + 1) % availableTabs.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + availableTabs.length) % availableTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = availableTabs.length - 1;
      const nextTab = availableTabs[nextIndex];
      selectCategory(nextTab.dataset.catalogCategory, { focus: true });
    });
  });

  panel.querySelectorAll("[data-catalog-target]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.dataset.catalogTarget;
      if (!id) return;
      event.preventDefault();
      setOpen(false);
      goToCatalogTarget(id);
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!menu.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
      setOpen(false, { instant: true, focusTrigger: true });
    }
  });

  selectCategory("nuevos-sellados");
  document.addEventListener("catalog:updated", syncAvailability);
  setOpen(false, { instant: true });
  return () => {
    document.removeEventListener("catalog:updated", syncAvailability);
    setOpen(false, { instant: true });
  };
}

function setupNavigation(closeCatalogMenu) {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  const closeNavigation = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    links.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    links.classList.toggle("is-open", !isOpen);
  });

  links.querySelectorAll("a, button:not([data-catalog-menu-trigger])").forEach((item) => item.addEventListener("click", () => {
    const belongsToCatalogMenu = Boolean(item.closest("[data-catalog-menu]"));
    if (belongsToCatalogMenu && !item.matches("[data-catalog-target]")) return;
    closeNavigation();
    closeCatalogMenu?.();
  }));
}

function dismissLoader() {
  const loader = document.querySelector("#site-loader");
  if (!loader) return;
  window.setTimeout(() => loader.classList.add("is-leaving"), prefersReducedMotion ? 0 : 380);
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#current-year").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl(link.dataset.whatsapp);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.referrerPolicy = "no-referrer";
  });
  document.querySelectorAll("[data-store-whatsapp]").forEach((link) => {
    link.href = whatsappUrl(storeAppointmentMessage(link.dataset.storeWhatsapp));
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.referrerPolicy = "no-referrer";
  });
  observeReveals();
  setupModals();
  setupTradeInForm();
  setupImageFallbacks();
  setupCatalogEvents();
  setupMagneticButtons();
  setupHeroDeviceMotion();
  setupHeroScrollDepth();
  setupHeaderState();
  setupScrollScenes();
  setupTradeInMediaMotion();
  const closeCatalogMenu = setupCatalogMenu();
  setupNavigation(closeCatalogMenu);
  loadCatalog();
  window.setInterval(() => {
    if (!document.hidden) loadCatalog();
  }, CATALOG_REFRESH_INTERVAL);
});

window.addEventListener("load", dismissLoader, { once: true });
