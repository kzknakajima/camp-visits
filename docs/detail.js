// Shared record-detail modal for the static (GitHub Pages) views.
// Replaces window.__MC_VIEW.openItem, which only exists inside the
// MulmoClaude host app.
(function () {
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function formatDate(d) {
    if (!d) return "";
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
    if (!m) return d;
    return m[1] + "/" + Number(m[2]) + "/" + Number(m[3]);
  }

  function formatRange(record) {
    const s = formatDate(record.startDate);
    const e = formatDate(record.endDate);
    if (e && e !== s) return s + " 〜 " + e;
    return s;
  }

  function weatherHtml(record) {
    const rows = record.weatherLog || [];
    if (!rows.length) return "";
    const items = rows.map((r) => "<li>" + escapeHtml((r.timing ? r.timing + ": " : "") + (r.weather || "")) + "</li>").join("");
    return "<h3>天気</h3><ul>" + items + "</ul>";
  }

  function gearHtml(record) {
    const rows = record.gear || [];
    if (!rows.length) return "";
    const items = rows.map((r) => "<li>" + escapeHtml(r.item || "") + (r.note ? " - " + escapeHtml(r.note) : "") + "</li>").join("");
    return "<h3>持ち物・装備</h3><ul>" + items + "</ul>";
  }

  function activitiesHtml(record) {
    const rows = record.activities || [];
    if (!rows.length) return "";
    const items = rows.map((r) => "<li>" + escapeHtml(r.activity || "") + (r.note ? " - " + escapeHtml(r.note) : "") + "</li>").join("");
    return "<h3>アクティビティ</h3><ul>" + items + "</ul>";
  }

  function costsHtml(record) {
    const rows = record.costs || [];
    if (!rows.length) return "";
    const total = rows.reduce((a, r) => a + (Number(r.amount) || 0), 0);
    const items = rows.map((r) => "<li>" + escapeHtml(r.item || "") + ": ¥" + Number(r.amount || 0).toLocaleString() + "</li>").join("");
    return "<h3>費用(合計 ¥" + total.toLocaleString() + ")</h3><ul>" + items + "</ul>";
  }

  function ensureOverlay() {
    let overlay = document.getElementById("mc-detail-overlay");
    if (overlay) return overlay;

    const style = document.createElement("style");
    style.textContent =
      "#mc-detail-overlay{display:none;position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:2000;" +
      "align-items:flex-end;justify-content:center;}" +
      "@media (min-width:640px){#mc-detail-overlay{align-items:center;padding:16px;}}" +
      "#mc-detail-card{background:#fff;width:100%;max-width:480px;max-height:85vh;overflow-y:auto;" +
      "font-family:-apple-system,system-ui,'Hiragino Sans',sans-serif;color:#0f172a;" +
      "border-radius:18px 18px 0 0;box-shadow:0 -4px 24px rgba(0,0,0,.18);" +
      "padding:8px 20px calc(20px + env(safe-area-inset-bottom,0px));" +
      "-webkit-overflow-scrolling:touch;}" +
      "@media (min-width:640px){#mc-detail-card{border-radius:16px;padding:20px;}}" +
      "#mc-detail-card .mc-grabber{width:36px;height:4px;border-radius:2px;background:#e2e8f0;margin:8px auto 12px;}" +
      "@media (min-width:640px){#mc-detail-card .mc-grabber{display:none;}}" +
      "#mc-detail-card h2{margin:0 0 4px;font-size:17px;}" +
      "#mc-detail-card h3{margin:14px 0 6px;font-size:13px;color:#334155;}" +
      "#mc-detail-card ul{margin:0;padding-left:18px;font-size:14px;line-height:1.6;}" +
      "#mc-detail-card p{font-size:14px;line-height:1.6;margin:0;}" +
      "#mc-detail-close{border:none;background:#f1f5f9;border-radius:10px;padding:8px 14px;cursor:pointer;" +
      "font-size:14px;font-weight:600;min-height:36px;touch-action:manipulation;flex:none;}";
    document.head.appendChild(style);

    overlay = document.createElement("div");
    overlay.id = "mc-detail-overlay";
    overlay.innerHTML = '<div id="mc-detail-card"><div class="mc-grabber"></div><div id="mc-detail-body"></div></div>';
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  window.showRecordDetail = function (record) {
    if (!record) return;
    const overlay = ensureOverlay();
    const body = document.getElementById("mc-detail-body");
    const metaBits = [formatRange(record), record.siteType, record.companions].filter(Boolean).map(escapeHtml).join(" ・ ");
    body.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:start;gap:10px;">' +
      "<h2>" + escapeHtml(record.placeName || "") + "</h2>" +
      '<button id="mc-detail-close">閉じる</button>' +
      "</div>" +
      '<div style="font-size:12.5px;color:#64748b;margin-bottom:8px;">' + metaBits + "</div>" +
      (record.placeMemo ? '<div style="font-size:12.5px;color:#64748b;margin-bottom:8px;">' + escapeHtml(record.placeMemo) + "</div>" : "") +
      weatherHtml(record) +
      gearHtml(record) +
      (record.meals ? '<h3>食事・料理</h3><p>' + escapeHtml(record.meals) + "</p>" : "") +
      (record.campfire ? '<h3>焚き火</h3><p>🔥 した' + (record.campfireNote ? " - " + escapeHtml(record.campfireNote) : "") + "</p>" : "") +
      activitiesHtml(record) +
      costsHtml(record) +
      (typeof record.rating === "number" ? '<h3>満足度</h3><p>' + "★".repeat(record.rating) + "☆".repeat(Math.max(0, 5 - record.rating)) + "</p>" : "") +
      (typeof record.wantToReturn === "boolean" ? '<h3>また行きたい</h3><p>' + (record.wantToReturn ? "👍 また行きたい" : "—") + "</p>" : "") +
      (record.memo ? '<h3>メモ</h3><p>' + escapeHtml(record.memo) + "</p>" : "");
    document.getElementById("mc-detail-close").onclick = () => (overlay.style.display = "none");
    overlay.style.display = "flex";
  };

  // Fetch data.json once and cache it; shared by map.html / calendar.html / dashboard.html.
  let cache = null;
  window.loadCampVisits = async function () {
    if (cache) return cache;
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    cache = await res.json();
    return cache;
  };

  window.openRecordById = async function (id) {
    const items = await window.loadCampVisits();
    const rec = items.find((it) => it.id === id);
    window.showRecordDetail(rec);
  };
})();
