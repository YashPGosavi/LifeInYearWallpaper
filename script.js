// ══ STATE ══
let currentType = "life",
  currentTheme = "dark",
  currentDevice = "iphone";

const THEMES = {
  dark: {
    bg1: "#0d0d0f",
    bg2: "#141418",
    grid: "#1e1e26",
    fill: "#c8b89a",
    text: "#e8e4dc",
    sub: "#6b6870",
    empty: "#1a1a20",
  },
  stone: {
    bg1: "#1c1810",
    bg2: "#231e12",
    grid: "#2e2416",
    fill: "#d4a96a",
    text: "#e8dcc8",
    sub: "#8a7a5a",
    empty: "#201c10",
  },
  fog: {
    bg1: "#e8e6e0",
    bg2: "#dddad3",
    grid: "#c8c5be",
    fill: "#3a3835",
    text: "#1a1816",
    sub: "#8a8780",
    empty: "#d0cdc6",
  },
  forest: {
    bg1: "#0e1a12",
    bg2: "#111e15",
    grid: "#1a2e1e",
    fill: "#6bcb77",
    text: "#c8e8cc",
    sub: "#4a7050",
    empty: "#141e16",
  },
  ocean: {
    bg1: "#0a1628",
    bg2: "#0d1e38",
    grid: "#142040",
    fill: "#5ab4e4",
    text: "#c8e4f8",
    sub: "#3a6880",
    empty: "#0e1c34",
  },
  rose: {
    bg1: "#1a0e0e",
    bg2: "#221212",
    grid: "#2a1818",
    fill: "#e4847a",
    text: "#f0d0cc",
    sub: "#7a4a48",
    empty: "#1e1010",
  },
  violet: {
    bg1: "#110820",
    bg2: "#1a1030",
    grid: "#2c1850",
    fill: "#c084fc",
    text: "#ede6ff",
    sub: "#7c5fa0",
    empty: "#1a1030",
  },
  gold: {
    bg1: "#160f00",
    bg2: "#221800",
    grid: "#382800",
    fill: "#f5c542",
    text: "#fff8e1",
    sub: "#a08030",
    empty: "#1e1500",
  },
  custom: {
    bg1: "#0b0b0d",
    bg2: "#141417",
    grid: "#232329",
    fill: "#d6c3a3",
    text: "#f2eee7",
    sub: "#7a7680",
    empty: "#1a1a1f",
  },
};

const DEVICES = {
  iphone: { cvsId: "cvs-iphone", w: 520, h: 1040, portrait: true },
  android: { cvsId: "cvs-android", w: 504, h: 1040, portrait: true },
  mac: { cvsId: "cvs-mac", w: 1040, h: 640, portrait: false },
  windows: { cvsId: "cvs-windows", w: 1040, h: 620, portrait: false },
};

// ══ INIT ══
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  document.getElementById("goalStart").value = today
    .toISOString()
    .split("T")[0];
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  document.getElementById("goalDate").value = d.toISOString().split("T")[0];
  applyUrlParams();
  startClock();
  startCountdown();
  render();
  setInterval(render, 60000);

  const p = new URLSearchParams(window.location.search);
  if (p.get("download") === "1") {
    setTimeout(() => {
        render();
        downloadWallpaper();
    }, 300);
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeInstall();
});

// ══ CLOCK ══
function startClock() {
  const tick = () =>
    (document.getElementById("liveTime").textContent =
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }));
  tick();
  setInterval(tick, 1000);
}
function startCountdown() {
  const tick = () => {
    const n = new Date(),
      nx = new Date(n);
    nx.setHours(6, 0, 0, 0);
    if (nx <= n) nx.setDate(nx.getDate() + 1);
    const diff = Math.floor((nx - n) / 1000);
    const h = String(Math.floor(diff / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(diff % 60).padStart(2, "0");
    document.getElementById("countdown").textContent =
      `next update in ${h}:${m}:${s}`;
  };
  tick();
  setInterval(tick, 1000);
}

// ══ DEVICE ══
function setDevice(dev, el) {
  currentDevice = dev;
  document
    .querySelectorAll(".dev-tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  Object.keys(DEVICES).forEach((d) => {
    const f = document.getElementById("frame-" + d);
    if (f) f.style.display = d === dev ? "" : "none";
  });
  const sel = document.getElementById("exportSize");
  if (
    dev === "mac" &&
    !["2560x1600", "1920x1080", "3840x2160"].includes(sel.value)
  )
    sel.value = "2560x1600";
  if (
    dev === "windows" &&
    !["2560x1600", "1920x1080", "3840x2160"].includes(sel.value)
  )
    sel.value = "1920x1080";
  render();
}

// ══ UI ══
function setType(type, el) {
  currentType = type;
  document
    .querySelectorAll(".type-card")
    .forEach((c) => c.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("lifeSection").style.display =
    type === "life" ? "" : "none";
  document.getElementById("yearSection").style.display =
    type === "year" ? "" : "none";
  document.getElementById("goalSection").style.display =
    type === "goal" ? "" : "none";
  render();
}
function setTheme(theme, el) {
  currentTheme = theme;
  document
    .querySelectorAll(".theme-swatch")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("customSwatchBtn").classList.remove("active");
  el.classList.add("active");
  document.getElementById("customPalette").style.display = "none";
  render();
}
function activateCustom() {
  currentTheme = "custom";
  document
    .querySelectorAll(".theme-swatch")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("customSwatchBtn").classList.add("active");
  document.getElementById("customPalette").style.display = "";
  render();
}
function onCustomAccent(val) {
  THEMES.custom.fill = val;
  activateCustom();
}
function applyCustomTheme() {
  THEMES.custom = {
    bg1: document.getElementById("cp_bg1").value,
    bg2: document.getElementById("cp_bg2").value,
    grid: document.getElementById("cp_grid").value,
    fill: document.getElementById("cp_fill").value,
    text: document.getElementById("cp_text").value,
    sub: document.getElementById("cp_sub").value,
    empty: document.getElementById("cp_empty").value,
  };
  currentTheme = "custom";
  render();
}
function getExportDims() {
  const [w, h] = document
    .getElementById("exportSize")
    .value.split("x")
    .map(Number);
  return { w, h };
}

// ══ RENDER ══
function render() {
  const { w, h } = getExportDims();
  document.getElementById("dimLabel").textContent = `${w}×${h}`;
  document.getElementById("sizeHint").textContent = `${w} × ${h} px · PNG`;
  Object.entries(DEVICES).forEach(([dev, cfg]) => {
    const c = document.getElementById(cfg.cvsId);
    if (!c) return;
    c.width = cfg.w;
    c.height = cfg.h;
    drawWallpaper(c.getContext("2d"), cfg.w, cfg.h, false, cfg.portrait);
  });
  const exp = document.getElementById("exportCanvas");
  const portrait = !["mac", "windows"].includes(currentDevice);
  exp.width = w;
  exp.height = h;
  drawWallpaper(exp.getContext("2d"), w, h, true, portrait);
}

// ══ DRAW ══
function drawWallpaper(ctx, W, H, hires, portrait) {
  const T = THEMES[currentTheme],
    now = new Date();
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, T.bg1);
  grad.addColorStop(1, T.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  addNoise(ctx, W, H);
  if (currentType === "life") drawLifeCalendar(ctx, W, H, T, now, portrait);
  if (currentType === "year") drawYearCalendar(ctx, W, H, T, now, portrait);
  if (currentType === "goal") drawGoalCalendar(ctx, W, H, T, now, portrait);
  drawTimestamp(ctx, W, H, T, now);
}

function addNoise(ctx, W, H) {
  const img = ctx.createImageData(W, H),
    d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() - 0.5) * 18;
    d[i] = d[i + 1] = d[i + 2] = Math.max(0, Math.min(255, 128 + v));
    d[i + 3] = 8;
  }
  ctx.putImageData(img, 0, 0);
}

// ── Life Calendar ──
function drawLifeCalendar(ctx, W, H, T, now, portrait) {
  const dob = new Date(document.getElementById("dob").value || "1995-01-01");
  const lifeYears = parseInt(document.getElementById("lifeExp").value);
  const totalWeeks = lifeYears * 52;
  const weekLived = Math.floor((now - dob) / (7 * 24 * 3600 * 1000));
  const pct = Math.min(1, weekLived / totalWeeks);
  const pad = W * 0.08;
  const titleY = portrait ? H * 0.1 : H * 0.13;

  ctx.fillStyle = T.text;
  ctx.textAlign = "center";
  ctx.font = `300 ${W * (portrait ? 0.045 : 0.036)}px 'Cormorant Garamond', serif`;
  ctx.fillText("Life in Weeks", W / 2, titleY);
  ctx.fillStyle = T.sub;
  ctx.font = `300 ${W * (portrait ? 0.026 : 0.019)}px 'DM Mono', monospace`;
  const age = ((now - dob) / (365.25 * 24 * 3600 * 1000)).toFixed(1);
  ctx.fillText(
    `age ${age}  ·  ${weekLived.toLocaleString()} of ${totalWeeks.toLocaleString()} weeks`,
    W / 2,
    titleY + W * (portrait ? 0.055 : 0.038),
  );

  const gridTop = portrait ? H * 0.18 : H * 0.26;
  const gridBot = portrait ? H * 0.88 : H * 0.82;
  const gridH = gridBot - gridTop,
    gridW = W - pad * 2;
  const cols = 52,
    rows = lifeYears;
  const cellW = gridW / cols,
    cellH = gridH / rows;
  const gap = Math.max(0.5, cellW * 0.12),
    r = Math.min(cellW, cellH) * 0.18;

  ctx.save();
  ctx.translate(pad, gridTop);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      const x = col * cellW + gap / 2,
        y = row * cellH + gap / 2;
      const cw = cellW - gap,
        ch = cellH - gap;
      let color;
      if (idx < weekLived) {
        color = lerpColor(
          T.fill,
          lighten(T.fill, 0.15),
          idx / Math.max(1, weekLived),
        );
      } else if (idx === weekLived) {
        color = lighten(T.fill, 0.3);
        ctx.save();
        ctx.shadowColor = T.fill;
        ctx.shadowBlur = cellW * 3;
      } else {
        color = T.empty;
      }
      roundRect(ctx, x, y, cw, ch, r);
      ctx.fillStyle = color;
      ctx.fill();
      if (idx === weekLived) ctx.restore();
    }
  }
  ctx.restore();

  const barY = portrait ? H * 0.92 : H * 0.87,
    barH = H * 0.008,
    barW = W - pad * 2;
  roundRect(ctx, pad, barY, barW, barH, barH / 2);
  ctx.fillStyle = T.empty;
  ctx.fill();
  if (pct > 0) {
    roundRect(ctx, pad, barY, barW * pct, barH, barH / 2);
    ctx.fillStyle = T.fill;
    ctx.fill();
  }
  ctx.fillStyle = T.sub;
  ctx.textAlign = "left";
  ctx.font = `300 ${W * 0.022}px 'DM Mono', monospace`;
  ctx.fillText(
    `${(pct * 100).toFixed(1)}% of life lived`,
    pad,
    barY + barH + W * 0.035,
  );
}

// ── Year Calendar ──
function drawYearCalendar(ctx, W, H, T, now, portrait) {
  const mode = document.getElementById("yearMode").value;
  const showMonths = document
    .getElementById("toggleMonths")
    .classList.contains("on");
  const showToday = document
    .getElementById("toggleToday")
    .classList.contains("on");
  const year = now.getFullYear();
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;
  const dayOfYear = getDayOfYear(now);
  const pct = dayOfYear / totalDays;
  const pad = W * 0.08;
  const titleY = portrait ? H * 0.08 : H * 0.12;

  ctx.fillStyle = T.text;
  ctx.textAlign = "center";
  ctx.font = `300 ${W * (portrait ? 0.052 : 0.042)}px 'Cormorant Garamond', serif`;
  ctx.fillText(String(year), W / 2, titleY);
  ctx.fillStyle = T.sub;
  ctx.font = `300 ${W * (portrait ? 0.026 : 0.019)}px 'DM Mono', monospace`;
  ctx.fillText(
    `${now.toLocaleString("default", { month: "long" })} ${now.getDate()}  ·  day ${dayOfYear}`,
    W / 2,
    titleY + W * (portrait ? 0.055 : 0.038),
  );

  const gridTop = portrait ? H * 0.17 : H * 0.26;
  const gridBot = portrait ? H * 0.9 : H * 0.83;
  const gridW = W - pad * 2,
    gridH = gridBot - gridTop;

  if (mode === "weeks") {
    const totalWeeks = 52;
    const weekOfYear = Math.floor(
      (now - new Date(year, 0, 1)) / (7 * 24 * 3600 * 1000),
    );
    const cols = portrait ? 13 : 26,
      rows = portrait ? 4 : 2;
    const cellW = gridW / cols,
      cellH = gridH / rows;
    const gap = cellW * 0.15,
      r = Math.min(cellW, cellH) * 0.25;
    ctx.save();
    ctx.translate(pad, gridTop);
    for (let i = 0; i < totalWeeks; i++) {
      const col = i % cols,
        row = Math.floor(i / cols);
      const x = col * cellW + gap / 2,
        y = row * cellH + gap / 2;
      const cw = cellW - gap,
        ch = cellH - gap;
      let color;
      if (i < weekOfYear) color = T.fill;
      else if (i === weekOfYear && showToday) {
        color = lighten(T.fill, 0.3);
        ctx.save();
        ctx.shadowColor = T.fill;
        ctx.shadowBlur = cellW * 2;
      } else color = T.empty;
      roundRect(ctx, x, y, cw, ch, r);
      ctx.fillStyle = color;
      ctx.fill();
      if (i === weekOfYear && showToday) ctx.restore();
    }
    ctx.restore();
  } else {
    const cols = portrait ? 25 : 50,
      rows = Math.ceil(totalDays / cols);
    const cellW = gridW / cols,
      cellH = gridH / rows;
    const gap = cellW * 0.12,
      r = Math.min(cellW, cellH) * 0.22;
    const MONTHS = [
      31,
      isLeap ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    const monthColors = {};
    let ms = 0;
    MONTHS.forEach((days, mi) => {
      for (let d = 0; d < days; d++) monthColors[ms + d] = mi;
      ms += days;
    });
    ctx.save();
    ctx.translate(pad, gridTop);
    for (let i = 0; i < totalDays; i++) {
      const col = i % cols,
        row = Math.floor(i / cols);
      const x = col * cellW + gap / 2,
        y = row * cellH + gap / 2;
      const cw = cellW - gap,
        ch = cellH - gap;
      let color;
      if (i < dayOfYear - 1)
        color = monthColors[i] % 2 === 0 ? T.fill : lighten(T.fill, -0.1);
      else if (i === dayOfYear - 1 && showToday) {
        color = lighten(T.fill, 0.35);
        ctx.save();
        ctx.shadowColor = T.fill;
        ctx.shadowBlur = cellW * 2;
      } else color = T.empty;
      roundRect(ctx, x, y, cw, ch, r);
      ctx.fillStyle = color;
      ctx.fill();
      if (i === dayOfYear - 1 && showToday) ctx.restore();
    }
    if (showMonths) {
      const MNAMES = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      let d = 0;
      MONTHS.forEach((days, mi) => {
        const col = d % cols,
          row = Math.floor(d / cols);
        const x = col * cellW,
          y = row * cellH - cellH * 0.1;
        if (y > 0) {
          ctx.fillStyle = T.sub;
          ctx.font = `300 ${cellW * 0.65}px 'DM Mono', monospace`;
          ctx.textAlign = "left";
          ctx.fillText(MNAMES[mi], x, y);
        }
        d += days;
      });
    }
    ctx.restore();
  }

  const barY = portrait ? H * 0.925 : H * 0.875,
    barH2 = H * 0.007,
    barW = W - pad * 2;
  roundRect(ctx, pad, barY, barW, barH2, barH2 / 2);
  ctx.fillStyle = T.empty;
  ctx.fill();
  roundRect(ctx, pad, barY, barW * pct, barH2, barH2 / 2);
  ctx.fillStyle = T.fill;
  ctx.fill();
  ctx.fillStyle = T.sub;
  ctx.textAlign = "left";
  ctx.font = `300 ${W * 0.022}px 'DM Mono', monospace`;
  ctx.fillText(
    `${totalDays - dayOfYear} days remaining  ·  ${(pct * 100).toFixed(1)}%`,
    pad,
    barY + barH2 + W * 0.035,
  );
}

// ── Goal Calendar ──
function drawGoalCalendar(ctx, W, H, T, now, portrait) {
  const goalDateVal = document.getElementById("goalDate").value;
  const goalStartVal = document.getElementById("goalStart").value;
  const goalTitle = document.getElementById("goalTitle").value || "Goal";

  const goalDate = new Date(goalDateVal || Date.now() + 90 * 24 * 3600 * 1000);
  const goalStart = new Date(goalStartVal || now);
  goalDate.setHours(23, 59, 59);
  goalStart.setHours(0, 0, 0, 0);

  const msLeft = Math.max(0, goalDate - now);
  const totalMs = Math.max(1, goalDate - goalStart);
  const daysLeft = Math.max(0, Math.ceil(msLeft / (24 * 3600 * 1000)));
  const totalDays = Math.max(1, Math.round(totalMs / (24 * 3600 * 1000)));
  const daysDone = Math.max(0, totalDays - daysLeft);
  const pct = Math.min(1, Math.max(0, daysDone / totalDays));

  const pad = W * 0.1;
  const cx = W / 2;

  // ── Section 1: Header (top ~18%) ──────────────────────
  const labelY = portrait ? H * 0.09 : H * 0.1;
  ctx.textAlign = "center";

  ctx.fillStyle = T.sub;
  ctx.font = `300 ${W * (portrait ? 0.022 : 0.016)}px 'DM Mono', monospace`;
  ctx.fillText("C O U N T D O W N", cx, labelY);

  ctx.fillStyle = T.text;
  ctx.font = `300 ${W * (portrait ? 0.062 : 0.05)}px 'Cormorant Garamond', serif`;
  ctx.fillText(goalTitle, cx, labelY + W * (portrait ? 0.075 : 0.06));

  // thin separator line
  const sepY = labelY + W * (portrait ? 0.105 : 0.085);
  ctx.beginPath();
  ctx.moveTo(pad * 1.5, sepY);
  ctx.lineTo(W - pad * 1.5, sepY);
  ctx.strokeStyle = T.grid;
  ctx.lineWidth = 1;
  ctx.stroke();

  // ── Section 2: Big number + label (middle) ─────────────
  const numY = portrait ? H * 0.38 : H * 0.42;
  ctx.fillStyle = T.fill;
  ctx.font = `300 ${W * (portrait ? 0.24 : 0.19)}px 'Cormorant Garamond', serif`;
  ctx.fillText(String(daysLeft), cx, numY);

  ctx.fillStyle = T.sub;
  ctx.font = `300 ${W * (portrait ? 0.026 : 0.02)}px 'DM Mono', monospace`;
  ctx.fillText("days remaining", cx, numY + W * (portrait ? 0.042 : 0.032));

  // ── Section 3: Date range row ───────────────────────────
  const dateRowY = portrait ? H * 0.52 : H * 0.56;
  const dateFmt = { month: "short", day: "numeric", year: "numeric" };
  const startStr = goalStart.toLocaleDateString("en", dateFmt);
  const endStr = goalDate.toLocaleDateString("en", dateFmt);
  const fs = W * (portrait ? 0.022 : 0.017);

  ctx.font = `300 ${fs}px 'DM Mono', monospace`;

  // start date (left)
  ctx.textAlign = "left";
  ctx.fillStyle = T.sub;
  ctx.fillText("start", pad, dateRowY - fs * 1.4);
  ctx.fillStyle = T.text;
  ctx.fillText(startStr, pad, dateRowY);

  // end date (right)
  ctx.textAlign = "right";
  ctx.fillStyle = T.sub;
  ctx.fillText("deadline", W - pad, dateRowY - fs * 1.4);
  ctx.fillStyle = T.text;
  ctx.fillText(endStr, W - pad, dateRowY);

  // ── Section 4: Progress bar ─────────────────────────────
  const barY = dateRowY + W * (portrait ? 0.055 : 0.042);
  const barH = H * (portrait ? 0.008 : 0.01);
  const barW = W - pad * 2;
  const barR = barH / 2;

  // track
  roundRect(ctx, pad, barY, barW, barH, barR);
  ctx.fillStyle = T.empty;
  ctx.fill();

  // fill
  if (pct > 0) {
    roundRect(ctx, pad, barY, Math.max(barR * 2, barW * pct), barH, barR);
    ctx.fillStyle = T.fill;
    ctx.fill();
  }

  // glow dot at head
  if (pct > 0 && pct < 1) {
    const dotX = pad + barW * pct;
    const dotY = barY + barH / 2;
    ctx.beginPath();
    ctx.arc(dotX, dotY, barH * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = lighten(T.fill, 0.3);
    ctx.save();
    ctx.shadowColor = T.fill;
    ctx.shadowBlur = barH * 4;
    ctx.fill();
    ctx.restore();
  }

  // pct label centred under bar
  ctx.textAlign = "center";
  ctx.fillStyle = T.sub;
  ctx.font = `300 ${W * (portrait ? 0.02 : 0.016)}px 'DM Mono', monospace`;
  ctx.fillText(
    `${(pct * 100).toFixed(1)}%  done  ·  ${daysDone} of ${totalDays} days`,
    cx,
    barY + barH + W * (portrait ? 0.038 : 0.03),
  );

  // ── Section 5: Day-dot grid ─────────────────────────────
  const gridTop = barY + barH + W * (portrait ? 0.08 : 0.062);
  const gridBot = portrait ? H * 0.91 : H * 0.88;
  const gridH2 = gridBot - gridTop;
  const gridW = W - pad * 2;

  // choose columns so dots are roughly square
  const cols = portrait ? 20 : 30;
  const rows = Math.ceil(totalDays / cols);
  const cellW = gridW / cols;
  const cellH = rows > 0 ? Math.min(cellW, gridH2 / rows) : cellW;
  const gap = Math.max(0.8, cellW * 0.15);
  const r2 = Math.min(cellW, cellH) * 0.2;

  // vertically centre the grid within its zone
  const actualGridH = rows * cellH;
  const gridOffY = gridTop + Math.max(0, (gridH2 - actualGridH) / 2);

  ctx.save();
  ctx.translate(pad, gridOffY);
  for (let i = 0; i < totalDays; i++) {
    const col = i % cols,
      row = Math.floor(i / cols);
    const x = col * cellW + gap / 2,
      y = row * cellH + gap / 2;
    const cw = cellW - gap,
      ch = cellH - gap;
    let color;
    if (i < daysDone) {
      color = lerpColor(
        T.fill,
        lighten(T.fill, 0.2),
        i / Math.max(1, daysDone),
      );
    } else if (i === daysDone) {
      color = lighten(T.fill, 0.35);
      ctx.save();
      ctx.shadowColor = T.fill;
      ctx.shadowBlur = cellW * 2.5;
    } else {
      color = T.empty;
    }
    roundRect(ctx, x, y, cw, ch, r2);
    ctx.fillStyle = color;
    ctx.fill();
    if (i === daysDone) ctx.restore();
  }
  ctx.restore();
}

function drawTimestamp(ctx, W, H, T, now) {
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  ctx.fillStyle = T.sub;
  ctx.textAlign = "center";
  ctx.font = `300 ${W * 0.02}px 'DM Mono', monospace`;
  ctx.fillText(`generated ${dateStr} at ${timeStr}`, W / 2, H * 0.975);
}

// ══ DOWNLOAD ══
function downloadWallpaper() {
  const { w, h } = getExportDims();
  const portrait = !["mac", "windows"].includes(currentDevice);
  const exp = document.getElementById("exportCanvas");
  exp.width = w;
  exp.height = h;
  drawWallpaper(exp.getContext("2d"), w, h, true, portrait);
  const a = document.createElement("a");
  a.download = `mindful-wallpaper-${currentType}-${w}x${h}.png`;
  a.href = exp.toDataURL("image/png");
  a.click();
}

// ══ MODAL ══
function openInstall() {
  document.getElementById("installModal").classList.add("open");
  updateInstallUrls();
}
function closeInstall() {
  document.getElementById("installModal").classList.remove("open");
}
function closeInstallOutside(e) {
  if (e.target === document.getElementById("installModal")) closeInstall();
}
function switchOS(os) {
  document
    .querySelectorAll(".os-tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".os-panel")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("tab-" + os).classList.add("active");
  document.getElementById("panel-" + os).classList.add("active");
}

// ══ URL ══
function buildWallpaperUrl() {
  const base = window.location.href.split("?")[0];
  const { w, h } = getExportDims();
  const params = new URLSearchParams({
    type: currentType,
    theme: currentTheme,
    w,
    h,
    download: 1
  });
  if (currentType === "life") {
    params.set("dob", document.getElementById("dob").value);
    params.set("lifeExp", document.getElementById("lifeExp").value);
  }
  if (currentType === "goal") {
    params.set("goalDate", document.getElementById("goalDate").value);
    params.set("goalStart", document.getElementById("goalStart").value);
    params.set("goalTitle", document.getElementById("goalTitle").value);
  }
  if (currentTheme === "custom")
    ["bg1", "bg2", "grid", "fill", "text", "sub", "empty"].forEach((k) =>
      params.set("c_" + k, document.getElementById("cp_" + k).value),
    );
  return base + "?" + params.toString();
}
function updateInstallUrls() {
  const url = buildWallpaperUrl();
  ["iosUrl", "androidUrl", "macUrl", "winUrl"].forEach(
    (id) => (document.getElementById(id).textContent = url),
  );
}
function copyUrl(spanId, btnId) {
  navigator.clipboard
    .writeText(document.getElementById(spanId).textContent)
    .then(() => {
      const btn = document.getElementById(btnId);
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 2000);
    });
}

// ══ URL PARAMS ══
function applyUrlParams() {
  const p = new URLSearchParams(window.location.search);
  if (p.get("type")) {
    const c = document.querySelector(
      `.type-card[data-type="${p.get("type")}"]`,
    );
    if (c) setType(p.get("type"), c);
  }
  if (p.get("theme")) {
    if (p.get("theme") === "custom") {
      activateCustom();
      ["bg1", "bg2", "grid", "fill", "text", "sub", "empty"].forEach((k) => {
        if (p.get("c_" + k))
          document.getElementById("cp_" + k).value = p.get("c_" + k);
      });
      applyCustomTheme();
    } else {
      const sw = document.querySelector(
        `.theme-swatch[data-theme="${p.get("theme")}"]`,
      );
      if (sw) setTheme(p.get("theme"), sw);
    }
  }
  if (p.get("dob")) document.getElementById("dob").value = p.get("dob");
  if (p.get("lifeExp")) {
    document.getElementById("lifeExp").value = p.get("lifeExp");
    document.getElementById("lifeExpVal").textContent = p.get("lifeExp");
  }
  if (p.get("goalDate"))
    document.getElementById("goalDate").value = p.get("goalDate");
  if (p.get("goalStart"))
    document.getElementById("goalStart").value = p.get("goalStart");
  if (p.get("goalTitle"))
    document.getElementById("goalTitle").value = p.get("goalTitle");
  if (p.get("w") && p.get("h")) {
    const val = `${p.get("w")}x${p.get("h")}`,
      sel = document.getElementById("exportSize");
    for (let opt of sel.options) {
      if (opt.value === val) {
        sel.value = val;
        break;
      }
    }
  }
}

// ══ HELPERS ══
function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
function getDayOfYear(date) {
  return Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / (24 * 3600 * 1000),
  );
}
function lerpColor(a, b, t) {
  const pa = parseHex(a),
    pb = parseHex(b);
  return `rgb(${Math.round(pa.r + (pb.r - pa.r) * t)},${Math.round(pa.g + (pb.g - pa.g) * t)},${Math.round(pa.b + (pb.b - pa.b) * t)})`;
}
function lighten(hex, amount) {
  const c = parseHex(hex),
    cl = (v) => Math.min(255, Math.max(0, Math.round(v)));
  return `rgb(${cl(c.r + 255 * amount)},${cl(c.g + 255 * amount)},${cl(c.b + 255 * amount)})`;
}
function parseHex(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}
