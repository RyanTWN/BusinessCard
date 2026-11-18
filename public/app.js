(function () {
  "use strict";

  var C = window.CARD_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  var fullName = (C.lastName || "") + (C.firstName || "");

  // ---------- 1. App 內建瀏覽器處理 ----------
  // LINE：自動改用外部瀏覽器開啟（LINE 官方支援的參數）
  if (/\bLine\//i.test(ua)) {
    var u = new URL(location.href);
    if (!u.searchParams.has("openExternalBrowser")) {
      u.searchParams.set("openExternalBrowser", "1");
      location.replace(u.toString());
      return;
    }
  }
  // IG / FB / Threads / Messenger：無法自動跳出，顯示提示
  if (/Instagram|FBAN|FBAV|FB_IAB|Barcelona|Messenger/i.test(ua)) {
    $("inapp").hidden = false;
  }

  // ---------- 2. 畫面填入 ----------
  document.title = fullName ? "儲存聯絡人｜" + fullName : "儲存聯絡人";
  $("name").textContent = fullName;
  $("en").textContent = C.englishName || "";
  // 標語（slogan）優先顯示；以 | 分段，每段不拆開換行
  var headline = C.slogan || C.title || "";
  headline.split(/\s*\|\s*/).forEach(function (part, i) {
    if (i) {
      var sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "|";
      $("title").appendChild(sep);
    }
    var span = document.createElement("span");
    span.className = "nowrap";
    span.textContent = part;
    $("title").appendChild(span);
  });
  $("company").textContent = C.company || "";
  // 副標：每個項目不拆開，只在 × 處換行
  (C.tagline || "").split(/\s*×\s*/).forEach(function (part, i) {
    if (i) $("tagline").appendChild(document.createTextNode(" × "));
    var span = document.createElement("span");
    span.className = "nowrap";
    span.textContent = part;
    $("tagline").appendChild(span);
  });

  (C.tags || []).forEach(function (t) {
    var li = document.createElement("li");
    if (t && typeof t === "object") {
      var a = document.createElement("a");
      a.href = t.url;
      a.textContent = t.text + " ›";
      li.appendChild(a);
      li.className = "link";
    } else {
      li.textContent = t;
    }
    $("tags").appendChild(li);
  });

  var contacts = [
    ["手機", C.phone, C.phone && "tel:" + C.phone],
    ["Email", C.email, C.email && "mailto:" + C.email],
    ["LINE", C.lineUrl && "加入 LINE 好友", C.lineUrl],
    ["網站", C.website && C.website.replace(/^https?:\/\//, "").replace(/\/$/, ""), C.website],
  ];
  contacts.forEach(function (c) {
    if (!c[1] || !c[2]) return;
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = c[2];
    if (/^https?:/.test(c[2])) { a.target = "_blank"; a.rel = "noopener"; }
    var label = document.createElement("span");
    label.className = "label";
    label.textContent = c[0];
    var val = document.createElement("span");
    val.textContent = c[1];
    a.appendChild(label);
    a.appendChild(val);
    li.appendChild(a);
    $("contacts").appendChild(li);
  });

  if (C.backUrl) {
    $("back").href = C.backUrl;
    $("back").textContent = C.backLabel || "← 回到主頁";
    $("back").hidden = false;
  }

  var footer = [];
  if (C.licenseNo) footer.push("保險業務員登錄字號：" + C.licenseNo);
  if (C.insurer) footer.push("所屬公司：" + C.insurer);
  footer.push("© " + new Date().getFullYear() + " " + (C.company || fullName || ""));
  $("footer").innerHTML = footer.map(escapeHtml).join("<br>");

  // ---------- 3. 頭像（同時縮小成 vCard 用的 base64） ----------
  var photoB64 = "";
  var avatarEl = $("avatar");
  avatarEl.textContent = (C.firstName || fullName || "?").charAt(0);

  if (C.avatar) {
    var img = new Image();
    img.onload = function () {
      avatarEl.style.backgroundImage = "url('" + C.avatar + "')";
      avatarEl.textContent = "";
      try {
        var size = 256;
        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        var ctx = canvas.getContext("2d");
        var s = Math.min(img.naturalWidth, img.naturalHeight);
        ctx.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, size, size);
        photoB64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1] || "";
      } catch (e) { photoB64 = ""; }
    };
    img.src = C.avatar;
  }

  // ---------- 4. vCard 產生 ----------
  function esc(v) {
    return String(v || "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  // 依 RFC 2425 每行最多 75 bytes 折行（中文以 UTF-8 計算）
  function fold(line) {
    var enc = new TextEncoder();
    if (enc.encode(line).length <= 75) return line;
    var out = [], cur = "", curLen = 0, limit = 75;
    for (var ch of line) {
      var n = enc.encode(ch).length;
      if (curLen + n > limit) {
        out.push(cur);
        cur = ""; curLen = 0; limit = 74; // 續行前面有一個空白
      }
      cur += ch; curLen += n;
    }
    out.push(cur);
    return out.join("\r\n ");
  }

  function buildVCard() {
    var noteParts = [C.note, C.licenseNo && "保險業務員登錄字號：" + C.licenseNo].filter(Boolean);
    var lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N;CHARSET=UTF-8:" + esc(C.lastName) + ";" + esc(C.firstName) + ";;;",
      "FN;CHARSET=UTF-8:" + esc(fullName),
    ];
    if (C.englishName) lines.push("NICKNAME;CHARSET=UTF-8:" + esc(C.englishName));
    if (C.company) lines.push("ORG;CHARSET=UTF-8:" + esc(C.company));
    if (C.title) lines.push("TITLE;CHARSET=UTF-8:" + esc(C.title));
    if (C.phone) lines.push("TEL;TYPE=CELL,VOICE:" + C.phone);
    if (C.email) lines.push("EMAIL;TYPE=INTERNET,PREF:" + C.email);
    if (C.website) lines.push("URL;TYPE=WORK:" + C.website);
    if (C.lineUrl) {
      lines.push("item1.URL:" + C.lineUrl);
      lines.push("item1.X-ABLabel:LINE");
    }
    if (noteParts.length) lines.push("NOTE;CHARSET=UTF-8:" + esc(noteParts.join("\n")));
    if (photoB64) lines.push("PHOTO;ENCODING=b;TYPE=JPEG:" + photoB64);
    lines.push("REV:" + new Date().toISOString().replace(/[-:]|\.\d{3}/g, ""));
    lines.push("END:VCARD");
    return lines.map(fold).join("\r\n") + "\r\n";
  }

  function download() {
    var vcf = buildVCard();
    // 檔名用英文，部分瀏覽器會忽略中文檔名
    var slug = (C.englishName || C.company || "").trim().replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
    var filename = (slug || "contact") + ".vcf";

    if (isIOS) {
      // iOS Safari 開啟 vCard 會直接跳出「加入聯絡人」畫面
      location.href = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcf);
    } else {
      var blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    }
    toast("已產生聯絡人檔案，請開啟以加入通訊錄");
  }

  $("save").addEventListener("click", download);

  // ---------- 5. 工具 ----------
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // 網址加上 ?download=1 時自動下載（可做成 NFC / QR 直接存聯絡人）
  if (new URLSearchParams(location.search).get("download") === "1") {
    setTimeout(download, 600);
  }

  // 方便測試
  window.__buildVCard = buildVCard;
})();
