// ============================================================
// Firebase Configuration - 福萌芽 智慧農場系統
// 使用 Firebase Compat CDN 模式（配合 HTML 中的 CDN script 標籤）
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyAxpJfxLZsaRW8qVFBfQOnV0BFdhZ5wXDY",
  authDomain: "skysef-farm.firebaseapp.com",
  projectId: "skysef-farm",
  storageBucket: "skysef-farm.firebasestorage.app",
  messagingSenderId: "1079481687064",
  appId: "1:1079481687064:web:e436299350172f20a5b76d"
};

// 掛載到 window 供各頁面使用（Compat 版本由 HTML CDN 引入後統一初始化）
window.FUMENYA_FIREBASE_CONFIG = firebaseConfig;

// Firebase 實例（初始化後由各頁面填入）
window.FUMENYA_DB      = null;
window.FUMENYA_AUTH    = null;
window.FUMENYA_STORAGE = null;
