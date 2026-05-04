
const consumerWikiDB = {
"筊白筍": "埔里名產「美人腿」！含有豐富纖維質與維生素，熱量低，是健康料理的絕佳選擇。",
"百香果": "埔里大坪頂特產！果汁被譽為「果汁之王」，富含維他命C，表皮變皺時甜度最高。",
"青江菜": "又稱湯匙菜。含有豐富的鈣質與維生素A，消費者烹調時建議快炒以保留清脆口感。",
"番茄": "富含滿滿的茄紅素。選購時應挑選果實飽滿、色澤均勻且蒂頭翠綠者。",
"玉米": "含有豐富葉黃素與玉米黃素，對眼睛保健極佳。購買後建議盡快食用以保甜度。",
"九層塔": "強大的天然抗氧化食材。買回家後建議不要冷藏，插在常溫水瓶中可延長保鮮期。",
"敏豆": "也就是四季豆。含有豐富的維生素 B 群，烹調前務必完全煮熟。",
"苦瓜": "能退火、降血糖。表皮顆粒越粗、縫隙越寬的苦瓜，通常苦味會比較淡。",
"地瓜葉": "平民蔬菜之王！不需過多農藥，含有大量葉綠素與鐵質，是天然補血食材。"
};

let logs = JSON.parse(localStorage.getItem('puli_dynamic_resume')) || [];
let farmProfile = JSON.parse(localStorage.getItem('puli_farm_profile')) || { location: '南投埔里', farmer: '謝易均' };
let lineChart;
let editingIndex = -1; // 追蹤目前正在修改哪一筆資料 (-1 代表新增模式)
const characterPool = []; // 未來會加入約 50 個角色名稱
let isGachaSpinning = false;

function drawLotteryCharacter() {
  const result = document.getElementById('lotteryResult');
  const button = document.getElementById('gachaButton');
  const ball = document.getElementById('gachaBall');

  if (characterPool.length === 0) {
    result.innerText = "目前尚未有角色可抽，後續將新增約 50 個角色。";
    ball.innerText = "?";
    return;
  }
  if (isGachaSpinning) return;

  isGachaSpinning = true;
  button.disabled = true;
  button.innerText = '轉動中...';
  result.innerText = '扭蛋機正在轉動，請稍後...';
  ball.classList.add('spin');

  setTimeout(() => {
    ball.classList.remove('spin');
    const randomName = characterPool[Math.floor(Math.random() * characterPool.length)];
    ball.innerText = randomName.charAt(0);
    result.innerText = `恭喜你抽中：${randomName}！`;
    button.disabled = false;
    button.innerText = '再轉一次';
    isGachaSpinning = false;
  }, 1800);
}

function initProfile() {
document.getElementById('settingLocation').value = farmProfile.location;
document.getElementById('settingFarmer').value = farmProfile.farmer;
updateProfileDisplay();
renderFarmerLogs();
document.getElementById('farmerQrCode').innerHTML = '<span>此處顯示消費者掃描用 QR Code<br>可在後續補入實際 QR 圖片或生成程式。</span>';
}

function saveProfile() {
farmProfile.location = document.getElementById('settingLocation').value || '未設定產地';
farmProfile.farmer = document.getElementById('settingFarmer').value || '匿名農夫';
localStorage.setItem('puli_farm_profile', JSON.stringify(farmProfile));
updateProfileDisplay();
alert("農場基本資訊已更新成功！");
}

function updateProfileDisplay() {
document.getElementById('farmerBadgeDisplay').innerText = `👨‍🌾 ${farmProfile.farmer} (${farmProfile.location})`;
document.getElementById('displayLocation').innerText = farmProfile.location;
document.getElementById('displayFarmer').innerText = farmProfile.farmer;
}

function switchView(viewId) {
document.querySelectorAll('.view-screen').forEach(v => v.classList.remove('active'));
document.getElementById(viewId).classList.add('active');

if(viewId === 'viewConsumer') {
initChart();
renderResume();
generateRandomWiki();
}
}

function generateRandomWiki() {
const keys = Object.keys(consumerWikiDB);
const randomKey = keys[Math.floor(Math.random() * keys.length)];
document.getElementById('wikiTitle').innerText = randomKey;
document.getElementById('wikiText').innerText = consumerWikiDB[randomKey];
}

// --- 進入修改模式 ---
function editLog(index) {
editingIndex = index;
const log = logs[index];

// 把資料倒回輸入框
document.getElementById('pType').value = log.type;
document.getElementById('pName').value = log.name;
document.getElementById('temp').value = log.temp;
document.getElementById('hum').value = log.hum;
document.getElementById('ph').value = log.ph !== "--" ? log.ph : "";
document.getElementById('note').value = log.note;

// 改變按鈕樣式與文字，提醒農夫現在在「修改中」
document.getElementById('inputTitle').innerText = "✏️ 修改觀測日誌";
document.getElementById('btnSave').innerText = "💾 儲存修改並更新履歷";
document.getElementById('btnSave').style.backgroundColor = "var(--accent-orange)";
document.getElementById('btnCancel').style.display = "block";

// 自動捲動到最上面方便修改
document.getElementById('viewFarmer').scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 取消修改 ---
function cancelEdit() {
editingIndex = -1;
clearForm();
resetFormUI();
}

// --- 儲存或更新數據 ---
function saveData() {
const typeVal = document.getElementById('pType').value || "農場作物";
const newLog = {
date: editingIndex > -1 ? logs[editingIndex].date : new Date().toLocaleString('zh-TW', {month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'}),
type: typeVal,
name: document.getElementById('pName').value || "當季批次",
temp: parseFloat(document.getElementById('temp').value) || 0,
hum: parseFloat(document.getElementById('hum').value) || 0,
ph: document.getElementById('ph').value || "--",
note: document.getElementById('note').value || "例行性巡視，生長狀況良好。"
};

if (editingIndex > -1) {
// 修改舊資料
logs[editingIndex] = newLog;
editingIndex = -1; // 退出修改模式
alert("該筆紀錄已成功修正！");
} else {
// 新增資料
logs.unshift(newLog);
alert("紀錄已成功發佈！掃描 QR Code 即可看到最新履歷。");
}

localStorage.setItem('puli_dynamic_resume', JSON.stringify(logs));
clearForm();
resetFormUI();
renderFarmerLogs();
}

function clearForm() {
document.getElementById('temp').value = '';
document.getElementById('hum').value = '';
document.getElementById('ph').value = '';
document.getElementById('note').value = '';
}

function resetFormUI() {
document.getElementById('inputTitle').innerText = "📝 新增今日觀測日誌";
document.getElementById('btnSave').innerText = "💾 儲存並發布至生產履歷";
document.getElementById('btnSave').style.backgroundColor = "var(--accent-green)";
document.getElementById('btnCancel').style.display = "none";
}

// --- 刪除紀錄 ---
function deleteLog(index) {
if(confirm("確定要刪除這筆紀錄嗎？此動作無法復原。")) {
if(editingIndex === index) cancelEdit(); // 如果正在編輯這筆，強制退出編輯模式
logs.splice(index, 1);
localStorage.setItem('puli_dynamic_resume', JSON.stringify(logs));
renderFarmerLogs();
}
}

function renderFarmerLogs() {
const list = document.getElementById('farmerLogList');
if(logs.length === 0) {
list.innerHTML = "<p style='text-align:center; color:#999; font-size:13px;'>目前尚無紀錄，請在上方新增。</p>";
return;
}
list.innerHTML = logs.map((l, index) => `
<div class="farmer-log-item">
<div>
<div style="font-weight:900; color:var(--text-green); font-size:13px;">${l.date}</div>
<div style="font-size:12px; color:#666;">${l.type} (#${l.name}) - 🌡️${l.temp}°C / 💧${l.hum}%</div>
</div>
<div>
<button class="btn-edit" onclick="editLog(${index})">修改</button>
<button class="btn-delete" onclick="deleteLog(${index})">刪除</button>
</div>
</div>
`).join('');
}

function renderResume() {
const list = document.getElementById('resumeList');
if(logs.length === 0) {
list.innerHTML = "<p style='text-align:center; color:#999;'>目前尚未有種植紀錄上鏈。</p>";
return;
}
list.innerHTML = logs.map(l => `
<div class="log-item">
<div style="font-weight:900; font-size:14px; margin-bottom:8px; color:var(--text-green);">
⏰ ${l.date} <span style="float:right; color:var(--accent-green);">#${l.type}</span>
</div>
<div style="margin-bottom:8px;">
<span class="log-tag">🌡️ ${l.temp}°C</span>
<span class="log-tag">💧 濕度 ${l.hum}%</span>
<span class="log-tag">🧪 pH ${l.ph}</span>
</div>
<div style="font-size:13px; color:#555; background:#f9f9f9; padding:10px; border-radius:10px;">
<b>🌱 農事筆記：</b>${l.note}
</div>
</div>
`).join('');
}

function initChart() {
if(lineChart) lineChart.destroy();
const ctx = document.getElementById('lineChart').getContext('2d');
const chartData = logs.slice(0, 6).reverse();

lineChart = new Chart(ctx, {
type: 'line',
data: {
labels: chartData.map(l => l.date.split(' ')[0]),
datasets: [
{ label: '溫度', data: chartData.map(l => l.temp), borderColor: '#ff9800', tension: 0.3 },
{ label: '濕度', data: chartData.map(l => l.hum), borderColor: '#03a9f4', tension: 0.3 }
]
},
options: { responsive: true, maintainAspectRatio: false }
});
}

window.onload = initProfile;
