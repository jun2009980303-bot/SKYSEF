// ============================================================
// 福萌芽 Admin.js — 後台核心邏輯
// ============================================================

let db, auth, storage, currentUser, currentFarmId;

// ============================================================
// 初始化
// ============================================================
function initAdmin() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.FUMENYA_FIREBASE_CONFIG);
    }
    db      = firebase.firestore();
    auth    = firebase.auth();
    storage = firebase.storage();
    window.FUMENYA_DB      = db;
    window.FUMENYA_AUTH    = auth;
    window.FUMENYA_STORAGE = storage;

    auth.onAuthStateChanged(async user => {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }
      currentUser = user;
      document.getElementById('userEmail').textContent = user.email;
      await loadOrCreateFarm(user);
      showSection('dashboard');
      loadDashboard();
    });
  } catch (e) {
    console.error('[福萌芽] Firebase 初始化失敗', e);
    showToast('Firebase 連線失敗：' + e.message, 'error');
  }
}

// ============================================================
// 農場資料 — 載入或建立
// ============================================================
async function loadOrCreateFarm(user) {
  try {
    const q = await db.collection('farms').where('uid', '==', user.uid).limit(1).get();
    if (!q.empty) {
      const doc = q.docs[0];
      currentFarmId = doc.id;
      const data = doc.data();
      fillFarmForm(data);
    } else {
      // 首次登入，自動建立農場文件
      const ref = await db.collection('farms').add({
        uid: user.uid,
        email: user.email,
        farmName: '',
        farmerName: '',
        location: '',
        phone: '',
        avatarUrl: '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      currentFarmId = ref.id;
    }
  } catch (e) {
    showToast('載入農場資料失敗：' + e.message, 'error');
  }
}

function fillFarmForm(data) {
  setVal('farmName',   data.farmName   || '');
  setVal('farmerName', data.farmerName || '');
  setVal('location',   data.location   || '');
  setVal('phone',      data.phone      || '');
  const badge = document.getElementById('farmBadge');
  if (badge && data.farmName) badge.textContent = data.farmName;
}

// ============================================================
// 儀表板
// ============================================================
async function loadDashboard() {
  try {
    const [batches, logs, chars] = await Promise.all([
      db.collection('batches').where('farmId','==',currentFarmId).get(),
      db.collection('farmLogs').where('farmId','==',currentFarmId).get(),
      db.collection('gachaCharacters').get()
    ]);
    setInner('statBatches', batches.size);
    setInner('statLogs',    logs.size);
    setInner('statChars',   chars.size);

    // 今日日誌
    const today = new Date(); today.setHours(0,0,0,0);
    const todayCount = logs.docs.filter(d => {
      const ts = d.data().createdAt;
      return ts && ts.toDate && ts.toDate() >= today;
    }).length;
    setInner('statToday', todayCount);
  } catch(e) {
    console.warn('loadDashboard error', e);
  }
}

// ============================================================
// 導覽切換
// ============================================================
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById('sec-' + id);
  const nav = document.querySelector(`.nav-item[data-sec="${id}"]`);
  if (sec) sec.classList.add('active');
  if (nav) nav.classList.add('active');

  // 各頁面載入
  if (id === 'dashboard')  loadDashboard();
  if (id === 'batches')    loadBatches();
  if (id === 'logs')       { loadBatchSelector(); loadLogs(); }
  if (id === 'gacha')      loadGachaChars();
  if (id === 'wiki')       loadWiki();

  // 行動版關閉側欄
  document.getElementById('sidebar').classList.remove('open');
}

// ============================================================
// 農場設定 CRUD
// ============================================================
async function saveFarmSettings() {
  if (!currentFarmId) return;
  const btn = document.getElementById('btnSaveFarm');
  btn.disabled = true; btn.textContent = '儲存中...';
  try {
    await db.collection('farms').doc(currentFarmId).update({
      farmName:   getVal('farmName'),
      farmerName: getVal('farmerName'),
      location:   getVal('location'),
      phone:      getVal('phone'),
      updatedAt:  firebase.firestore.FieldValue.serverTimestamp()
    });
    const badge = document.getElementById('farmBadge');
    if (badge) badge.textContent = getVal('farmName');
    showToast('農場資料已更新 ✅');
  } catch(e) {
    showToast('儲存失敗：' + e.message, 'error');
  }
  btn.disabled = false; btn.textContent = '💾 儲存設定';
}

// ============================================================
// 批次管理 CRUD
// ============================================================
async function loadBatches() {
  const list = document.getElementById('batchList');
  list.innerHTML = '<p class="loading-text">載入中...</p>';
  try {
    const snap = await db.collection('batches')
      .where('farmId','==',currentFarmId)
      .orderBy('createdAt','desc').get();
    if (snap.empty) { list.innerHTML = '<p class="empty-text">尚無批次，請點擊「新增批次」。</p>'; return; }
    list.innerHTML = snap.docs.map(doc => {
      const d = doc.data();
      const statusMap = { growing:'🌱 生長中', harvested:'🌾 已收成', sold:'🛒 已售出' };
      return `
      <div class="card-item">
        <div class="card-info">
          <div class="card-title">${d.cropType || '未命名作物'} <span class="badge">${d.batchCode || ''}</span></div>
          <div class="card-meta">${statusMap[d.status] || d.status} | 種植：${fmtDate(d.plantDate)}</div>
        </div>
        <div class="card-actions">
          <button class="btn-sm btn-edit" onclick="openBatchModal('${doc.id}')">編輯</button>
          <button class="btn-sm btn-qr"   onclick="showBatchQR('${doc.id}','${d.cropType||''}','${d.batchCode||''}')">QR</button>
          <button class="btn-sm btn-del"  onclick="deleteBatch('${doc.id}')">刪除</button>
        </div>
      </div>`;
    }).join('');
  } catch(e) { list.innerHTML = `<p class="error-text">載入失敗：${e.message}</p>`; }
}

function openBatchModal(docId) {
  const m = document.getElementById('batchModal');
  m.dataset.docId = docId || '';
  setVal('bBatchCode',''); setVal('bCropType',''); setVal('bStatus','growing');
  setVal('bPlantDate',''); setVal('bHarvestDate','');
  document.getElementById('batchModalTitle').textContent = docId ? '編輯批次' : '新增批次';
  if (docId) {
    db.collection('batches').doc(docId).get().then(doc => {
      const d = doc.data();
      setVal('bCropType',    d.cropType    || '');
      setVal('bBatchCode',   d.batchCode   || '');
      setVal('bStatus',      d.status      || 'growing');
      setVal('bPlantDate',   fmtDateInput(d.plantDate));
      setVal('bHarvestDate', fmtDateInput(d.harvestDate));
    });
  }
  m.classList.add('show');
}

async function saveBatch() {
  const m = document.getElementById('batchModal');
  const docId = m.dataset.docId;
  const data = {
    farmId:      currentFarmId,
    cropType:    getVal('bCropType'),
    batchCode:   getVal('bBatchCode'),
    status:      getVal('bStatus'),
    plantDate:   dateToTimestamp(getVal('bPlantDate')),
    harvestDate: dateToTimestamp(getVal('bHarvestDate')),
    updatedAt:   firebase.firestore.FieldValue.serverTimestamp()
  };
  try {
    if (docId) {
      await db.collection('batches').doc(docId).update(data);
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('batches').add(data);
    }
    closeModal('batchModal');
    loadBatches();
    showToast('批次已儲存 ✅');
  } catch(e) { showToast('儲存失敗：' + e.message, 'error'); }
}

async function deleteBatch(docId) {
  if (!confirm('確定刪除此批次？（相關日誌不會被刪除）')) return;
  try {
    await db.collection('batches').doc(docId).delete();
    loadBatches();
    showToast('批次已刪除');
  } catch(e) { showToast('刪除失敗：' + e.message, 'error'); }
}

async function showBatchQR(batchId, cropType, batchCode) {
  const baseUrl = window.location.origin + window.location.pathname.replace('admin.html','');
  const url = `${baseUrl}index.html?farmId=${currentFarmId}&batchId=${batchId}`;
  document.getElementById('qrUrl').textContent = url;
  document.getElementById('qrCanvas').innerHTML = '';
  document.getElementById('qrTitle').textContent = `${cropType} #${batchCode}`;
  document.getElementById('qrModal').classList.add('show');
  if (typeof QRCode !== 'undefined') {
    new QRCode(document.getElementById('qrCanvas'), {
      text: url, width: 200, height: 200,
      colorDark: '#1a3a2a', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

function downloadQR() {
  const canvas = document.querySelector('#qrCanvas canvas');
  if (!canvas) return;
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'skyser-qr.png';
  a.click();
}

// ============================================================
// 農事日誌 CRUD
// ============================================================
let logFilterBatchId = '';

async function loadBatchSelector() {
  const sel = document.getElementById('logBatchFilter');
  if (!sel) return;
  sel.innerHTML = '<option value="">全部批次</option>';
  const snap = await db.collection('batches').where('farmId','==',currentFarmId).get();
  snap.docs.forEach(doc => {
    const d = doc.data();
    sel.innerHTML += `<option value="${doc.id}">${d.cropType} #${d.batchCode}</option>`;
  });
}

async function loadLogs() {
  const list = document.getElementById('logList');
  list.innerHTML = '<p class="loading-text">載入中...</p>';
  try {
    let q = db.collection('farmLogs').where('farmId','==',currentFarmId).orderBy('logDate','desc');
    if (logFilterBatchId) q = q.where('batchId','==', logFilterBatchId);
    const snap = await q.limit(50).get();
    if (snap.empty) { list.innerHTML = '<p class="empty-text">尚無日誌紀錄。</p>'; return; }
    list.innerHTML = snap.docs.map(doc => {
      const d = doc.data();
      return `
      <div class="card-item log-card">
        <div class="card-info">
          <div class="card-title">📅 ${fmtDate(d.logDate)} <span class="badge">${d.weatherCondition||''}</span></div>
          <div class="card-meta">🌡️ ${d.airTemp||'--'}°C  💧 ${d.airHumidity||'--'}%  🧪 pH ${d.soilPH||'--'}</div>
          <div class="card-note">${d.note||''}</div>
        </div>
        <div class="card-actions">
          <button class="btn-sm btn-edit" onclick="openLogModal('${doc.id}')">編輯</button>
          <button class="btn-sm btn-del"  onclick="deleteLog('${doc.id}')">刪除</button>
        </div>
      </div>`;
    }).join('');
  } catch(e) { list.innerHTML = `<p class="error-text">載入失敗：${e.message}</p>`; }
}

async function openLogModal(docId) {
  const m = document.getElementById('logModal');
  m.dataset.docId = docId || '';
  document.getElementById('logModalTitle').textContent = docId ? '編輯日誌' : '新增日誌';
  // Reset
  ['lBatchId','lLogDate','lAirTemp','lAirHumidity','lSoilPH','lSoilMoisture',
   'lPesticide','lFertilizer','lWeather','lNote'].forEach(id => setVal(id,''));
  // Load batch options
  const bSel = document.getElementById('lBatchId');
  bSel.innerHTML = '<option value="">選擇批次</option>';
  const snap = await db.collection('batches').where('farmId','==',currentFarmId).get();
  snap.docs.forEach(doc => {
    const d = doc.data();
    bSel.innerHTML += `<option value="${doc.id}">${d.cropType} #${d.batchCode}</option>`;
  });

  if (docId) {
    const doc = await db.collection('farmLogs').doc(docId).get();
    const d = doc.data();
    setVal('lBatchId',      d.batchId      || '');
    setVal('lLogDate',      fmtDateInput(d.logDate));
    setVal('lAirTemp',      d.airTemp      || '');
    setVal('lAirHumidity',  d.airHumidity  || '');
    setVal('lSoilPH',       d.soilPH       || '');
    setVal('lSoilMoisture', d.soilMoisture || '');
    setVal('lPesticide',    d.pesticide    || '');
    setVal('lFertilizer',   d.fertilizer   || '');
    setVal('lWeather',      d.weatherCondition || '');
    setVal('lNote',         d.note         || '');
  }
  m.classList.add('show');
}

async function saveLog() {
  const m = document.getElementById('logModal');
  const docId = m.dataset.docId;
  const data = {
    farmId:           currentFarmId,
    batchId:          getVal('lBatchId'),
    logDate:          dateToTimestamp(getVal('lLogDate')) || firebase.firestore.FieldValue.serverTimestamp(),
    airTemp:          parseFloatSafe(getVal('lAirTemp')),
    airHumidity:      parseFloatSafe(getVal('lAirHumidity')),
    soilPH:           parseFloatSafe(getVal('lSoilPH')),
    soilMoisture:     parseFloatSafe(getVal('lSoilMoisture')),
    pesticide:        getVal('lPesticide'),
    fertilizer:       getVal('lFertilizer'),
    weatherCondition: getVal('lWeather'),
    note:             getVal('lNote'),
    updatedAt:        firebase.firestore.FieldValue.serverTimestamp()
  };
  try {
    if (docId) {
      await db.collection('farmLogs').doc(docId).update(data);
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('farmLogs').add(data);
    }
    closeModal('logModal');
    loadLogs();
    showToast('日誌已儲存 ✅');
  } catch(e) { showToast('儲存失敗：' + e.message, 'error'); }
}

async function deleteLog(docId) {
  if (!confirm('確定刪除此日誌？')) return;
  try {
    await db.collection('farmLogs').doc(docId).delete();
    loadLogs();
    showToast('日誌已刪除');
  } catch(e) { showToast('刪除失敗：' + e.message, 'error'); }
}

// ============================================================
// 扭蛋角色管理
// ============================================================
async function loadGachaChars() {
  const list = document.getElementById('gachaList');
  list.innerHTML = '<p class="loading-text">載入中...</p>';
  try {
    const snap = await db.collection('gachaCharacters').orderBy('rarity').get();
    if (snap.empty) { list.innerHTML = '<p class="empty-text">尚無角色，請新增。</p>'; return; }
    const rarityMap = { common:'⚪ 普通', rare:'🔵 稀有', epic:'🟣 史詩', legendary:'🟡 傳說' };
    list.innerHTML = snap.docs.map(doc => {
      const d = doc.data();
      const activeClass = d.isActive ? 'badge-green' : 'badge-grey';
      return `
      <div class="card-item">
        <div class="card-emoji">${d.emoji||'🌱'}</div>
        <div class="card-info">
          <div class="card-title">${d.name} <span class="badge ${activeClass}">${rarityMap[d.rarity]||d.rarity}</span></div>
          <div class="card-meta">${d.description||''}</div>
        </div>
        <div class="card-actions">
          <button class="btn-sm btn-edit" onclick="openGachaModal('${doc.id}')">編輯</button>
          <button class="btn-sm ${d.isActive?'btn-warn':'btn-ok'}" onclick="toggleGacha('${doc.id}',${d.isActive})">
            ${d.isActive?'下架':'上架'}
          </button>
          <button class="btn-sm btn-del" onclick="deleteGachaChar('${doc.id}')">刪除</button>
        </div>
      </div>`;
    }).join('');
  } catch(e) { list.innerHTML = `<p class="error-text">載入失敗：${e.message}</p>`; }
}

function openGachaModal(docId) {
  const m = document.getElementById('gachaModal');
  m.dataset.docId = docId || '';
  document.getElementById('gachaModalTitle').textContent = docId ? '編輯角色' : '新增角色';
  ['gName','gEmoji','gRarity','gDesc'].forEach(id => setVal(id,''));
  setVal('gRarity','common');
  if (docId) {
    db.collection('gachaCharacters').doc(docId).get().then(doc => {
      const d = doc.data();
      setVal('gName',  d.name        || '');
      setVal('gEmoji', d.emoji       || '');
      setVal('gRarity',d.rarity      || 'common');
      setVal('gDesc',  d.description || '');
    });
  }
  m.classList.add('show');
}

async function saveGachaChar() {
  const m = document.getElementById('gachaModal');
  const docId = m.dataset.docId;
  const data = {
    name:        getVal('gName'),
    emoji:       getVal('gEmoji'),
    rarity:      getVal('gRarity'),
    description: getVal('gDesc'),
    isActive:    true
  };
  if (!data.name) { showToast('請輸入角色名稱', 'error'); return; }
  try {
    if (docId) {
      await db.collection('gachaCharacters').doc(docId).update(data);
    } else {
      await db.collection('gachaCharacters').add(data);
    }
    closeModal('gachaModal');
    loadGachaChars();
    showToast('角色已儲存 ✅');
  } catch(e) { showToast('儲存失敗：' + e.message, 'error'); }
}

async function toggleGacha(docId, currentActive) {
  try {
    await db.collection('gachaCharacters').doc(docId).update({ isActive: !currentActive });
    loadGachaChars();
  } catch(e) { showToast('操作失敗', 'error'); }
}

async function deleteGachaChar(docId) {
  if (!confirm('確定刪除此角色？')) return;
  try {
    await db.collection('gachaCharacters').doc(docId).delete();
    loadGachaChars();
    showToast('角色已刪除');
  } catch(e) { showToast('刪除失敗：' + e.message, 'error'); }
}

// ============================================================
// Wiki 知識庫
// ============================================================
async function loadWiki() {
  const list = document.getElementById('wikiList');
  list.innerHTML = '<p class="loading-text">載入中...</p>';
  try {
    const snap = await db.collection('wikiItems').get();
    if (snap.empty) { list.innerHTML = '<p class="empty-text">尚無知識庫條目。</p>'; return; }
    list.innerHTML = snap.docs.map(doc => {
      const d = doc.data();
      const activeClass = d.isActive ? 'badge-green' : 'badge-grey';
      return `
      <div class="card-item">
        <div class="card-info">
          <div class="card-title">${d.cropName} <span class="badge ${activeClass}">${d.isActive?'顯示中':'已停用'}</span></div>
          <div class="card-note">${d.summary||''}</div>
        </div>
        <div class="card-actions">
          <button class="btn-sm btn-edit" onclick="openWikiModal('${doc.id}')">編輯</button>
          <button class="btn-sm ${d.isActive?'btn-warn':'btn-ok'}" onclick="toggleWiki('${doc.id}',${d.isActive})">
            ${d.isActive?'停用':'啟用'}
          </button>
          <button class="btn-sm btn-del" onclick="deleteWiki('${doc.id}')">刪除</button>
        </div>
      </div>`;
    }).join('');
  } catch(e) { list.innerHTML = `<p class="error-text">載入失敗：${e.message}</p>`; }
}

function openWikiModal(docId) {
  const m = document.getElementById('wikiModal');
  m.dataset.docId = docId || '';
  document.getElementById('wikiModalTitle').textContent = docId ? '編輯知識條目' : '新增知識條目';
  ['wCropName','wSummary','wTips','wNutrition'].forEach(id => setVal(id,''));
  if (docId) {
    db.collection('wikiItems').doc(docId).get().then(doc => {
      const d = doc.data();
      setVal('wCropName',   d.cropName      || '');
      setVal('wSummary',    d.summary       || '');
      setVal('wTips',       d.tips          || '');
      setVal('wNutrition',  d.nutritionFacts|| '');
    });
  }
  m.classList.add('show');
}

async function saveWiki() {
  const m = document.getElementById('wikiModal');
  const docId = m.dataset.docId;
  const data = {
    cropName:       getVal('wCropName'),
    summary:        getVal('wSummary'),
    tips:           getVal('wTips'),
    nutritionFacts: getVal('wNutrition'),
    isActive:       true
  };
  if (!data.cropName) { showToast('請輸入作物名稱', 'error'); return; }
  try {
    if (docId) {
      await db.collection('wikiItems').doc(docId).update(data);
    } else {
      await db.collection('wikiItems').add(data);
    }
    closeModal('wikiModal');
    loadWiki();
    showToast('知識條目已儲存 ✅');
  } catch(e) { showToast('儲存失敗：' + e.message, 'error'); }
}

async function toggleWiki(docId, current) {
  try {
    await db.collection('wikiItems').doc(docId).update({ isActive: !current });
    loadWiki();
  } catch(e) { showToast('操作失敗', 'error'); }
}

async function deleteWiki(docId) {
  if (!confirm('確定刪除此條目？')) return;
  try {
    await db.collection('wikiItems').doc(docId).delete();
    loadWiki();
    showToast('條目已刪除');
  } catch(e) { showToast('刪除失敗：' + e.message, 'error'); }
}

// ============================================================
// 登出
// ============================================================
async function logout() {
  if (!confirm('確定要登出？')) return;
  await auth.signOut();
  window.location.href = 'login.html';
}

// ============================================================
// Modal 控制
// ============================================================
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// ============================================================
// 工具函式
// ============================================================
function getVal(id)        { const el = document.getElementById(id); return el ? el.value : ''; }
function setVal(id, v)     { const el = document.getElementById(id); if (el) el.value = v; }
function setInner(id, v)   { const el = document.getElementById(id); if (el) el.textContent = v; }
function parseFloatSafe(v) { const n = parseFloat(v); return isNaN(n) ? null : n; }

function dateToTimestamp(str) {
  if (!str) return null;
  return firebase.firestore.Timestamp.fromDate(new Date(str));
}

function fmtDate(ts) {
  if (!ts) return '--';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('zh-TW');
}

function fmtDateInput(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toISOString().split('T')[0];
}

let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ============================================================
// 啟動
// ============================================================
document.addEventListener('DOMContentLoaded', initAdmin);
