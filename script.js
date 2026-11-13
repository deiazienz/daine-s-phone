/* ===== CONFIG  (everything you will want to change is here) ===== */
const PASSCODE = "0111";               // Daine's birthday (Jan 11)
const OWNER = "Daine";                 // the phone's owner (shown in "My Card")
const MAIN_CONTACT = "";               // name of the chat that opens (none yet)
const WALL_LOCK = "photos_phone/jay1.jpg"; // lock screen wallpaper
const WALL_HOME = "photos_phone/jay2.jpg"; // home screen wallpaper
const LOCKET_PHOTO = "photos_phone/locket1.jpg";
const LOCKET_CAPTION = "Interesting (and tiring).";
const SPOTIFY_PLAYLIST = "4ZDf1lxeER2IueRbzqDZHo"; // open.spotify.com/playlist/ID
const CAL_START_YEAR = 2026;           // calendar shows this year + the next one
// Bump this number every time you change seed data (notes, messages, calendar...)
// so browsers that already opened the phone reload the new data.
const SEED_VERSION = "1";
try {
  if (localStorage.getItem("iphoneSeedVersion") !== SEED_VERSION) {
    ["threads", "recs", "cts", "notes3", "evs", "alarms", "igExtra"].forEach(key => localStorage.removeItem(key));
    localStorage.setItem("iphoneSeedVersion", SEED_VERSION);
  }
}
catch (e) { }
/* ================================================================= */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const store = { get(k, d) { try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  }
  catch (e) {
    return d;
  } }, set(k, v) { try {
    localStorage.setItem(k, JSON.stringify(v));
  }
  catch (e) { } } };
let baseH = innerHeight;
function fit() {
  const vv = window.visualViewport, w = Math.round(innerWidth), h0 = Math.round(vv ? vv.height : innerHeight), ae = document.activeElement;
  const typing = !!(ae && /INPUT|TEXTAREA/.test(ae.tagName) && w <= 820); // on phones, ignore the on-screen keyboard shrinking the viewport
  if (!typing || h0 > baseH)
    baseH = h0;
  const H = typing ? baseH : h0, small = w <= 520, k = small ? Math.min(w / 414, H / 868, 1.6) : Math.min(1.2, (H - 24) / 884, w / 450);
  $("#stage").style.transform = "scale(" + Math.max(.2, k) + ")";
  $("#stage").style.marginBottom = "0";
}
if (window.visualViewport)
  visualViewport.addEventListener("resize", () => fit());
addEventListener("orientationchange", () => setTimeout(fit, 250));
addEventListener("focusin", () => setTimeout(fit, 50));
addEventListener("focusout", () => setTimeout(fit, 300));
addEventListener("resize", fit);
fit();
function setWall() {
  $("#wall").style.background = `center/cover url(${WALL_HOME})`;
  $("#lock").style.background = `center/cover url(${WALL_LOCK})`;
  $("#pass").style.background = `linear-gradient(rgba(8,28,8,.45),rgba(8,28,8,.45)), center/cover url(${WALL_LOCK})`;
}
setWall();
function readImg(f, cb) { if (!f)
  return; const r = new FileReader(); r.onload = () => cb(r.result); r.readAsDataURL(f); }
const D = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], M = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], p2 = n => String(n).padStart(2, "0");
let lastT = "";
function fitTime() { const e = $("#lt"); e.style.fontSize = "100px"; const w = e.offsetWidth || 1; e.style.fontSize = Math.min(170, 100 * 340 / w) + "px"; }
function tick() {
  const n = new Date(), hm = p2(n.getHours()) + ":" + p2(n.getMinutes()), h12 = n.getHours() % 12 || 12, s = n.getSeconds();
  if (hm !== lastT) {
    lastT = hm;
    $("#lt").textContent = hm;
    $("#sbt").textContent = hm;
    fitTime();
  }
  $("#ld").textContent = D[n.getDay()].slice(0, 3) + " " + n.getDate() + " " + M[n.getMonth()].slice(0, 3);
  $("#cw").textContent = D[n.getDay()].slice(0, 3);
  $("#cd").textContent = n.getDate();
  const hr = (n.getHours() % 12 + n.getMinutes() / 60) * 30, mn = (n.getMinutes() + s / 60) * 6, sc = s * 6;
  [["#ih", hr], ["#im", mn], ["#is", sc]].forEach(([q, a]) => $(q).style.transform = `rotate(${a}deg)`);
}
tick();
setInterval(tick, 1000);
if (document.fonts)
  document.fonts.ready.then(fitTime);
$("#ticks").innerHTML = [...Array(12)].map((_, i) => `<line y1="-27" y2="-24" stroke="#999" stroke-width="1" transform="rotate(${i * 30})"/>`).join("");
// lock
let code = "", pbusy = false;
const pad = $("#pad");
"123456789".split("").forEach(n => pad.insertAdjacentHTML("beforeend", `<button class="k" type="button" data-n="${n}">${n}<small>${["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"][n - 1]}</small></button>`));
pad.insertAdjacentHTML("beforeend", `<button class="k z" type="button" data-n="0">0<small></small></button>`);
pad.insertAdjacentHTML("beforeend", `<button class="k del" type="button" id="kdelp" data-del aria-label="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.5h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-6-6.500z"/><path d="m12.500 9.500 5 5m0-5-5 5"/></svg></button>`);
function dots() { $$("#dots i").forEach((d, i) => d.classList.toggle("f", i < code.length)); $("#kdelp").style.visibility = code.length && !pbusy ? "visible" : "hidden"; }
function unlock() { $("#lock").classList.add("up"); $("#pass").classList.remove("on"); $("#phone").classList.remove("pass", "locked"); $("#hb").style.display = "block"; }
function wrongCode() {
  $("#dots").classList.add("shake", "err");
  $("#pad").classList.add("shake");
  if (navigator.vibrate)
    try {
      navigator.vibrate([60, 40, 60]);
    }
    catch (e) { }
  setTimeout(() => { $("#dots").classList.remove("shake", "err"); $("#pad").classList.remove("shake"); code = ""; pbusy = false; dots(); }, 480);
}
function pressDigit(n) {
  if (pbusy || code.length >= 4)
    return;
  code += n;
  dots();
  if (code.length === 4) {
    pbusy = true;
    dots();
    setTimeout(() => { if (code === PASSCODE) {
      pbusy = false;
      unlock();
    }
    else
      wrongCode(); }, 180);
  }
}
function pressDel() { if (pbusy || !code.length)
  return; code = code.slice(0, -1); dots(); }
pad.addEventListener("click", e => { if (e.target.closest("[data-del]")) {
  pressDel();
  return;
} const b = e.target.closest("[data-n]"); if (b)
  pressDigit(b.dataset.n); });
function askPass() { code = ""; pbusy = false; $("#dots").classList.remove("shake", "err"); $("#pad").classList.remove("shake"); dots(); $("#pass").classList.add("on"); $("#phone").classList.add("pass"); }
$("#cancel").onclick = () => { $("#pass").classList.remove("on"); $("#phone").classList.remove("pass"); };
$("#lh").onclick = askPass;
// desktop keyboard: digits, Backspace, Escape (passcode) / Arrow Up or Enter (lockscreen)
addEventListener("keydown", e => {
  if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName))
    return;
  if ($("#pass").classList.contains("on")) {
    if (/^[0-9]$/.test(e.key)) {
      pressDigit(e.key);
      e.preventDefault();
    }
    else if (e.key === "Backspace" || e.key === "Delete") {
      pressDel();
      e.preventDefault();
    }
    else if (e.key === "Escape")
      $("#cancel").onclick();
  }
  else if ($("#phone").classList.contains("locked") && (e.key === "ArrowUp" || e.key === "Enter")) {
    askPass();
    e.preventDefault();
  }
});
// swipe up on the lockscreen (pointer events = mouse + touch + pen)
const lk = $("#lock");
let sw0 = null;
const phoneK = () => ($("#phone").getBoundingClientRect().height || 864) / 864;
lk.addEventListener("pointerdown", e => { if (e.target.closest(".lbtn") || (e.pointerType === "mouse" && e.button !== 0))
  return; sw0 = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now(), drag: false }; });
lk.addEventListener("pointermove", e => {
  if (!sw0 || e.pointerId !== sw0.id)
    return;
  const dy = sw0.y - e.clientY, dx = Math.abs(e.clientX - sw0.x);
  if (!sw0.drag) {
    if (Math.abs(dy) > 8 * phoneK() && Math.abs(dy) > dx) {
      sw0.drag = true;
      try {
        lk.setPointerCapture(e.pointerId);
      }
      catch (_) { }
      lk.style.transition = "none";
    }
    else
      return;
  }
  const up = Math.max(0, dy) / phoneK();
  lk.style.transform = `translateY(${-up * .7}px)`;
  lk.style.opacity = String(Math.max(.25, 1 - up / 380));
});
function endSwipe(e) {
  if (!sw0 || e.pointerId !== sw0.id)
    return;
  const s = sw0;
  sw0 = null;
  if (!s.drag)
    return;
  const dy = (s.y - e.clientY) / phoneK(), go = e.type === "pointerup" && (dy > 70 || (dy > 28 && Date.now() - s.t < 300));
  if (go)
    askPass();
  requestAnimationFrame(() => { lk.style.transition = ""; lk.style.transform = ""; lk.style.opacity = ""; });
}
lk.addEventListener("pointerup", endSwipe);
lk.addEventListener("pointercancel", endSwipe);
lk.addEventListener("wheel", e => { if (e.deltaY > 30 && !$("#pass").classList.contains("on"))
  askPass(); }, { passive: true });
$("#fl").onclick = function () { this.classList.toggle("on"); };
$("#hb").onclick = () => { if ($(".ap.on"))
  closeApp();
else {
  $("#lock").classList.remove("up");
  $("#phone").classList.add("locked");
  $("#hb").style.display = "none";
} };
function closeApp() { $$(".ap.on").forEach(a => a.classList.remove("on")); $("#big").style.display = "none"; $("#bigbar").style.display = "none"; $("#phone").classList.remove("light"); }
$$("[data-open]").forEach(a => a.onclick = () => { $("#ap-" + a.dataset.open).classList.add("on"); $("#phone").classList.add("light"); (window.openApp || {})[a.dataset.open] && window.openApp[a.dataset.open](); if (a.dataset.open === "spot")
  openSpot(); });
function openSpot() {
  const f = $("#sf"), e = $("#spot-empty");
  if (!SPOTIFY_PLAYLIST) { f.style.display = "none"; e.style.display = "block"; return; }
  f.style.display = ""; e.style.display = "none";
  if (!f.src) f.src = "https://open.spotify.com/embed/playlist/" + SPOTIFY_PLAYLIST + "?utm_source=generator";
}
$$("[data-close]").forEach(b => b.onclick = closeApp);
// Locket: static display only
const locket = $("#locket");
locket.style.backgroundImage = `url('${LOCKET_PHOTO}')`;
locket.style.backgroundSize = "cover";
locket.style.backgroundPosition = "center";
$("#lpp").style.display = "none";
$("#lcap").textContent = LOCKET_CAPTION;
// ---------- NOTES ----------
function dAgo(days, hours, minutes) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}
const SEED = [
  { t: dAgo(0, 9, 30), x: "To do ☑\n\n☑ submit circuits lab report\n☐ review for finals exam\n☐ solve diff eq problem set\n☐ bring breadboard + multimeter for lab\n☐ logic circuits assignment\n☐ print lab sheets\n☐ study session w/ blockmates\n☐ sleep early 😴" }
];
let notes = store.get("notes3", null) || SEED.map((n, i) => ({ id: i + 1, ...n }));
let nid = null;
const DD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function fdate(t) { const d = new Date(t), a = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / 864e5); return a === 1 ? "Yesterday" : a < 1 ? p2(d.getHours()) + ":" + p2(d.getMinutes()) : a < 7 ? DD[d.getDay()] : p2(d.getDate()) + "/" + p2(d.getMonth() + 1) + "/" + d.getFullYear(); }
function nsplit(x) { const l = x.split("\n"); return [l[0] || "New Note", (l.slice(1).join(" ").trim()) || "No additional text"]; }
function rnotes() {
  const q = $("#nq").value.toLowerCase();
  const L = [...notes].sort((a, b) => b.t - a.t).filter(n => n.x.toLowerCase().includes(q));
  const g = [["Today", []], ["Previous 7 Days", []], ["Previous 30 Days", []], ["Older", []]], t0 = new Date().setHours(0, 0, 0, 0);
  L.forEach(n => { const a = Math.floor((t0 - new Date(n.t).setHours(0, 0, 0, 0)) / 864e5); g[a < 1 ? 0 : a < 7 ? 1 : a < 30 ? 2 : 3][1].push(n); });
  $("#ncount").textContent = notes.length + " Notes";
  $("#nsc").innerHTML = g.filter(x => x[1].length).map(([h, a]) => `<div class="sg">${h}</div><div class="card">${a.map(n => { const [s, b] = nsplit(n.x); return `<div class="row" data-i="${n.id}"><b></b><span></span><em>🗀 Notes</em></div>`; }).join("")}</div>`).join("");
  const rows = $$("#nsc .row");
  let k = 0;
  g.forEach(([h, a]) => a.forEach(n => { const [s, b] = nsplit(n.x), r = rows[k++]; r.querySelector("b").textContent = s; r.querySelector("span").textContent = fdate(n.t) + "  " + b; }));
}
$("#nq").oninput = rnotes;
$("#nsc").onclick = e => { const r = e.target.closest(".row"); if (r) {
  nid = +r.dataset.i;
  $("#ntxt").value = notes.find(n => n.id === nid).x;
  $("#ned").classList.add("on");
} };
$("#nnew").onclick = () => { nid = Math.max(0, ...notes.map(n => n.id)) + 1; notes.push({ id: nid, t: Date.now(), x: "" }); $("#ntxt").value = ""; $("#ned").classList.add("on"); $("#ntxt").focus(); };
$("#ntxt").oninput = () => { const n = notes.find(n => n.id === nid); if (n) {
  n.x = $("#ntxt").value;
  n.t = Date.now();
  store.set("notes3", notes);
} };
function nclose() { $("#ned").classList.remove("on"); notes = notes.filter(n => n.x.trim()); store.set("notes3", notes); rnotes(); }
$("#nback").onclick = nclose;
$("#ndel").onclick = () => { notes = notes.filter(n => n.id !== nid); $("#ntxt").value = ""; nclose(); };
rnotes();
// ---------- CALENDAR ----------
const NOW = new Date();
const openApp = {};
const Y = CAL_START_YEAR, MA = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Yearly holidays ("MM-DD": name). Add or delete freely.
const HOL = { "05-01": "Labor Day", "06-12": "Independence Day", "08-21": "Ninoy Aquino Day", "10-31": "Halloween", "11-01": "All Saints’ Day", "11-02": "All Souls’ Day", "11-30": "Bonifacio Day", "12-08": "Immaculate Conception", "12-30": "Rizal Day" };
// Your events ("YYYY-MM-DD": [list of events])
const CAL_EVENTS = {
  "2026-12-24": ["Christmas Eve"],
  "2026-12-25": ["Christmas Day"],
  "2026-12-31": ["New Year’s Eve"],
  "2027-01-01": ["birthday ng asawa ng pinakamagandang babae", "New Year's Day"],
  "2027-01-11": ["birthday ng pinakamagandang babae"]
};
let evs = store.get("evs", null) || CAL_EVENTS, sel = null;
const ykey = (yr, mo, d) => yr + "-" + p2(mo + 1) + "-" + p2(d);
const todayIdx = () => Math.min(23, Math.max(0, (NOW.getFullYear() - Y) * 12 + NOW.getMonth()));
function rcal() {
  let h = "";
  const ti = (NOW.getFullYear() - Y) * 12 + NOW.getMonth();
  for (let m = 0; m < 24; m++) {
    const yr = Y + Math.floor(m / 12), mo = m % 12;
    const f = (new Date(yr, mo, 1).getDay() + 6) % 7, n = new Date(yr, mo + 1, 0).getDate();
    h += `<div class="cm ${m === ti ? "" : "o"}" data-m="${m}" style="padding-left:${f / 7 * 100}%">${MA[mo]}${m >= 12 ? " " + yr : ""}</div>`;
    for (let w = 0; w < Math.ceil((f + n) / 7); w++) {
      h += '<div class="wkr">';
      for (let c = 0; c < 7; c++) {
        const d = w * 7 + c - f + 1;
        if (d < 1 || d > n) { h += "<div></div>"; continue; }
        const td = m === ti && d === NOW.getDate(), k = ykey(yr, mo, d), ho = HOL[p2(mo + 1) + "-" + p2(d)], ev = evs[k] || [];
        h += `<div class="dc ${c > 4 ? "we" : ""} ${td ? "td" : ""} ${sel === k ? "sel" : ""}" data-k="${k}"><span class="n">${d}</span>${ho ? `<span class="ev">★ ${ho}</span>` : ""}${ev.map(() => `<span class="ev u"></span>`).join("")}</div>`;
      }
      h += "</div>";
    }
  }
  $("#cs").innerHTML = h;
  $$("#cs .dc").forEach(dc => { const spans = dc.querySelectorAll(".ev.u"); (evs[dc.dataset.k] || []).forEach((t, i) => { if (spans[i]) spans[i].textContent = t; }); });
}
const MFULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function ctitle() {
  const st = $("#cs").scrollTop, ms = $$("#cs .cm");
  if (!ms.length) return;
  let c = 0;
  ms.forEach((e, i) => { if (e.offsetTop - ms[0].offsetTop <= st + 40) c = i; });
  $("#cmt").textContent = MFULL[c % 12] + (c >= 12 ? " " + (Y + 1) : "");
  $("#cyr").textContent = Y + Math.floor(c / 12);
}
function cgo(m) { const e = $$("#cs .cm")[m]; if (!e) return; $("#cs").scrollTop = e.offsetTop - 4; ctitle(); }
$("#cs").onscroll = ctitle;
$("#cyr").textContent = Y;
$("#cs").onclick = e => {
  const d = e.target.closest(".dc");
  if (!d) return;
  sel = d.dataset.k;
  const [y, mo, da] = sel.split("-").map(Number), st = $("#cs").scrollTop;
  rcal();
  $("#cs").scrollTop = st;
  $("#csd").textContent = new Date(y, mo - 1, da).toDateString();
  const ho = HOL[p2(mo) + "-" + p2(da)];
  $("#cev").innerHTML = "";
  [ho && "★ " + ho, ...(evs[sel] || [])].filter(Boolean).forEach(t => { const x = document.createElement("div"); x.style.padding = "4px 0"; x.textContent = t; $("#cev").appendChild(x); });
  $("#csheet").classList.add("on");
};
$("#cok").onclick = () => { const v = $("#cin").value.trim(); if (v && sel) {
  (evs[sel] = evs[sel] || []).push(v);
  store.set("evs", evs);
  $("#cin").value = "";
  const st = $("#cs").scrollTop;
  rcal();
  $("#cs").scrollTop = st;
  $("#csheet").classList.remove("on");
} };
$("#cadd").onclick = () => { if (!sel) sel = ykey(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()); $("#csd").textContent = sel; $("#cev").innerHTML = ""; $("#csheet").classList.add("on"); $("#cin").focus(); };
$("#ctod").onclick = () => { $("#csheet").classList.remove("on"); cgo(todayIdx()); };
rcal();
openApp.cal = () => setTimeout(() => cgo(todayIdx()), 50);
// ---------- CLOCK ----------
let alarms = store.get("alarms", ["09:00", "09:30", "10:00", "10:30", "11:00"].map((t, i) => ({ id: i, t, o: 1 }))), tab = "a";
let sw = { run: 0, t0: 0, acc: 0, laps: [] }, tm = { run: 0, end: 0, left: 0, iv: null };
const fmt = (ms) => { const c = Math.floor(ms / 10) % 100, s = Math.floor(ms / 1000) % 60, m = Math.floor(ms / 6e4); return p2(m) + ":" + p2(s) + "." + p2(c); }, swms = () => sw.acc + (sw.run ? Date.now() - sw.t0 : 0);
function rclock() {
  const b = $("#cl-body");
  $$(".tabs button").forEach(x => x.classList.toggle("on", x.dataset.t === tab));
  $("#ctitle").textContent = "";
  $("#alp").style.visibility = tab === "a" ? "visible" : "hidden";
  if (tab === "a") {
    b.innerHTML = `<div class="big" style="font-size:36px">Alarms</div><div style="font-size:20px;font-weight:700;margin:14px 0">🛏 Sleep | Wake Up</div><div class="al" style="color:#8e8e93;font-size:18px">No Alarm<button class="pill" style="background:#f2f2f7;color:#ff9f0a;font-size:14px">SET UP</button></div><div class="big" style="margin-top:34px">Other</div>` + alarms.sort((a, b) => a.t < b.t ? -1 : 1).map(a => `<div class="al ${a.o ? "on" : ""}"><div><b>${a.t}</b><small>Alarm</small></div><div class="tg ${a.o ? "on" : ""}" data-id="${a.id}"></div></div>`).join("");
  }
  else if (tab === "w") {
    b.innerHTML = `<div class="big" style="font-size:36px">World Clock</div>` + [["Manila", "Asia/Manila"], ["New York", "America/New_York"]].map(([n, z]) => `<div class="wr"><div><div style="font-size:20px;font-weight:600">${n}</div><small style="color:#8e8e93">${z.split("/")[0]}</small></div><b data-z="${z}"></b></div>`).join("");
    wtick();
  }
  else if (tab === "s") {
    b.innerHTML = `<div class="sw" id="swd">${fmt(swms())}</div><div class="bts"><button class="cb" id="swl">${sw.run ? "Lap" : "Reset"}</button><button class="cb ${sw.run ? "r" : "g"}" id="sws">${sw.run ? "Stop" : "Start"}</button></div><div id="lps">${sw.laps.map((l, i) => `<div class="wr" style="padding:10px 0"><span>Lap ${sw.laps.length - i}</span><span>${fmt(l)}</span></div>`).join("")}</div>`;
  }
  else {
    const L = tm.run ? tm.left : 0;
    b.innerHTML = tm.run || tm.left ? `<div class="sw" id="tmd">${hms(tm.run ? tm.end - Date.now() : tm.left)}</div><div class="bts"><button class="cb" id="tmc">Cancel</button><button class="cb ${tm.run ? "" : "g"}" id="tms">${tm.run ? "Pause" : "Resume"}</button></div>` : `<div class="big" style="font-size:36px">Timers</div><div class="tm">${["h", "m", "s"].map((u, i) => `<select id="t${u}">${[...Array(i ? 60 : 24).keys()].map(v => `<option value="${v}" ${u === "m" && v === 5 ? "selected" : ""}>${v} ${u}</option>`).join("")}</select>`).join("")}</div><div style="text-align:center"><button class="cb g" id="tmg">Start</button></div>`;
  }
}
const hms = ms => { ms = Math.max(0, Math.ceil(ms / 1e3)); return p2(Math.floor(ms / 3600)) + ":" + p2(Math.floor(ms / 60) % 60) + ":" + p2(ms % 60); };
function wtick() { $$("[data-z]").forEach(e => e.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: e.dataset.z, hour: "2-digit", minute: "2-digit" })); }
$("#cl-body").onclick = e => {
  const t = e.target, id = t.dataset.id;
  if (id !== undefined) {
    const a = alarms.find(a => a.id == id);
    a.o = a.o ? 0 : 1;
    store.set("alarms", alarms);
    rclock();
  }
  if (t.id === "sws") {
    if (sw.run) {
      sw.acc = swms();
      sw.run = 0;
    }
    else {
      sw.t0 = Date.now();
      sw.run = 1;
    }
    rclock();
  }
  if (t.id === "swl") {
    if (sw.run)
      sw.laps.unshift(swms());
    else {
      sw = { run: 0, t0: 0, acc: 0, laps: [] };
    }
    rclock();
  }
  if (t.id === "tmg") {
    const s = +$("#th").value * 3600 + +$("#tm").value * 60 + +$("#ts").value;
    if (s) {
      tm = { run: 1, end: Date.now() + s * 1e3, left: s * 1e3 };
    }
    rclock();
  }
  if (t.id === "tms") {
    if (tm.run) {
      tm.left = tm.end - Date.now();
      tm.run = 0;
    }
    else {
      tm.end = Date.now() + tm.left;
      tm.run = 1;
    }
    rclock();
  }
  if (t.id === "tmc") {
    tm = { run: 0, end: 0, left: 0 };
    rclock();
  }
};
$$(".tabs button").forEach(b => b.onclick = () => { tab = b.dataset.t; rclock(); });
$("#alp").onclick = () => { const v = prompt("New alarm time (24h, e.g. 05:30)", "05:30"); if (/^\d{1,2}:\d{2}$/.test(v || "")) {
  alarms.push({ id: Date.now(), t: v.padStart(5, "0"), o: 1 });
  store.set("alarms", alarms);
  rclock();
} };
$("#rst").onclick = () => $("#ring").classList.remove("on");
setInterval(() => {
  const n = new Date(), hm = p2(n.getHours()) + ":" + p2(n.getMinutes());
  if (n.getSeconds() === 0 && alarms.some(a => a.o && a.t === hm)) {
    $("#ring").firstChild.textContent = "⏰ " + hm;
    $("#ring").classList.add("on");
  }
  if ($("#swd"))
    $("#swd").textContent = fmt(swms());
  if ($("#tmd") && tm.run) {
    const l = tm.end - Date.now();
    $("#tmd").textContent = hms(l);
    if (l <= 0) {
      tm = { run: 0, end: 0, left: 0 };
      $("#ring").firstChild.textContent = "⏲ Timer done";
      $("#ring").classList.add("on");
      rclock();
    }
  }
  if (tab === "w")
    wtick();
}, 100);
rclock();
openApp.clock = rclock;
// ---------- PHOTOS ----------*/
const PHOTO_LIST = [
  { src: "photos_phone/jay3.jpg", date: "2026-11-01" },
];
let photos = PHOTO_LIST.map((p, i) => ({ id: i + 1, s: p.src, t: p.date ? +new Date(p.date + "T12:00") : Date.now() - (PHOTO_LIST.length - i) * 864e5 })), pv = "a";
function shrink(f, cb) { const r = new FileReader(); r.onload = () => { const i = new Image(); i.onload = () => { const k = Math.min(1, 700 / Math.max(i.width, i.height)), c = document.createElement("canvas"); c.width = i.width * k; c.height = i.height * k; c.getContext("2d").drawImage(i, 0, 0, c.width, c.height); cb(c.toDataURL("image/jpeg", .72)); }; i.src = r.result; }; r.readAsDataURL(f); }
function pdate(t) { const d = new Date(t); return d.getDate() + " " + MA[d.getMonth()] + " " + d.getFullYear(); }
function rphotos(bottom) {
  const P = [...photos].sort((a, b) => a.t - b.t), w = $("#pgw");
  if (!P.length) {
    w.innerHTML = '<div class="empty">No photos yet.</div>';
    $("#pdt").textContent = "";
    return;
  }
  if (pv === "a")
    w.innerHTML = '<div class="pg">' + P.map(p => `<img data-id="${p.id}" data-t="${p.t}" src="${p.s}">`).join("") + "</div>";
  else {
    const G = {};
    P.forEach(p => { const d = new Date(p.t), k = pv === "y" ? d.getFullYear() : d.getFullYear() * 100 + d.getMonth(); (G[k] = G[k] || []).push(p); });
    w.innerHTML = '<div class="pgy">' + Object.keys(G).sort().reverse().map(k => { const l = G[k]; return `<div class="yr" data-t="${l[0].t}"><img src="${l[l.length - 1].s}"><b>${pv === "y" ? k : MA[k % 100] + " " + Math.floor(k / 100)}</b></div>`; }).join("") + "</div>";
  }
  if (bottom) {
    const s = $("#pgw");
    s.scrollTop = s.scrollHeight;
  }
  pscroll();
}
function pscroll() { const s = $("#pgw"), I = $$("#pgw img[data-t]"); let t = null; I.forEach(i => { if (i.offsetTop - s.scrollTop <= 130)
  t = i.dataset.t; }); if (!t && I[0])
  t = I[0].dataset.t; $("#pdt").textContent = t ? pdate(+t) : ""; }
$("#pgw").onscroll = pscroll;
$("#pseg").onclick = e => { const v = e.target.dataset.v; if (!v)
  return; pv = v; $$("#pseg span").forEach(x => x.classList.toggle("on", x.dataset.v === v)); rphotos(v === "a"); };
let cur = null;
$("#pgw").onclick = e => {
  const group = e.target.closest(".yr");
  if (group) {
    pv = "a";
    $$("#pseg span").forEach(x => x.classList.toggle("on", x.dataset.v === "a"));
    rphotos();
    const targetTime = Number(group.dataset.t);
    const target = [...$$("#pgw img[data-t]")].find(img => Number(img.dataset.t) >= targetTime);
    if (target) {
      $("#pgw").scrollTop = target.offsetTop - 120;
    }
    return;
  }
  const img = e.target.closest("img[data-id]");
  if (!img)
    return;
  cur = photos.find(p => p.id === Number(img.dataset.id));
  if (!cur)
    return;
  $("#big").style.backgroundImage = `url("${cur.s}")`;
  $("#big").style.display = "block";
  $("#bigbar").style.display = "flex";
  $("#bdate").textContent = pdate(cur.t);
};
$("#bback").onclick = () => { $("#big").style.display = "none"; $("#bigbar").style.display = "none"; };
$("#big").onclick = null;
rphotos(1);
openApp.photos = () => rphotos(1);
// ---------- PHONE ----------
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const AVC = ["#7d8bd6", "#d67db0", "#59a8d4", "#58b97a", "#e39a5a", "#c96a6a", "#9b78d3"];
let avs = {};
function getFixedAvatar(n) {
  // map a contact name to a profile photo, e.g. if (name.includes("dayan")) return "photos_phone/dayan.jpg";
  return null;
}
function av(n, sz) {
  const st = `width:${sz}px;height:${sz}px;font-size:${Math.round(sz * .42)}px`;
  const d = `data-n="${esc(n)}"`;
  const photo = getFixedAvatar(n);
  if (photo) {
    return `<div class="avt" ${d} style="${st};background-image:url('${photo}');background-size:cover;background-position:center;background-repeat:no-repeat"></div>`;
  }
  const L = /[A-Za-z]/.test(n[0]) ? n[0].toUpperCase() : "👤";
  const h = [...n].reduce((x, y) => x + y.charCodeAt(0), 0) % AVC.length;
  return `<div class="avt" ${d} style="${st};background:${AVC[h]}">${L}</div>`;
}
// recents
let recs = store.get("recs", null) || [], rf = "a";
function rrec() {
  const q = $("#rq").value.toLowerCase(), L = rf === "m" ? [] : recs.filter(r => r.n.toLowerCase().includes(q));
  $("#rlist").innerHTML = L.length ? L.map(r => `<div class="pr" data-n="${esc(r.n)}">${av(r.n, 52)}<div><b>${esc(r.n)}</b><small>${r.o ? "↗" : "↙"} ${esc(r.k)}</small></div><span class="dt">${fdate(r.t)}</span><span class="inf">ⓘ</span></div>`).join("") : '<div class="empty">' + (rf === "m" ? "No Missed Calls" : "No Recents") + "</div>";
}
$("#rq").oninput = rrec;
$("#rseg").onclick = e => { const f = e.target.dataset.f; if (!f)
  return; rf = f; $$("#rseg span").forEach(x => x.classList.toggle("on", x.dataset.f === f)); rrec(); };
// contacts
let cts = store.get("cts", null) || [];
function rcts() {
  const q = $("#cq").value.toLowerCase(), key = x => x.replace(/[^A-Za-z ]/g, "").trim(), L = cts.filter(n => n.toLowerCase().includes(q)).sort((a, b) => key(a).localeCompare(key(b), "en", { sensitivity: "base" }));
  let h = q ? "" : `<div class="pr" data-n="${OWNER}" style="padding:12px 0">${av(OWNER, 60)}<div style="border:0"><b style="font-size:20px">${OWNER}</b><small>My Card</small></div></div>`, last = "", ls = [];
  L.forEach(n => { const l = /[A-Za-z]/.test(n[0]) ? n[0].toUpperCase() : "#"; if (l !== last) {
    h += `<div class="sl" data-l="${l}">${l}</div>`;
    last = l;
    ls.push(l);
  } h += `<div class="pr" data-n="${esc(n)}">${av(n, 46)}<div><b style="font-weight:500">${esc(n)}</b></div></div>`; });
  $("#clist").innerHTML = h;
  $("#cidx").innerHTML = ls.map(l => `<span>${l}</span>`).join("");
}
$("#cq").oninput = rcts;
$("#cidx").onclick = e => { const l = e.target.textContent, t = $(`#clist [data-l="${l}"]`); if (t && e.target.tagName === "SPAN")
  $("#clist").scrollTop = t.offsetTop - 4; };
$("#cplus").onclick = () => { const n = (prompt("New contact name") || "").trim(); if (n) {
  cts.push(n);
  store.set("cts", cts);
  rcts();
} };
$("#cback").onclick = () => ptab("r");
// calls
function call(n) {
  $("#calla").innerHTML = av(n, 110);
  $("#calln").textContent = n;
  $("#calls").textContent = "calling…";
  $("#calling").classList.add("on");
  recs.unshift({ n, k: "mobile", o: 1, t: Date.now() });
  store.set("recs", recs);
  rrec();
  setTimeout(() => { if ($("#calling").classList.contains("on"))
    $("#calls").textContent = "ringing…"; }, 1500);
}
$("#cend").onclick = () => $("#calling").classList.remove("on");
$("#pv-r").onclick = $("#pv-c").onclick = e => {
  const r = e.target.closest(".pr");
  if (r && r.dataset.n !== OWNER)
    call(r.dataset.n);
};
// keypad
let kn = "";
const KL = { 1: "", 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ", "*": "", 0: "+", "#": "" };
$("#kg").innerHTML = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(k => `<button class="kk" data-k="${k}">${k === "*" ? "✱" : k}<small>${KL[k]}</small></button>`).join("");
function kshow() { $("#kdis").textContent = kn; $("#kdel").style.visibility = kn ? "visible" : "hidden"; }
$("#kg").onclick = e => { const b = e.target.closest("[data-k]"); if (b && kn.length < 15) {
  kn += b.dataset.k;
  kshow();
} };
$("#kdel").onclick = () => { kn = kn.slice(0, -1); kshow(); };
$("#kcall").onclick = () => { if (kn) {
  call(kn);
  kn = "";
  kshow();
} };
function ptab(t) { $$("#ap-phone .pv").forEach(p => p.classList.toggle("on", p.id === "pv-" + t)); $$("#ptabs button").forEach(b => b.classList.toggle("on", b.dataset.t === t)); }
$("#ptabs").onclick = e => { const b = e.target.closest("button"); if (b)
  ptab(b.dataset.t); };
rrec();
rcts();
openApp.phone = () => ptab("r");
// ---------- MESSAGES ----------
const Q = (n, u, a, gc) => ({ id: Math.random(), n, u, gc, m: a.map(([w, x, t]) => ({ me: w === 1, s: typeof w === "string" ? w : null, x, t })) });
let threads = store.get("threads", null) || [], curT = null, asThem = false;
const save = () => store.set("threads", threads), last = t => t.m[t.m.length - 1];
save();
function rth() {
  const q = $("#mq").value.toLowerCase();
  const order = [MAIN_CONTACT];
  const L = threads.filter(t => t.n.toLowerCase().includes(q) || t.m.some(m => m.x.toLowerCase().includes(q))).sort((a, b) => { const ai = order.indexOf(a.n), bi = order.indexOf(b.n); if (ai !== -1 || bi !== -1)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi); return (last(b) ? last(b).t : 0) - (last(a) ? last(a).t : 0); });
  $("#mls").innerHTML = L.map(t => `<div class="mrow${t.n === MAIN_CONTACT ? "" : " st"}" data-id="${t.id}">${t.u ? '<i class="ud"></i>' : ""}${av(t.n, 56)}<div class="tx"><div class="tt"><b>${esc(t.n)}</b><span>${last(t) ? fdate(last(t).t) + " ›" : ""}</span></div><p>${last(t) ? esc(last(t).x) : "No messages"}</p></div></div>`).join("");
  $$("#mls .avt").forEach(a => a.style.cursor = "pointer");
  $("#mun").textContent = threads.filter(t => t.u).length || "";
  $("#mun").style.display = $("#mun").textContent ? "inline" : "none";
}
$("#mq").oninput = rth;
function sepL(t) { const d = new Date(t), a = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / 864e5), h = p2(d.getHours()) + ":" + p2(d.getMinutes()); return a < 1 ? "Today " + h : a === 1 ? "Yesterday " + h : DD[d.getDay()].slice(0, 3) + ", " + d.getDate() + " " + MA[d.getMonth()] + " at " + h; }
function rthread() {
  const t = curT, b = $("#mbody");
  b.innerHTML = "";
  let pt = 0;
  t.m.forEach((m, i) => {
    if (m.t - pt > 36e5) {
      const s = document.createElement("div");
      s.className = "sepl";
      s.textContent = sepL(m.t);
      b.appendChild(s);
    }
    pt = m.t;
    const w = document.createElement("div");
    w.className = "mw " + (m.me ? "me" : "rc");
    if (t.gc && !m.me && m.s) {
      const n = document.createElement("div");
      n.className = "sn";
      n.textContent = m.s;
      w.appendChild(n);
    }
    const x = document.createElement("div");
    x.className = "bb";
    x.dataset.i = i;
    if (m.img) {
      const im = document.createElement("img");
      im.src = m.img;
      im.alt = "A photo";
      im.className = "message-photo";
      im.style.cursor = "zoom-in";
      x.appendChild(im);
      const cap = document.createElement("div");
      cap.textContent = m.x;
      x.appendChild(cap);
    }
    else {
      x.textContent = m.x;
    }
    w.appendChild(x);
    b.appendChild(w);
  });
  $("#mhav").innerHTML = av(t.n, 64);
  $("#mhn").textContent = t.n + " ›";
  b.scrollTop = b.scrollHeight;
  $("#mwho").style.display = asThem ? "block" : "none";
  $("#mwho").textContent = "Adding messages as " + (t.gc ? "someone else" : t.n) + " · tap ＋ to switch back";
}
$("#mls").onclick = e => { const r = e.target.closest(".mrow"); if (!r || r.classList.contains("st"))
  return; curT = threads.find(t => t.id == r.dataset.id); curT.u = 0; asThem = false; save(); rthread(); rth(); $("#mthr").classList.add("on"); };
$("#mback").onclick = () => { $("#mthr").classList.remove("on"); curT = null; rth(); };
$("#pv-r").onclick = $("#pv-c").onclick = e => {
  const r = e.target.closest(".pr");
  if (r && r.dataset.n !== OWNER)
    call(r.dataset.n);
};
$("#mbody").onclick = e => {
  const photo = e.target.closest(".message-photo");
  if (!photo)
    return;
  const viewer = document.createElement("div");
  viewer.style.cssText = `
    position:fixed;
    inset:0;
    z-index:99999;
    background:rgba(0,0,0,0.92);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    cursor:zoom-out;
  `;
  const fullImage = document.createElement("img");
  fullImage.src = photo.src;
  fullImage.alt = photo.alt;
  fullImage.style.cssText = `
    max-width:100%;
    max-height:100%;
    width:auto;
    height:auto;
    object-fit:contain;
    border-radius:12px;
  `;
  viewer.appendChild(fullImage);
  document.body.appendChild(viewer);
  viewer.onclick = () => viewer.remove();
};
$("#mplus").onclick = () => { asThem = !asThem; rthread(); };
$("#min").oninput = () => $("#msend").style.display = $("#min").value.trim() ? "inline-flex" : "none";
function msend() {
  const v = $("#min").value.trim();
  if (!v || !curT)
    return;
  let s = null;
  if (asThem && curT.gc) {
    s = prompt("Who sent it?", "");
    if (!s)
      return;
  }
  curT.m.push({ me: !asThem, s, x: v, t: Date.now() });
  $("#min").value = "";
  $("#msend").style.display = "none";
  save();
  rthread();
}
$("#msend").onclick = msend;
$("#min").onkeydown = e => { if (e.key === "Enter")
  msend(); };
$("#mnew").onclick = () => { return; const n = (prompt("Message to (name)") || "").trim(); if (!n)
  return; let t = threads.find(t => t.n === n); if (!t) {
  t = Q(n, 0, []);
  threads.push(t);
  save();
} curT = t; asThem = false; rthread(); $("#mthr").classList.add("on"); };
rth();
openApp.msg = () => { $("#mthr").classList.remove("on"); curT = null; rth(); };
/* =====================================================================
 INSTAGRAM APP 
 ===================================================================== */
(function () {
  "use strict";
  /* ---------- replacement hooks ---------- */
  const IG_ME = "eomieyu";
  const IG_BIO = "live, laugh, and love park jongseong";
  const IG_IMAGES = {
    avatars: { eomieyu: "instapics/igpfp1.jpg" },   // profile pictures
    feed: [],      // feed post pictures
    grid: [],      // profile grid pictures
    stories: {},   // story pictures per user
    shared: {}     // pictures for shared posts in DMs
  };
  const IG_AVATAR_URLS = IG_IMAGES.avatars;
  const IG_SHARED_META = {};
  const IG_LIVE_STORIES = [IG_ME];
  const ACC = {
    eomieyu: { n: "Daine" }
  };
  function igAv(u, size, cls) {
    const image = IG_AVATAR_URLS[u];
    const background = image
      ? `background-image:url('${String(image).replace(/'/g, "%27")}')`
      : "background-image:none";

    return `<i class="ig-av ${cls || ""}" style="width:${size}px;height:${size}px;${background}"></i>`;
  }
  //image file 
  const bgImg = (k, h, custom) => custom
    ? `background-image:url('${String(custom).replace(/'/g, "%27")}')`
    : "background-image:none";

  // Instagram.
  const ic = (n, c) => `<svg class="ig-i ${c || ""}"><use href="#i-${n}"/></svg>`;
  /* ---------- content ---------- */
  const STORIES = [];
  const POSTS = [];
  const PROFILE_GRID = [];
  const NOTES = [];
  const SF = {};
  /* ---------- messages ---------- */
  const ago = (m) => Date.now() - m * 60000;
  // me:1 = Daine (this phone's owner), me:0 = the other person
  const THREADS = [];
  const extra = store.get("igExtra", {});
  const seenS = {};
  let readT = {};
  THREADS.forEach(t => { if (t.un)
    readT[t.u] = 0; });
  const allMsgs = t => [...t.m, ...(extra[t.u] || [])].sort((a, b) => a.t - b.t);
  /* ---------- helpers ---------- */
  const shortAgo = t => { const m = Math.max(1, Math.round((Date.now() - t) / 60000)); return m < 60 ? m + "m" : m < 1440 ? Math.floor(m / 60) + "h" : m < 10080 ? Math.floor(m / 1440) + "d" : Math.floor(m / 10080) + "w"; };
  const clock = d => { const h = d.getHours() % 12 || 12; return h + ":" + p2(d.getMinutes()) + " " + (d.getHours() < 12 ? "AM" : "PM"); };
  function sepLabel(t) {
    const d = new Date(t), days = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / 864e5);
    return days < 1 ? clock(d) : days === 1 ? "Yesterday " + clock(d) : days < 7 ? DD[d.getDay()].slice(0, 3) + " " + clock(d) : d.getDate() + " " + MA[d.getMonth()] + ", " + clock(d);
  }
  const fmtN = n => n.toLocaleString("en-US");
  const ap = $("#ap-ig"), phone = $("#phone");
  /* ---------- home ---------- */
  function renderHome() {
    const stories = `<div class="ig-stories ig-hs">
    <button type="button" class="ig-story-i" data-story="${IG_ME}"><span class="ig-ring ${seenS[IG_ME] ? "seen" : ""}">${igAv(IG_ME, 64)}<b class="ig-plus">+</b></span><small>Your story</small></button>
    ${STORIES.map(u => IG_LIVE_STORIES.includes(u)
            ? `<button type="button" class="ig-story-i" data-story="${u}"><span class="ig-ring ${seenS[u] ? "seen" : ""}">${igAv(u, 64)}</span><small>${esc(u)}</small></button>`
            : `<div class="ig-story-i"><span class="ig-ring">${igAv(u, 64)}</span><small>${esc(u)}</small></div>`).join("")}</div>`;
    const posts = POSTS.map((p, i) => `<article class="ig-post" data-p="${i}">
    <div class="ig-ph"><span class="ig-pr">${igAv(p.u, 32)}</span><b>${esc(p.u)}</b>${ic("lines")}</div>
    <div class="ig-img" style="${bgImg(p.k, p.h, IG_IMAGES.feed[i])}"><svg class="ig-i ig-pop"><use href="#i-heart"/></svg></div>
    <div class="ig-acts"><button type="button" data-like>${ic("heart", p.liked ? "liked" : "")}</button><button type="button">${ic("comment")}<span>${p.c}</span></button><button type="button">${ic("send")}</button><span class="spc"></span><button type="button">${ic("bookmark")}</button></div>
    <div class="ig-likes"><span data-n>${fmtN(p.likes + (p.liked ? 1 : 0))}</span> likes</div>
    <div class="ig-cap"><b>${esc(p.u)}</b>${esc(p.cap)}</div>
    <div class="ig-meta">View all ${p.c} comments<i>${p.ago}</i></div></article>`).join("");
    $("#ig-feed").innerHTML = stories + (posts || '<div class="ig-empty">No posts yet</div>');
  }
  $("#ig-feed").addEventListener("click", e => {
    const s = e.target.closest("[data-story]");
    if (s) {
      openStory(s.dataset.story);
      return;
    }
    const l = e.target.closest("[data-like]");
    if (l)
      toggleLike(l.closest(".ig-post"));
  });
  $("#ig-feed").addEventListener("dblclick", e => { const im = e.target.closest(".ig-img"); if (im) {
    const p = im.closest(".ig-post");
    toggleLike(p, true);
  } });
  function toggleLike(post, force) {
    const p = POSTS[+post.dataset.p], b = post.querySelector("[data-like] .ig-i"), n = post.querySelector("[data-n]"), on = force ? true : !p.liked;
    if (force && p.liked) {
      pop(post);
      return;
    }
    p.liked = on;
    b.classList.toggle("liked", on);
    n.textContent = fmtN(p.likes + (on ? 1 : 0));
    if (on)
      pop(post);
  }
  function pop(post) { const h = post.querySelector(".ig-pop"); h.classList.remove("go"); void h.getBoundingClientRect(); h.classList.add("go"); }
  /* ---------- DM list ---------- */
  function preview(t) {
    const L = allMsgs(t).slice(-1)[0];
    if (!L)
      return "";
    const w = L.share ? (/\/reel\//.test(L.share) ? "a reel" : "a post") : null;
    return (L.me ? "You: " : "") + (w ? "sent " + w : L.x);
  }
  function renderDM() {
    const q = ($("#ig-dmq").value || "").toLowerCase().trim();
    const L = THREADS.filter(t => !q || t.u.includes(q) || ACC[t.u].n.toLowerCase().includes(q) || allMsgs(t).some(m => (m.x || "").toLowerCase().includes(q)));
    $("#ig-threads").innerHTML = L.length ? L.map(t => {
      const last = allMsgs(t).slice(-1)[0], un = readT[t.u] === 0;
      const live = true; // every DM opens
      return `<${live ? 'button type="button" data-u="' + t.u + '"' : 'div aria-disabled="true"'} class="ig-th ${un ? "un" : ""} ${live ? "" : "st"}">${igAv(t.u, 56)}<div class="tx"><div class="nm">${esc(t.u)}${t.pin ? `<i>${ic("pin")}</i>` : ""}</div><div class="pvw">${esc(preview(t))} · ${shortAgo(last.t)}</div></div><div class="rt">${un ? '<span class="ub"></span>' : ic("camera", "sm")}</div></${live ? "button" : "div"}>`;
    }).join("") : '<div class="ig-empty">No messages found</div>';
    $(".ig-dot").style.display = Object.values(readT).some(v => v === 0) ? "block" : "none";
  }
  $("#ig-dmq").addEventListener("input", renderDM);
  $("#ig-threads").addEventListener("click", e => { const b = e.target.closest("button[data-u]"); if (b)
    openChat(b.dataset.u); });
  /* ---------- chat ---------- */
  let curU = null;
  function shareCard(url) {
    const meta = Object.assign({ thumb: IG_IMAGES.shared[url] }, IG_SHARED_META[url] || {}), reel = /\/reel\//.test(url);
    const thumb = meta.thumb
      ? `background-image:url('${meta.thumb}')`
      : "background-image:none";
    return `<a class="ig-share ${reel ? "reel" : ""}" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><div class="ig-sh-h"><span class="ig-sh-logo">${ic("logo")}</span><b>${esc(meta.user || "Instagram")}</b><span class="ig-sh-tag">${reel ? ic("reels") + " Reel" : "Post"}</span></div><div class="ig-sh-img" style="${thumb}">${reel ? `<span class="ig-sh-play">${ic("play")}</span>` : ""}</div><div class="ig-sh-f"><span>${esc(meta.caption || "Tap to view on Instagram")}</span><b>Open ↗</b></div></a>`;
  }
  function renderChat() {
    const t = THREADS.find(x => x.u === curU), a = ACC[curU], M = allMsgs(t);
    let h = `<div class="ig-intro"><div class="pp">${igAv(curU, 76)}${igAv(IG_ME, 76)}</div><b>${esc(a.n)}</b><small>${esc(curU)} · Instagram</small><small>You follow each other</small></div>`, pt = 0;
    M.forEach((m, i) => {
      if (!pt || m.t - pt > 2 * 36e5 || new Date(m.t).toDateString() !== new Date(pt).toDateString())
        h += `<div class="ig-sep">${sepLabel(m.t)}</div>`;
      const prev = M[i - 1], next = M[i + 1], samePrev = prev && prev.me === m.me && m.t - prev.t < 36e5 * 2 && new Date(prev.t).toDateString() === new Date(m.t).toDateString(), sameNext = next && next.me === m.me && next.t - m.t < 36e5 * 2 && new Date(next.t).toDateString() === new Date(m.t).toDateString();
      const g = samePrev && sameNext ? "gm" : samePrev ? "gl" : sameNext ? "gf" : "go";
      pt = m.t;
      if (m.story)
        h += `<div class="ig-rep">You replied to their story</div>`;
      const body = m.share ? shareCard(m.share) : `<div class="ig-bub">${esc(m.x)}${m.r ? `<span class="ig-rx">${m.r}</span>` : ""}</div>`;
      const av = !m.me ? `<span class="slot">${(!sameNext) ? igAv(curU, 28) : ""}</span>` : "";
      h += `<div class="ig-row ${m.me ? "me" : "rcv"} ${g} ${m.r && !m.share ? "rx" : ""}">${av}${body}</div>`;
    });
    $("#ig-msgs").innerHTML = h;
    $("#ig-chhead").innerHTML = `${igAv(curU, 34)}<div class="t"><b>${esc(a.n)}</b><small>${esc(curU)}</small></div>`;
    const s = $("#ig-msgs");
    s.scrollTop = s.scrollHeight;
  }
  function openChat(u) { curU = u; if (u in readT)
    readT[u] = 1; renderChat(); $("#igv-chat").classList.add("on"); ap.classList.add("inchat"); renderDM(); }
  function closeChat() { $("#igv-chat").classList.remove("on"); ap.classList.remove("inchat"); curU = null; renderDM(); }
  $("#ig-cback").addEventListener("click", closeChat);
  function addMsg(u, m) { (extra[u] = extra[u] || []).push(m); store.set("igExtra", extra); }
  function sendChat() { const v = $("#ig-min").value.trim(); if (!v || !curU)
    return; addMsg(curU, { me: 1, x: v, t: Date.now() }); $("#ig-min").value = ""; $(".ig-cpill").classList.remove("has"); renderChat(); }
  $("#ig-min").addEventListener("input", () => $(".ig-cpill").classList.toggle("has", !!$("#ig-min").value.trim()));
  $("#ig-min").addEventListener("keydown", e => { if (e.key === "Enter") {
    e.preventDefault();
    sendChat();
  } });
  $("#ig-snd").addEventListener("click", sendChat);
  /* ---------- profile ---------- */
  function renderProfile() {
    $("#ig-pf-user").textContent = IG_ME;
    $("#ig-me-name").textContent = IG_ME;
    $("#ig-pf").innerHTML = `<div class="ig-pf-top"><div class="ig-pf-av"><span class="ig-ring none">${igAv(IG_ME, 86)}</span><b class="plb">+</b></div>
    <div class="ig-pf-r"><h2>${esc(ACC[IG_ME].n)}</h2><div class="ig-stat"><div><b>0</b>posts</div><div><b>0</b>followers</div><div><b>0</b>following</div></div></div></div>
    <div class="ig-bio">${esc(IG_BIO)}</div>
    <div class="ig-btns"><button type="button">Edit profile</button><button type="button">Share profile</button><button type="button" class="sq">${ic("useradd")}</button></div>
    <div class="ig-tabs"><div class="on">${ic("grid")}</div><div>${ic("tag")}</div></div>
    <div class="ig-gr">${PROFILE_GRID.map(([k, h], i) => `<div style="${bgImg(k, h, IG_IMAGES.grid[i])}"></div>`).join("")}</div>`;
    $("#ig-nav-av").innerHTML = igAv(IG_ME, 30);
  }
  /* ---------- navigation ---------- */
  function show(v) {
    ["home", "dm", "profile"].forEach(n => $("#igv-" + n).classList.toggle("on", n === v));
    $$("#ig-nav button[data-v]").forEach(b => b.classList.toggle("on", b.dataset.v === v));
    if (v === "dm")
      renderDM();
  }
  $("#ig-nav").addEventListener("click", e => { const b = e.target.closest("button[data-v]"); if (b)
    show(b.dataset.v); });
  /* ---------- story viewer ---------- */
  const SV = { u: null, i: 0, el: 0, hold: false, focus: false, iv: null, down: null };
  const DUR = 5000;
  function openStory(u) {
    if (!SF[u])
      return;
    SV.u = u;
    $(".igs-reply").style.display = u === IG_ME ? "none" : "flex";
    SV.i = 0;
    SV.el = 0;
    SV.hold = SV.focus = false;
    $("#ig-story").classList.add("on");
    ap.classList.add("instory");
    phone.classList.remove("light");
    $("#igs-av").innerHTML = igAv(u, 34);
    $("#igs-un").textContent = u;
    $("#igs-like").classList.remove("on");
    $("#igs-in").value = "";
    frame();
    clearInterval(SV.iv);
    SV.iv = setInterval(tick, 50);
  }
  const FR = () => SF[SV.u] || [];
  function frame() {
    const f = FR()[SV.i];
    SV.el = 0;
    const cu = (IG_IMAGES.stories[SV.u] || [])[SV.i];
    $("#igs-card").style.backgroundImage = cu ? `url('${cu}')` : "none";
    $("#igs-bars").innerHTML = FR().map((_, i) => `<i><b style="width:${i < SV.i ? 100 : 0}%"></b></i>`).join("");
    $("#igs-layer").innerHTML = f.s.map(([c, t, st]) => `<div class="igs-st ${c}" style="${st}">${esc(t)}</div>`).join("");
  }
  function tick() {
    if (!ap.classList.contains("on")) {
      closeStory(false);
      return;
    }
    if (SV.hold || SV.focus)
      return;
    SV.el += 50;
    const b = $$("#igs-bars b")[SV.i];
    if (b)
      b.style.width = Math.min(100, SV.el / DUR * 100) + "%";
    if (SV.el >= DUR)
      nextF();
  }
  function nextF() { if (SV.i >= FR().length - 1) {
    closeStory(true);
    return;
  } SV.i++; frame(); }
  function prevF() { if (SV.i > 0)
    SV.i--; frame(); }
  function closeStory(markSeen) {
    clearInterval(SV.iv);
    SV.iv = null;
    $("#ig-story").classList.remove("on");
    ap.classList.remove("instory");
    if (ap.classList.contains("on"))
      phone.classList.add("light");
    if (markSeen && SV.u) {
      seenS[SV.u] = true;
      const r = $(`#igv-home [data-story="${SV.u}"] .ig-ring`);
      if (r)
        r.classList.add("seen");
    }
    SV.u = null;
  }
  $("#igs-x").addEventListener("click", e => { e.stopPropagation(); closeStory(true); });
  const card = $("#igs-card");
  card.addEventListener("pointerdown", e => { if (e.target.closest("button"))
    return; SV.hold = true; SV.down = { x: e.clientX, y: e.clientY, t: Date.now(), id: e.pointerId }; try {
    card.setPointerCapture(e.pointerId);
  }
  catch (_) { } });
  card.addEventListener("pointerup", e => {
    if (!SV.down)
      return;
    const d = SV.down;
    SV.down = null;
    SV.hold = false;
    const k = phone.getBoundingClientRect().height / 864 || 1, dy = (e.clientY - d.y) / k, dx = Math.abs(e.clientX - d.x) / k;
    if (dy > 90 && dy > dx) {
      closeStory(true);
      return;
    }
    if (Date.now() - d.t < 260 && dx < 12 && Math.abs(dy) < 12) {
      const r = card.getBoundingClientRect();
      (e.clientX - r.left) / r.width < .3 ? prevF() : nextF();
    }
  });
  card.addEventListener("pointercancel", () => { SV.down = null; SV.hold = false; });
  $("#igs-in").addEventListener("focus", () => SV.focus = true);
  $("#igs-in").addEventListener("blur", () => SV.focus = false);
  $("#igs-like").addEventListener("click", () => $("#igs-like").classList.toggle("on"));
  function toast(t) { const e = $("#igs-toast"); e.textContent = t; e.classList.add("on"); setTimeout(() => e.classList.remove("on"), 1400); }
  function sendReply() { const v = $("#igs-in").value.trim(); if (!v || !SV.u)
    return; addMsg(SV.u, { me: 1, x: v, t: Date.now(), story: 1 }); $("#igs-in").value = ""; $("#igs-in").blur(); toast("Sent"); renderDM(); }
  $("#igs-send").addEventListener("click", sendReply);
  $("#igs-in").addEventListener("keydown", e => { if (e.key === "Enter") {
    e.preventDefault();
    sendReply();
  } });
  /* ---------- mouse drag-scroll ---------- */
  function dragScroll(root) {
    let d = null, moved = false;
    root.addEventListener("pointerdown", e => { const el = e.target.closest(".ig-hs"); if (!el || e.pointerType !== "mouse" || e.button !== 0)
      return; d = { el, x: e.clientX, s: el.scrollLeft }; moved = false; });
    addEventListener("pointermove", e => { if (!d)
      return; const dx = e.clientX - d.x; if (Math.abs(dx) > 4) {
      moved = true;
      d.el.classList.add("drag");
    } if (moved)
      d.el.scrollLeft = d.s - dx / (phone.getBoundingClientRect().height / 864 || 1); });
    addEventListener("pointerup", () => { if (d) {
      d.el.classList.remove("drag");
      d = null;
    } });
    root.addEventListener("click", e => { if (moved) {
      e.stopPropagation();
      e.preventDefault();
      moved = false;
    } }, true);
  }
  dragScroll(ap);
  ap.addEventListener("scroll", () => { ap.scrollLeft = 0; ap.scrollTop = 0; });
  /* ---------- open / reset ---------- */
  openApp.ig = function () { closeStory(false); closeChat(); show("home"); renderHome(); renderDM(); renderProfile(); };
  renderHome();
  renderDM();
  renderProfile();
})(); 