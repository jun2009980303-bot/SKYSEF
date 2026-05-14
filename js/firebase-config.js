// ============================================================
// Firebase Configuration - SKYSER 智慧農場系統
// 請將下方設定替換為您自己的 Firebase 專案設定
// ============================================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase SDK (使用 CDN ESM 模組方式，需在 HTML 引入對應 CDN)
// 本檔案匯出設定供各模組使用
window.SKYSER_FIREBASE_CONFIG = firebaseConfig;

// Firebase 初始化狀態
window.SKYSER_DB = null;
window.SKYSER_AUTH = null;
window.SKYSER_STORAGE = null;
