# 智慧農場：透明動態履歷與智慧編輯系統 (SKYSER)

![Status](https://img.shields.io/badge/Status-In_Development-yellow)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20JS%20%7C%20CSS-blue)
![Backend](https://img.shields.io/badge/Backend-Firebase-orange)
![Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages-lightgrey)

## 📖 專案簡介

「智慧農場 - 動態履歷與編輯系統」是一個專為在地小農設計的智慧化管理工具。透過簡潔直覺的介面，農夫可以即時記錄作物生長數據與農事筆記；消費者則能透過掃描 QR Code，即時查閱該批次作物的「數位身分證」，建立起生產者與消費者之間的信任橋樑。

本系統不僅提供透明的生產資訊，更整合了圖表視覺化監測與趣味性的扭蛋抽獎機制，提升消費者的互動體驗。

---

## 🏗️ 系統架構

本專案採用 **Serverless（無伺服器）** 架構，確保部署簡便且具備良好擴展性：

```
[農夫後台 admin.html]  ←→  [Firebase Auth]     ← 身份驗證
        ↓                  [Cloud Firestore]    ← 資料儲存
[消費者履歷 index.html] ←→  [Firebase Storage]  ← 照片存檔
        ↓
[QR Code 產生器] → 消費者掃描 → 唯讀履歷頁
```

### 資料流邏輯

1. **農夫登入**：透過 Firebase Auth 驗證身份，進入後台。
2. **數據輸入**：農夫在後台填寫環境數據（溫濕度、pH）與農事筆記。
3. **即時同步**：數據寫入 Firestore，消費者端即時反映最新狀態。
4. **視覺化呈現**：前端使用 Chart.js 繪製折線趨勢圖。
5. **QR Code 追蹤**：每個批次生成專屬連結，消費者掃描後進入唯讀頁面。

---

## 📁 檔案結構

```
SKYSER/
├── index.html              # 消費者端（唯讀透明履歷）
├── login.html              # 農夫登入頁 ✅ 已建立
├── admin.html              # 農夫後台主介面（開發中）
├── js/
│   ├── firebase-config.js  # Firebase 設定與初始化 ✅ 已建立
│   ├── admin.js            # 後台核心邏輯（開發中）
│   ├── consumer.js         # 消費者端邏輯
│   └── gacha.js            # 扭蛋抽獎邏輯
├── css/
│   ├── admin.css           # 後台深色主題樣式 ✅ 已建立
│   ├── login.css           # 登入頁樣式 ✅ 已建立
│   └── consumer.css        # 消費者端樣式
├── tmp_script.js           # 暫存（待整合後刪除）
├── tmp_gacha_script.js     # 暫存（待整合後刪除）
└── README.md
```

---

## 🗄️ Firestore 資料庫 Schema

### Collection 架構

#### `farms/` — 農場資訊
| 欄位 | 型別 | 說明 |
|------|------|------|
| `farmId` | string | 文件 ID（自動產生） |
| `farmName` | string | 農場名稱 |
| `farmerName` | string | 農夫姓名 |
| `location` | string | 產地地點 |
| `phone` | string | 聯絡電話 |
| `email` | string | 農夫 Email（對應 Auth UID）|
| `avatarUrl` | string | 農夫/農場封面照（Storage URL）|
| `uid` | string | Firebase Auth UID |
| `createdAt` | timestamp | 建立時間 |
| `updatedAt` | timestamp | 最後更新時間 |

#### `batches/` — 作物批次
| 欄位 | 型別 | 說明 |
|------|------|------|
| `batchId` | string | 文件 ID |
| `farmId` | string | 所屬農場（關聯 farms）|
| `cropType` | string | 作物種類（筊白筍、百香果…）|
| `batchCode` | string | 批次編號（如 2026-A）|
| `status` | string | `growing` / `harvested` / `sold` |
| `plantDate` | timestamp | 種植日期 |
| `harvestDate` | timestamp | 預計收成日 |
| `coverPhotoUrl` | string | 批次封面照 |
| `qrCodeUrl` | string | QR Code 圖片（Storage URL）|
| `createdAt` | timestamp | 建立時間 |
| `updatedAt` | timestamp | 更新時間 |

#### `farmLogs/` — 農事日誌
| 欄位 | 型別 | 說明 |
|------|------|------|
| `logId` | string | 文件 ID |
| `farmId` | string | 所屬農場 |
| `batchId` | string | 所屬批次 |
| `logDate` | timestamp | 記錄日期時間 |
| `airTemp` | number | 空氣溫度 (°C) |
| `airHumidity` | number | 空氣濕度 (%) |
| `soilPH` | number | 土壤 pH 值 |
| `soilMoisture` | number | 土壤含水量 (%) |
| `pesticide` | string | 農藥使用（無 / 有機 / 化學）|
| `fertilizer` | string | 施肥紀錄 |
| `weatherCondition` | string | 天氣狀況（晴 / 陰 / 雨）|
| `note` | string | 農事筆記 |
| `photoUrls` | array\<string\> | 照片清單（Storage URLs）|
| `createdAt` | timestamp | 建立時間 |
| `updatedAt` | timestamp | 更新時間 |

#### `gachaCharacters/` — 扭蛋角色庫
| 欄位 | 型別 | 說明 |
|------|------|------|
| `name` | string | 角色名稱 |
| `emoji` | string | 角色表情符號 |
| `rarity` | string | `common` / `rare` / `epic` / `legendary` |
| `description` | string | 角色背景故事 |
| `imageUrl` | string | 角色圖片 URL |
| `isActive` | boolean | 是否在抽獎池中 |

#### `gachaRecords/` — 抽獎紀錄
| 欄位 | 型別 | 說明 |
|------|------|------|
| `farmId` | string | 所屬農場 |
| `characterId` | string | 抽中角色 ID |
| `characterName` | string | 角色名稱（冗餘存，避免跨查詢）|
| `rarity` | string | 稀有度 |
| `drawnAt` | timestamp | 抽取時間 |
| `consumerId` | string | 消費者識別碼（可匿名）|

#### `wikiItems/` — 農產品知識庫
| 欄位 | 型別 | 說明 |
|------|------|------|
| `cropName` | string | 作物名稱 |
| `summary` | string | 消費者簡介 |
| `tips` | string | 選購 / 保存小技巧 |
| `nutritionFacts` | string | 營養成分說明 |
| `imageUrl` | string | 圖片 URL |
| `isActive` | boolean | 是否顯示 |

---

## 🛠️ 功能頁面說明

### A. 登入頁 (`login.html`)
- Firebase Auth Email / Password 登入。
- 內建開發模式（Firebase 未設定時）：測試帳號 `demo@skyser.farm` / `demo1234`。
- 登入成功後自動跳轉至 `admin.html`。

### B. 農夫管理後台 (`admin.html`)
- **儀表板**：統計卡片（批次數、日誌數、照片數、扭蛋角色數）。
- **農場設定**：農場名稱、地點、農夫資訊、封面照片上傳。
- **批次管理**：新增 / 編輯 / 停用批次，QR Code 一鍵生成。
- **農事日誌 CRUD**：完整欄位、多張照片上傳、按批次篩選。
- **扭蛋角色管理**：後台上傳角色、設定稀有度與啟用狀態。
- **Wiki 知識庫管理**：新增 / 編輯農產品知識條目。
- **登出**：清除 Auth 狀態並跳回登入頁。

### C. 消費者透明履歷 (`index.html`)
- 透過 QR Code URL 帶入 `farmId` 與 `batchId` 參數，顯示對應農場資訊。
- 折線圖展示最近 6 筆環境監測數據。
- 時間軸農事歷程，附帶農事筆記與環境標籤。
- 隨機推播農產品 Wiki 小知識。
- 響應式設計（RWD），適配行動裝置。

---

## 🚀 技術棧

| 類別 | 技術 / 工具 | 用途 |
|:-----|:-----------|:-----|
| 前端 | Vanilla JavaScript | 核心邏輯 |
| 樣式 | CSS3 + 自定義設計系統 | UI / UX |
| 字型 | Inter + Noto Sans TC（Google Fonts）| 多語排版 |
| 圖表 | Chart.js (CDN) | 環境數據趨勢圖 |
| QR 碼 | QRCode.js (CDN) | 批次連結生成 |
| 驗證 | Firebase Authentication | 農夫身份驗證 |
| 資料庫 | Cloud Firestore | 農場 / 批次 / 日誌儲存 |
| 檔案 | Firebase Storage | 作物照片代管 |
| 部署 | GitHub Pages | 前端靜態託管 |

---

## ⚙️ 部署與設定指南

### 1. Firebase 設定

1. 前往 [Firebase Console](https://console.firebase.google.com/) 建立專案。
2. 啟用 **Authentication** → 電子郵件 / 密碼登入方式。
3. 啟用 **Cloud Firestore**，選擇「正式模式」，稍後設定安全規則。
4. 啟用 **Firebase Storage**。
5. 取得 Web 應用程式設定，更新 `js/firebase-config.js`：

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. Firestore 安全規則

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 農場資料：僅本人可寫，所有人可讀
    match /farms/{farmId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.uid;
    }

    // 批次與日誌：登入農夫才可寫，公開可讀
    match /batches/{batchId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /farmLogs/{logId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // 扭蛋 / Wiki：僅後台管理員可寫
    match /gachaCharacters/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /wikiItems/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /gachaRecords/{id} {
      allow read, write: if true;
    }
  }
}
```

### 3. GitHub Pages 部署

1. 將專案推送到 GitHub Repository。
2. 進入 `Settings` → `Pages`。
3. 選擇 `main` 分支，根目錄 `/`，儲存。
4. 取得部署網址後，在 Firebase Console → Authentication → 授權網域，加入該網址。

---

## 📋 本次已完成項目

- [x] 系統架構審查與問題點分析
- [x] Firestore 完整資料庫 Schema 設計（6 個 Collection）
- [x] `login.html` — 農夫登入頁（含 Firebase Auth + 開發測試模式）
- [x] `css/login.css` — 登入頁深色玻璃態樣式
- [x] `css/admin.css` — 後台管理介面完整設計系統
- [x] `js/firebase-config.js` — Firebase 設定模板

---

## 🗺️ 最佳化調整步驟（優先序排列）

### 🔴 Phase 1：核心功能補完（立即執行）

**Step 1 — 完成 `admin.html` 後台主介面**
- 左側導覽列（儀表板 / 批次管理 / 農事日誌 / 扭蛋管理 / Wiki 管理 / 設定）
- 頂部統計卡片（總批次數、今日日誌、照片總數、角色數量）
- 使用 `css/admin.css` 已定義的深色設計系統

**Step 2 — 完成 `js/admin.js` 後台邏輯**
- Firebase Auth 狀態監聽（未登入自動跳回 `login.html`）
- 農場資料 CRUD（對應 `farms/` collection）
- 批次 CRUD + QR Code 生成（帶入 `?farmId=&batchId=` 參數）
- 農事日誌 CRUD（含多張照片上傳至 Firebase Storage）
- 登出功能

**Step 3 — 更新 `index.html` 消費者端**
- 改從 URL 參數讀取 `farmId` + `batchId`，改為從 Firestore 抓資料
- 移除 `localStorage` 依賴
- 移除 `tmp_script.js` / `tmp_gacha_script.js` 舊邏輯

---

### 🟡 Phase 2：QR Code 精準化（第二優先）

**Step 4 — 批次專屬 QR Code**
- 目前問題：QR Code 只指向 `?view=consumer`，無法區分農場或批次。
- 修正方向：改為 `?farmId=xxx&batchId=yyy`，消費者掃描後自動載入對應批次資料。
- 同時在 `admin.html` 提供「列印 QR Code」功能（PNG 下載）。

**Step 5 — Storage 照片上傳**
- 目前問題：照片用 `FileReader` 轉 Base64 存入 `localStorage`，跨裝置消失。
- 修正方向：改用 `firebase/storage` 的 `uploadBytes()` + `getDownloadURL()`，URL 存入 Firestore `photoUrls` 欄位。

---

### 🟢 Phase 3：功能擴充（第三優先）

**Step 6 — 扭蛋系統完整化**
- 補足 50 個以上角色（含名稱、表情、稀有度、故事）至 `gachaCharacters/` collection。
- 後台提供角色管理介面（新增 / 上架 / 下架）。
- 消費者端扭蛋抽獎結果記錄至 `gachaRecords/`。
- 加入稀有度加權抽籤邏輯（legendary < 2%、epic < 8%、rare < 25%、common 其餘）。

**Step 7 — Wiki 知識庫後台化**
- 目前問題：Wiki 資料硬寫在前端 JS 物件中，無法動態管理。
- 修正方向：資料移至 `wikiItems/` collection，後台可新增 / 編輯 / 停用。
- 消費者端改為從 Firestore 隨機讀取一筆 `isActive: true` 的條目。

**Step 8 — 多批次農場支援**
- 一個農夫帳號可管理多個批次（目前已在 Schema 設計中預留）。
- 消費者掃描不同批次 QR Code，看到對應的獨立履歷。

---

### 🔵 Phase 4：進階功能（長期優化）

**Step 9 — IoT 感測器自動填資料**
- 目標：整合溫濕度感測器 API，自動寫入 `farmLogs/`，農夫不需手動輸入。
- 技術方向：感測器端定期呼叫 Firebase Cloud Functions 或直接使用 REST API 寫入 Firestore。

**Step 10 — PWA 離線快取**
- 新增 `manifest.json` 與 `service-worker.js`。
- 消費者即使在網路不穩的超市 / 市集也能流暢查看已快取的履歷頁面。
- 農夫離線時仍可瀏覽已同步的日誌紀錄（寫入操作待網路恢復後自動同步）。

**Step 11 — 多語系支援**
- 目標語言：繁中（預設）、英文、日文。
- 技術方向：使用 `i18n` 物件統一管理文字，切換語系時替換 DOM 文字內容。
- 適用對象：支援農產品出口，讓外國消費者也能閱讀履歷。

**Step 12 — 數據分析報表**
- 後台新增「數據分析」頁面，展示：
  - 各批次環境數據歷史折線圖（超過 6 筆的完整視圖）
  - 扭蛋抽獎統計（各稀有度抽取次數、消費者互動率）
  - 農事日誌頻率熱力圖（哪些日期記錄最勤）

---

## 🐛 已知問題與修正紀錄

| 問題 | 狀態 | 說明 |
|------|------|------|
| 資料存於 `localStorage`，跨裝置消失 | 🔄 處理中 | Schema 已設計，待串接 Firestore |
| 無農夫登入驗證 | ✅ 已修正 | `login.html` 已建立 Firebase Auth 流程 |
| QR Code 無法區分批次 | 🔄 待 Phase 2 | 需加入 `farmId` + `batchId` 參數 |
| 照片無法跨裝置顯示 | 🔄 待 Phase 2 | 需改用 Firebase Storage |
| `tmp_script.js` 與 `tmp_gacha_script.js` 冗餘 | 🔄 待整合 | 完成 `admin.js` 後刪除 |
| Wiki 資料硬編碼在前端 | 🔄 待 Phase 3 | 移至 `wikiItems/` collection |
| 扭蛋角色池只有 5 個 | 🔄 待 Phase 3 | 補足 50+ 角色 |

---

**SKYSEF 專案組 — 致力於打造透明、互信的農業未來** 🌱
