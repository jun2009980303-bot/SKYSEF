/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Award,
  Droplets,
  Thermometer,
  Sun,
  Sprout,
  RotateCw,
  Gift,
  Compass,
  FileText,
  X,
  Volume2,
  VolumeX,
  MapPin,
  User,
  ChevronRight,
  Info,
  Check,
  Flame,
  Leaf,
  Activity,
  QrCode,
  Scan,
  Camera,
  Sparkles,
  Trophy,
  Lock,
  LogOut,
  Mail,
  Heart,
  History
} from 'lucide-react';
import { cropDatabase, CropProfile, MetricData } from './data';

// Helper procedural synthesizer for natural forest wind tones
interface SynthInstance {
  context: AudioContext;
  stop: () => void;
}

function startAmbientSynth(): SynthInstance | null {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    const ctx = new AudioContextClass();
    
    // Master ambient volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
    masterGain.connect(ctx.destination);
    
    // Low Drone: Root chord
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(146.83, ctx.currentTime); // D3 (Deep warm fundamental)
    
    // Mid Drone: Detuned Fifth
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(220.50, ctx.currentTime); // A3 (Slightly warm)
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    
    osc1.start();
    osc2.start();
    
    // Random gentle bells scheduler (Wind chimes simulation)
    const chimeInterval = setInterval(() => {
      try {
        if (ctx.state === 'suspended') return;
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = 'sine';
        
        const pentatonicNotes = [440.00, 493.88, 587.33, 659.25, 739.99, 880.00]; // Classical warm tones
        const randomPitch = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
        chimeOsc.frequency.setValueAtTime(randomPitch, ctx.currentTime);
        
        chimeGain.gain.setValueAtTime(0, ctx.currentTime);
        chimeGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);
        
        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        
        chimeOsc.start();
        chimeOsc.stop(ctx.currentTime + 5.0);
      } catch (err) {
        // Suppress audio issues
      }
    }, 4200);
    
    return {
      context: ctx,
      stop: () => {
        try {
          clearInterval(chimeInterval);
          osc1.stop();
          osc2.stop();
          ctx.close();
        } catch (e) {}
      }
    };
  } catch (e) {
    console.error("Web Audio Not Supported", e);
    return null;
  }
}

export default function App() {
  const [selectedCrop, setSelectedCrop] = useState<CropProfile>(cropDatabase[0]);
  const [triviaIndices, setTriviaIndices] = useState<Record<string, number>>({
    "sweet-basil": 0,
    "cherry-tomato": 0,
    "royal-mint": 0,
  });
  const [claimedAwards, setClaimedAwards] = useState<Record<string, boolean>>({});
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'temp' | 'humidity' | 'soil' | 'light'>('temp');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioHtmlRef = useRef<HTMLAudioElement | null>(null);
  const [showMusicSettings, setShowMusicSettings] = useState(false);

  const [activeTrack, setActiveTrack] = useState<'piano' | 'synth' | 'custom'>(() => {
    try {
      const saved = localStorage.getItem('smart_farm_active_track');
      return (saved as any) || 'piano';
    } catch {
      return 'piano';
    }
  });

  const [customAudioUrl, setCustomAudioUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('smart_farm_custom_audio_url');
      return saved || 'https://assets.mixkit.co/music/preview/mixkit-peaceful-piano-ambient-1129.mp3';
    } catch {
      return 'https://assets.mixkit.co/music/preview/mixkit-peaceful-piano-ambient-1129.mp3';
    }
  });

  const [audioVolume, setAudioVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('smart_farm_audio_volume');
      return saved ? parseFloat(saved) : 0.4;
    } catch {
      return 0.4;
    }
  });
  
  // Music floating notes state for realistic floating animation
  const [floatingNotes, setFloatingNotes] = useState<{ id: number; char: string; left: number; scale: number; duration: number }[]>([]);

  useEffect(() => {
    if (!audioPlaying) {
      setFloatingNotes([]);
      return;
    }

    const noteCharacters = ['♪', '♫', '♬', '♩', '♭', '🎵', '🎶'];
    let noteId = 0;

    const interval = setInterval(() => {
      const newNote = {
        id: noteId++,
        char: noteCharacters[Math.floor(Math.random() * noteCharacters.length)],
        left: Math.random() * 60 - 30, // horizontal range from -30px to 30px
        scale: Math.random() * 0.4 + 0.8, // scale factor from 0.8 to 1.2
        duration: Math.random() * 1.5 + 2.5 // animate duration from 2.5s to 4s
      };

      setFloatingNotes((prev) => [...prev.slice(-10), newNote]); // keep maximum 10 notes active
    }, 700);

    return () => clearInterval(interval);
  }, [audioPlaying]);
  
  // QR Code Scanner States
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanningActive, setScanningActive] = useState(false);
  const [scanSuccessCrop, setScanSuccessCrop] = useState<string | null>(null);

  // Daily Check-in & Gashapon Capsule Toy Machine States
  const [checkInDays, setCheckInDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('smart_farm_checkin_days');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const [checkedToday, setCheckedToday] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('smart_farm_checked_today');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [gashaponOpen, setGashaponOpen] = useState(false);
  const [gashaponStage, setGashaponStage] = useState<'idle' | 'rolling' | 'revealed'>('idle');
  const [gashaponPrize, setGashaponPrize] = useState<{ title: string; detail: string; icon: string } | null>(null);

  // User Authentication States
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('smart_farm_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Favorites and Scanned History States
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smart_farm_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [scannedHistory, setScannedHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smart_farm_scanned_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['sweet-basil'];
  });

  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  // Toggle favorite status
  const toggleFavorite = (cropId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(cropId)
        ? prev.filter(id => id !== cropId)
        : [...prev, cropId];
      try {
        localStorage.setItem('smart_farm_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Synchronize scanned history when active crop changes
  useEffect(() => {
    if (!selectedCrop) return;
    setScannedHistory(prev => {
      const filtered = prev.filter(id => id !== selectedCrop.id);
      const updated = [selectedCrop.id, ...filtered];
      try {
        localStorage.setItem('smart_farm_scanned_history', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, [selectedCrop.id]);

  // Seed initial accounts in localStorage
  useEffect(() => {
    try {
      const existingUsers = localStorage.getItem('smart_farm_users');
      if (!existingUsers) {
        const demoUsers = [
          { name: '快樂農夫', email: 'demo@example.com', password: 'password123' }
        ];
        localStorage.setItem('smart_farm_users', JSON.stringify(demoUsers));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (!authName.trim()) {
      setAuthError('請輸入姓名');
      return;
    }
    if (!authEmail.trim()) {
      setAuthError('請輸入 Email');
      return;
    }
    if (!authPassword || authPassword.length < 6) {
      setAuthError('密碼請至少輸入 6 個字元');
      return;
    }

    try {
      const usersStr = localStorage.getItem('smart_farm_users') || '[]';
      const users = JSON.parse(usersStr);
      
      const emailExists = users.some((u: any) => u.email.toLowerCase() === authEmail.toLowerCase());
      if (emailExists) {
        setAuthError('此 Email 已經被註冊過');
        return;
      }

      const newUser = {
        name: authName.trim(),
        email: authEmail.trim(),
        password: authPassword
      };

      users.push(newUser);
      localStorage.setItem('smart_farm_users', JSON.stringify(users));

      // Successfully registered, auto login
      const sessionUser = { name: newUser.name, email: newUser.email };
      localStorage.setItem('smart_farm_current_user', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setAuthSuccessMsg('註冊成功！已為您自動登入 ✨');

      setTimeout(() => {
        setAuthModalOpen(false);
        // Clean form
        setAuthName('');
        setAuthEmail('');
        setAuthPassword('');
        setAuthSuccessMsg('');
      }, 1500);

    } catch (err) {
      setAuthError('發生錯誤，請稍後再試');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');

    if (!authEmail.trim()) {
      setAuthError('請輸入 Email');
      return;
    }
    if (!authPassword) {
      setAuthError('請輸入密碼');
      return;
    }

    try {
      const usersStr = localStorage.getItem('smart_farm_users') || '[]';
      const users = JSON.parse(usersStr);

      const foundUser = users.find(
        (u: any) => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword
      );

      if (!foundUser) {
        setAuthError('電子郵件或密碼不正確');
        return;
      }

      const sessionUser = { name: foundUser.name, email: foundUser.email };
      localStorage.setItem('smart_farm_current_user', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setAuthSuccessMsg('登入成功！歡迎回來 ✨');

      setTimeout(() => {
        setAuthModalOpen(false);
        // Clean form
        setAuthName('');
        setAuthEmail('');
        setAuthPassword('');
        setAuthSuccessMsg('');
      }, 1500);

    } catch (err) {
      setAuthError('發生錯誤，請稍後再試');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('smart_farm_current_user');
      setCurrentUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Sound generator for gashapon rolling feel & roll win
  const playGashaponSound = (type: 'roll' | 'win') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'roll') {
        let time = ctx.currentTime;
        for (let i = 0; i < 15; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(150 - i * 6, time);
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.05, time + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.1);
          time += 0.08 + (i * 0.015);
        }
      } else {
        const playTone = (freq: number, delay: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0, ctx.currentTime + delay);
          gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + dur);
        };
        playTone(523.25, 0, 0.2);
        playTone(659.25, 0.08, 0.2);
        playTone(783.99, 0.16, 0.2);
        playTone(987.77, 0.24, 0.25);
        playTone(1046.50, 0.32, 0.6);
      }
    } catch (e) {
      console.log('Gashapon sound failed', e);
    }
  };

  const handleCheckIn = () => {
    if (checkedToday) return;
    
    const nextDays = Math.min(checkInDays + 1, 7);
    setCheckInDays(nextDays);
    setCheckedToday(true);
    
    try {
      localStorage.setItem('smart_farm_checkin_days', nextDays.toString());
      localStorage.setItem('smart_farm_checked_today', 'true');
    } catch (e) {
      console.error(e);
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const playTone = (freq: number, delay: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0, ctx.currentTime + delay);
          gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + dur);
        };
        playTone(523.25, 0, 0.2);
        playTone(659.25, 0.06, 0.2);
        playTone(783.99, 0.12, 0.35);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const resetCheckIn = () => {
    setCheckInDays(0);
    setCheckedToday(false);
    try {
      localStorage.setItem('smart_farm_checkin_days', '0');
      localStorage.setItem('smart_farm_checked_today', 'false');
    } catch (e) {
      console.error(e);
    }
  };

  const drawGashapon = () => {
    if (gashaponStage !== 'idle') return;
    setGashaponStage('rolling');
    playGashaponSound('roll');

    const gashaponPrizesList = [
      { title: "手作香甜金鑽鳳梨乾免費券", detail: "屏東大武山茂林伯親自手作，完全日照法溫控熟成，香甜Q彈無添加！", icon: "🍍" },
      { title: "大同冷霧高麗菜免費兌換券", detail: "高海拔冷風凝霜栽培，水嫩多汁甘甜高麗菜，契作農場精選現場兌換！", icon: "🥬" },
      { title: "卓蘭手採巨峰葡萄整串兌換券", detail: "網室低農藥精緻栽培，紫黑飽滿飽含濃育天然果粉與荔枝蜂蜜香氣！", icon: "🍇" },
      { title: "無毒水果玉米三支免費券", detail: "員山清澈湧泉自然滲灌，爆汁鮮嫩生食級黃白雙色水果玉米！", icon: "🌽" },
      { title: "埔里冷泉美人筍現烤兌換券", detail: "合歡山清冽冷泉梯田湧水培育，現烤多汁細嫩白皙美人腿茭白筍！", icon: "🥢" },
      { title: "溪州翠綠青花椰菜兩大顆免費券", detail: "32目物理密閉防蟲罩栽培！絕無菜蟲顧慮、翠綠飽滿十字花科之王！", icon: "🥦" },
      { title: "梨山原種蜜香蜜蘋果三顆兌換券", detail: "冷暖極致溫差催生黃金結晶蜜腺，無打蠟天然多酚梨山蜜蘋果！", icon: "🍎" },
      { title: "九層塔純度香草提神精油包", detail: "新鮮手採香甜羅勒草低溫萃取精油，提神乾淨、芳香芬芳防蚊包！", icon: "🌿" },
      { title: "皇家綠薄荷手摘冷泡熟茶二瓶", detail: "冷冽泉水慢速溫泡，帶有清新微甜與完美清爽喉感的皇家綠薄荷茶！", icon: "🥤" },
      { title: "櫻桃小番茄高維他命生鮮盒", detail: "大武山溫高充足養分日照，皮薄爆汁、多酚茄紅抗氧化滿份一盒！", icon: "🍅" }
    ];

    setTimeout(() => {
      const drawn = gashaponPrizesList[Math.floor(Math.random() * gashaponPrizesList.length)];
      setGashaponPrize(drawn);
      setGashaponStage('revealed');
      playGashaponSound('win');
    }, 2500);
  };

  // Play a beautiful synthesized scan hardware beep via Web Audio API
  const playScanBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime); // high crisp beep
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.log("Audio beep failed: ", e);
    }
  };
  
  // Refs
  const synthInstanceRef = useRef<SynthInstance | null>(null);

  // Trivia index management
  const currentTriviaIndex = triviaIndices[selectedCrop.id] || 0;

  const cycleTrivia = () => {
    const listLength = selectedCrop.triviaList.length;
    setTriviaIndices(prev => ({
      ...prev,
      [selectedCrop.id]: (currentTriviaIndex + 1) % listLength
    }));
  };

  const stopAllAudio = () => {
    if (synthInstanceRef.current) {
      synthInstanceRef.current.stop();
      synthInstanceRef.current = null;
    }
    if (audioHtmlRef.current) {
      try {
        audioHtmlRef.current.pause();
        audioHtmlRef.current.src = "";
      } catch (err) {
        console.error(err);
      }
      audioHtmlRef.current = null;
    }
  };

  const startSelectedAudio = (track: 'piano' | 'synth' | 'custom', customUrlValue?: string) => {
    stopAllAudio();
    const url = customUrlValue || (track === 'piano' ? 'https://assets.mixkit.co/music/preview/mixkit-peaceful-piano-ambient-1129.mp3' : customAudioUrl);
    
    if (track === 'synth') {
      const instance = startAmbientSynth();
      if (instance) {
        synthInstanceRef.current = instance;
        if (instance.context.state === 'suspended') {
          instance.context.resume();
        }
      }
    } else {
      try {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = audioVolume;
        audioHtmlRef.current = audio;
        audio.play().catch(e => {
          console.log("Audio autoplay was blocked or failed: ", e);
        });
      } catch (err) {
        console.error("Audio stream error: ", err);
      }
    }
  };

  // Toggle ambient music synthesizer or stream player
  const toggleAudio = () => {
    if (audioPlaying) {
      stopAllAudio();
      setAudioPlaying(false);
    } else {
      startSelectedAudio(activeTrack);
      setAudioPlaying(true);
    }
  };

  const handleVolumeChange = (v: number) => {
    setAudioVolume(v);
    try {
      localStorage.setItem('smart_farm_audio_volume', v.toString());
    } catch (err) {
      console.error(err);
    }
    if (audioHtmlRef.current) {
      audioHtmlRef.current.volume = v;
    }
  };

  const changeTrack = (track: 'piano' | 'synth' | 'custom', customUrlValue?: string) => {
    setActiveTrack(track);
    try {
      localStorage.setItem('smart_farm_active_track', track);
      if (customUrlValue) {
        setCustomAudioUrl(customUrlValue);
        localStorage.setItem('smart_farm_custom_audio_url', customUrlValue);
      }
    } catch (err) {
      console.error(err);
    }

    if (audioPlaying) {
      startSelectedAudio(track, customUrlValue);
    }
  };

  // Autoplay handler or cleanup
  useEffect(() => {
    return () => {
      if (synthInstanceRef.current) {
        synthInstanceRef.current.stop();
      }
      if (audioHtmlRef.current) {
        try {
          audioHtmlRef.current.pause();
        } catch (e) {}
      }
    };
  }, []);

  // Sync state if initial crop changes
  const handleCropChange = (crop: CropProfile) => {
    setSelectedCrop(crop);
    // Auto reset active metrics tab if no metrics
    if (crop.metrics.length === 0) {
      setActiveTab('temp');
    }
  };

  // Custom premium SVG Area charting matching glassmorphism
  const renderSensorChart = (data: MetricData[]) => {
    if (!data || data.length === 0) return null;

    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 35;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Retrieve active metric properties
    let valueKey: 'temperature' | 'humidity' | 'soilMoisture' | 'light' = 'temperature';
    let unit = '°C';
    let label = '溫度';
    let lineColor = '#ff9f43'; // Morandi warmth
    let startGradient = 'rgba(255, 159, 67, 0.4)';
    let endGradient = 'rgba(255, 159, 67, 0)';

    if (activeTab === 'temp') {
      valueKey = 'temperature';
      unit = '°C';
      label = '空氣溫度';
      lineColor = '#f43f5e';
      startGradient = 'rgba(244, 63, 94, 0.3)';
    } else if (activeTab === 'humidity') {
      valueKey = 'humidity';
      unit = '%';
      label = '空氣濕度';
      lineColor = '#38bdf8';
      startGradient = 'rgba(56, 189, 248, 0.3)';
    } else if (activeTab === 'soil') {
      valueKey = 'soilMoisture';
      unit = '%';
      label = '土壤含水量';
      lineColor = '#34d399';
      startGradient = 'rgba(52, 211, 153, 0.3)';
    } else if (activeTab === 'light') {
      valueKey = 'light';
      unit = ' lux';
      label = '日光光照';
      lineColor = '#fbbf24';
      startGradient = 'rgba(251, 191, 36, 0.3)';
    }

    const values = data.map(d => d[valueKey]);
    const maxVal = Math.max(...values, 10);
    const minVal = Math.min(...values, 0);
    const valRange = maxVal - minVal || 1;

    // Coordinate converters
    const getX = (index: number) => {
      return paddingLeft + (chartWidth / (data.length - 1)) * index;
    };
    const getY = (val: number) => {
      const ratio = (val - minVal) / valRange;
      return paddingTop + chartHeight - ratio * chartHeight;
    };

    // Build SVG Path points
    const points = data.map((d, i) => `${getX(i)},${getY(d[valueKey])}`).join(' ');
    const areaPath = `${getX(0)},${getY(minVal)} ${points} ${getX(data.length - 1)},${getY(minVal)} Z`;
    const linePath = points;

    return (
      <div id="metric-chart" className="w-full h-full relative">
        {/* Custom Legend Floating */}
        <div id="chart-legend" className="absolute top-1 right-2 flex items-center space-x-2 text-[10px] text-white/50 font-mono">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: lineColor }} />
          <span>實時: {data[data.length - 1][valueKey]}{unit}</span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-white/40">
          <defs>
            <linearGradient id={`gradient-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = paddingTop + chartHeight * ratio;
            const val = maxVal - valRange * ratio;
            return (
              <g key={index}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-white/40"
                >
                  {val.toFixed(0)}
                  {activeTab === 'light' ? '' : unit}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <path
            d={areaPath}
            fill={`url(#gradient-${activeTab})`}
          />

          {/* Line string */}
          <polyline
            fill="none"
            stroke={lineColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePath}
          />

          {/* Interactive Node Dots */}
          {data.map((d, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={getX(i)}
                cy={getY(d[valueKey])}
                r="4.5"
                fill="#ffffff"
                stroke={lineColor}
                strokeWidth="2.5"
                className="transition-all duration-300 hover:scale-150"
              />
              <text
                x={getX(i)}
                y={paddingBottom + chartHeight + 16}
                textAnchor="middle"
                className="text-[9px] font-mono fill-white/55 font-medium"
              >
                {d.time}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div id="smart-farm-app" className="min-h-screen relative w-full overflow-y-auto bg-[#030612] select-none text-white pb-16 flex flex-col items-center">
      
      {/* Immersive Polar Mountain Twilight backdrop */}
      <div 
        id="scenic-background" 
        className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden" 
        style={{ background: 'linear-gradient(to bottom, #03050c 0%, #060a17 25%, #0d1326 50%, #1c1a32 75%, #2d1e2e 90%, #3e1f30 100%)' }}
      >
        {/* Soft starry dots texture */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px), radial-gradient(circle, #ffffff 0.6px, transparent 0.6px)', 
            backgroundSize: '80px 80px, 140px 140px', 
            backgroundPosition: '0 0, 40px 70px' 
          }} 
        />

        {/* Dynamic glowing Crescent Moon matching polar twilight feel */}
        <div className="absolute top-[10%] right-[14%] sm:right-[18%] z-0 flex items-center justify-center opacity-90 pointer-events-none">
          <div className="relative">
            {/* Soft moonlight auroral glow */}
            <div className="absolute -inset-6 bg-amber-100/5 blur-2xl rounded-full w-16 h-16" />
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" className="text-amber-100/90 drop-shadow-[0_0_12px_rgba(254,243,199,0.85)]">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Cold twilight ambient glow layers */}
        <div className="absolute top-[15%] left-[-10%] w-[80%] h-[80vw] rounded-full bg-indigo-500/5 blur-[130px] animate-pulse duration-[16000ms]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[70%] h-[70vw] rounded-full bg-fuchsia-500/5 blur-[120px] animate-pulse duration-[14000ms]" />
        
        {/* Layered Snowy Mountain Silhouette Vector SVGs */}
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[35vh] min-h-[160px] z-0 pointer-events-none">
          <defs>
            <linearGradient id="back-mountain-grad" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#1a142c" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#080512" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="mid-mountain-grad" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#13132a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#05030a" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="front-mountain-grad" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#22204a" />
              <stop offset="40%" stopColor="#171531" />
              <stop offset="100%" stopColor="#030206" />
            </linearGradient>
            <linearGradient id="ridge-glow" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Layer 1: Back range */}
          <path d="M0,210 L150,160 L310,220 L480,145 L690,205 L920,115 L1110,195 L1290,135 L1440,205 L1440,320 L0,320 Z" fill="url(#back-mountain-grad)" />
          
          {/* Layer 2: Mid range */}
          <path d="M0,240 L220,185 L440,230 L610,150 L840,225 L1040,145 L1260,215 L1380,175 L1440,215 L1440,320 L0,320 Z" fill="url(#mid-mountain-grad)" />
          <path d="M0,240 L220,185 L440,230 L610,150 L840,225 L1040,145 L1260,215 L1380,175 L1440,215" fill="none" stroke="url(#ridge-glow)" strokeWidth="3.5" opacity="0.3" />

          {/* Layer 3: Front range */}
          <path d="M0,275 L260,220 L550,265 L790,185 L1070,250 L1310,200 L1440,240 L1440,320 L0,320 Z" fill="url(#front-mountain-grad)" />
          
          {/* Glowing frosted white snow ridge highlights directly illuminated by crescent moon */}
          <path d="M0,275 L260,220 L550,265 L790,185 L1070,250 L1310,200 L1440,240" fill="none" stroke="#d5d3f8" strokeWidth="2.2" opacity="0.5" />
        </svg>
      </div>

      <div id="glass-content-wrapper" className="relative z-10 w-full max-w-lg px-4 pt-6 space-y-6 flex-grow flex flex-col">
        
        {/* HEADER SECTION WITH DESIGN LOGO AND SYSTEM BADGE */}
        <header id="app-header" className="flex flex-col border-b border-white/10 pb-2 mb-2 relative z-30">
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Sprout className="w-5 h-5 text-indigo-300 animate-bounce duration-[4000ms]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display tracking-[0.15em] font-semibold text-white/90 text-xs uppercase leading-none">Smart Farm</span>
                <span className="text-[8px] text-indigo-200/80 tracking-widest uppercase mt-0.5 leading-none">Traceability</span>
              </div>
            </div>

            {/* Quick action buttons & Auth */}
            <div className="flex items-center space-x-2">
              {/* Favorites heart button (Toggles current crop) */}
              <button
                id="btn-toggle-favorite"
                onClick={() => toggleFavorite(selectedCrop.id)}
                className={`p-1.5 rounded-full border transition-all duration-200 cursor-pointer active:scale-90 ${
                  favorites.includes(selectedCrop.id)
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)] hover:bg-rose-500/30'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10'
                }`}
                title={favorites.includes(selectedCrop.id) ? "從收藏移除" : "加入我的收藏"}
              >
                <Heart className={`w-3.5 h-3.5 ${favorites.includes(selectedCrop.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
              </button>

              {/* History & Favorites quick switcher button */}
              <button
                id="btn-toggle-history"
                onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                className={`p-1.5 rounded-full border transition-all duration-200 cursor-pointer active:scale-90 relative ${
                  showHistoryDropdown
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10'
                }`}
                title="已看過與收藏的作物"
              >
                <History className="w-3.5 h-3.5" />
                {scannedHistory.length > 1 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-500 text-white font-mono text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-neutral-900 leading-none scale-90">
                    {scannedHistory.length}
                  </span>
                )}
              </button>

              {/* User Block */}
              {currentUser ? (
                <div className="flex items-center space-x-1">
                  <div className="px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono text-indigo-200 flex items-center space-x-1 shadow-inner">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="max-w-[70px] truncate font-medium">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 text-white/60 transition-colors cursor-pointer outline-none active:scale-95 duration-100"
                    title="登出帳號"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="btn-trigger-login"
                  onClick={() => {
                    setAuthError('');
                    setAuthSuccessMsg('');
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-full bg-indigo-500/90 hover:bg-indigo-500 border border-indigo-400/30 text-[9px] font-semibold text-white uppercase transition-all active:scale-95 duration-100 cursor-pointer"
                >
                  登入
                </button>
              )}
            </div>
          </div>

          {/* Collapsible history / favorites switcher panel */}
          <AnimatePresence>
            {showHistoryDropdown && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-1 bg-[#0b1021]/95 backdrop-blur-md rounded-2xl border border-white/10 p-3 flex flex-col space-y-3 shadow-[0_12px_36px_rgba(0,0,0,0.5)] z-20"
              >
                {/* Favorites Sublist */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-1.5 text-rose-400 text-left">
                    <Heart className="w-3 h-3 fill-rose-400" />
                    <span className="text-[9px] font-bold uppercase tracking-wider font-display">我的收藏作物 ({favorites.length})</span>
                  </div>
                  {favorites.length === 0 ? (
                    <p className="text-[9px] text-white/30 text-left pl-4 py-0.5">尚未收藏任何作物，點擊心型按鈕即可加入收藏 🌿</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      {favorites.map(id => {
                        const crop = cropDatabase.find(c => c.id === id);
                        if (!crop) return null;
                        const isCurrentActive = selectedCrop.id === id;
                        return (
                          <button
                            key={id}
                            onClick={() => {
                              setSelectedCrop(crop);
                              // Auto reset active metrics tab if no metrics
                              if (crop.metrics.length === 0) {
                                setActiveTab('temp');
                              }
                            }}
                            className={`px-2 py-1.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isCurrentActive
                                ? 'bg-gradient-to-r from-rose-500/15 to-indigo-500/15 border-rose-500/40 text-white ring-1 ring-rose-500/20'
                                : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:border-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-1.5 truncate">
                              <span className="text-xs shrink-0">❤️</span>
                              <span className="text-[11px] font-medium truncate">{crop.name.replace(/\s+/g, '')}</span>
                            </div>
                            <span className="text-[8px] font-mono text-white/30 shrink-0 select-none pl-1">
                              {crop.startDate}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Scanned/Viewed History Sublist */}
                <div className="flex flex-col space-y-1 pt-2 border-t border-white/5">
                  <div className="flex items-center space-x-1.5 text-indigo-400 text-left">
                    <History className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-wider font-display">歷史瀏覽與掃描紀錄 ({scannedHistory.length})</span>
                  </div>
                  <div className="max-h-[140px] overflow-y-auto pr-1 flex flex-col space-y-1 scrollbar-thin scrollbar-thumb-indigo-500/20">
                    {scannedHistory.map((id, index) => {
                      const crop = cropDatabase.find(c => c.id === id);
                      if (!crop) return null;
                      const isCurrentActive = selectedCrop.id === id;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            setSelectedCrop(crop);
                            // Auto reset active metrics tab if no metrics
                            if (crop.metrics.length === 0) {
                              setActiveTab('temp');
                            }
                          }}
                          className={`p-1.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isCurrentActive
                              ? 'bg-indigo-500/15 border-indigo-500/40 text-white'
                              : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:border-white/10 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 truncate">
                            <span className="text-[8px] font-mono text-white/30 shrink-0">#{index + 1}</span>
                            <span className="text-[11px] font-medium truncate">{crop.name.replace(/\s+/g, '')}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[8px] font-mono text-white/40 max-w-[80px] truncate bg-white/5 px-1 py-0.5 rounded leading-none">
                              {crop.location.substring(0, 4)}...
                            </span>
                            <ChevronRight className="w-2.5 h-2.5 text-white/30" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Dynamic Title and Subtitle Card */}
        <div id="app-title-card" className="text-center py-2 space-y-1">
          <h1 className="font-display font-medium tracking-wider text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-100">
            智慧農場動態履歷
          </h1>
          <p className="text-[10px] text-indigo-200/60 font-mono tracking-wider">
            掃描 QR 碼進入之農產品履歷展示平台
          </p>
        </div>

        {/* 🌱 QR CODE SCANNER TRIGGER BUTTON (掃描 QR Code 主入口) */}
        <div id="qr-scanner-trigger-container" className="w-full">
          <button
            id="btn-open-scanner"
            onClick={() => {
              setScannerOpen(true);
              setScanningActive(true);
              setScanSuccessCrop(null);
            }}
            className="w-full py-4 px-5 rounded-[22px] bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 hover:from-indigo-400 hover:to-pink-400 text-white font-display font-medium text-xs tracking-widest uppercase flex items-center justify-between shadow-[0_8px_30px_rgba(99,102,241,0.25)] active:scale-[0.98] transition-all duration-300 border border-white/20 relative overflow-hidden group cursor-pointer"
          >
            <div className="flex items-center space-x-3.5 relative z-10">
              <div className="p-2.5 bg-white/15 rounded-xl border border-white/25 flex items-center justify-center animate-pulse">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-[13px] tracking-wide text-white leading-tight">掃描作物生長籤 QR 碼</span>
                <span className="text-[9px] text-indigo-100/75 uppercase tracking-widest font-mono mt-0.5 leading-none">Scan garden stake qr code</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-black/25 rounded-full border border-white/10 text-[9px] font-mono tracking-widest relative z-10 text-indigo-200">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              <span>啟動掃描</span>
            </div>
          </button>
        </div>

        {/* 🎴 SECTION 1: 生產履歷核心卡片 (RESUME CORE) */}
        <section id="section-production-resume" className="w-full">
          <div className="glass-panel p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-white/5 border-white/15 flex flex-col space-y-5">
            
            {/* Top row with split layout structure */}
            <div className="flex h-full border-b border-white/10 pb-5">
              
              {/* Left Column: Calendar Date, Vinyl & Batch ID */}
               <div id="resume-left-col" className="w-[35%] border-r border-[#ffffff15] pr-4 flex flex-col items-center text-center justify-between">
                 <div className="flex flex-col items-center">
                   <Calendar className="w-10 h-10 text-indigo-300/60 mb-1" />
                   <span className="text-3xl font-light tracking-tight text-white">{selectedCrop.startDate}</span>
                   <span className="text-[8px] uppercase tracking-widest text-white/40 mt-0.5">LAUNCH DATE</span>
                 </div>
                 
                 <div className="w-full flex flex-col items-center pt-4">
                   <span className="text-[8px] uppercase tracking-widest text-white/40 mb-1">BATCH ID</span>
                   <span className={`text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded bg-black/25 border border-white/5 ${
                     selectedCrop.batchNo === '新苗孕育中' ? 'text-green-300' : 'text-indigo-200'
                   }`}>
                     {selectedCrop.batchNo}
                   </span>
                 </div>
               </div>

              {/* Right Column: Spaced title & timeline details */}
              <div id="resume-right-col" className="w-[65%] pl-5 flex flex-col justify-between">
                <div className="space-y-4 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/10" />
                  
                  {/* Node 1 */}
                  <div className="flex items-center space-x-3 relative">
                    <div className="w-3.5 h-3.5 bg-white rotate-45 z-10 flex items-center justify-center">
                      <div className="w-1 h-1 bg-[#030612]" />
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/50 leading-none">LOCATION</p>
                      <p className="text-xs text-white/95 mt-0.5">{selectedCrop.location}</p>
                    </div>
                  </div>
 
                  {/* Node 2 */}
                  <div className="flex items-center space-x-3 relative">
                    <div className="w-3.5 h-3.5 bg-white/40 rotate-45 z-10" />
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/50 leading-none">CROP VARIETY</p>
                      <p className="text-xs text-purple-200 mt-0.5 font-medium">{selectedCrop.name.replace(/\s+/g, '')}</p>
                    </div>
                  </div>
 
                  {/* Node 3 */}
                  <div className="flex items-center space-x-3 relative">
                    <div className="w-3.5 h-3.5 bg-white/40 rotate-45 z-10" />
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/50 leading-none">CULTIVATOR</p>
                      <p className="text-xs text-white/95 mt-0.5">{selectedCrop.farmerName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Left-Bottom: Vinyl record / Music ambient note container */}
            <div id="vinyl-music-container" className="pt-2 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  id="vinyl-player-btn"
                  onClick={toggleAudio}
                  className="group relative cursor-pointer outline-none focus:ring-1 focus:ring-white/20 rounded-full"
                  title={audioPlaying ? "停止田園背景音樂" : "開啟田園背景音樂"}
                >
                  <div className="absolute inset-0 rounded-full bg-black/40 blur-[4px] scale-[1.05]" />
                  <div className={`w-10 h-10 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center relative shadow-lg ${
                    audioPlaying ? 'animate-[spin_4s_linear_infinite]' : 'group-hover:rotate-12 transition-transform duration-300'
                  }`}>
                    <div className="w-3 h-3 rounded-full bg-indigo-500/80 border border-neutral-900 flex items-center justify-center">
                      <div className="w-1 h-3 rounded-full bg-neutral-950" style={{ transform: "scale(0.5)" }} />
                    </div>
                    <div className="absolute inset-1.5 rounded-full border border-neutral-800/60 pointer-events-none" />
                    <div className="absolute inset-2.5 rounded-full border border-neutral-800/40 pointer-events-none" />
                  </div>
                  {audioPlaying && (
                    <div className="absolute inset-0 pointer-events-none overflow-visible">
                      <AnimatePresence>
                        {floatingNotes.map((note) => (
                          <motion.span
                            key={note.id}
                            initial={{ opacity: 0, y: -5, x: 0, scale: 0.3 }}
                            animate={{
                              opacity: [0, 0.95, 0.85, 0],
                              y: -95,
                              x: [0, note.left * 0.4, note.left * 0.8, note.left],
                              scale: [0.3, note.scale, note.scale, 0.5],
                              rotate: [0, note.left > 0 ? 30 : -30]
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: note.duration,
                              ease: "easeOut",
                            }}
                            className={`absolute left-3.5 top-1 text-[11px] font-bold select-none leading-none z-30 ${
                              note.id % 5 === 0 ? 'text-orange-300 drop-shadow-[0_0_6px_rgba(249,115,22,0.7)]' :
                              note.id % 5 === 1 ? 'text-teal-300 drop-shadow-[0_0_6px_rgba(20,184,166,0.7)]' :
                              note.id % 5 === 2 ? 'text-rose-300 drop-shadow-[0_0_6px_rgba(244,63,94,0.7)]' :
                              note.id % 5 === 3 ? 'text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]' :
                              'text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]'
                            }`}
                          >
                            {note.char}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </button>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] text-white/45 tracking-wider font-mono">
                    {audioPlaying ? 'AMBIENT MUSIC PLAYING' : 'AMBIENT MUSIC OFF'}
                  </span>
                  <span className="text-[10px] text-indigo-200 tracking-wide font-medium font-sans">
                    🎹 悠美田園背景音樂
                  </span>
                </div>
              </div>
              
              <div className="text-[10px] text-white/50 font-light italic max-w-[45%] text-right leading-tight truncate">
                「{selectedCrop.farmerPhilosophy}」
              </div>
            </div>

          </div>
        </section>

        {/* 💡 SECTION 2: 今日小知識 (TRIVIA CARD) */}
        <section id="section-daily-trivia" className="w-full">
          <div className="glass-panel p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-white/5 border-white/10 rounded-[28px]">
            {/* Top row */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] text-white/40 tracking-wider">TODAY'S SELECTION</span>
                <h3 className="font-serif italic text-2xl text-white font-semibold flex items-center space-x-1">
                  <span>{selectedCrop.triviaTitle}</span>
                </h3>
              </div>
              
              {/* Sunset solid orange tag representation from design specification */}
              <div className="px-3 py-1 bg-indigo-600 rounded-full text-[10px] text-white font-medium uppercase font-display tracking-widest flex items-center space-x-1.5 shadow-[0_4px_12px_rgba(99,102,241,0.25)]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>今日小知識</span>
              </div>
            </div>

            {/* Transitioning Trivia Content */}
            <div className="min-h-[50px] relative py-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${selectedCrop.id}-${currentTriviaIndex}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-white/90 leading-relaxed font-light tracking-wide italic"
                >
                  {selectedCrop.triviaList[currentTriviaIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Clickable bottom controller */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
              <button
                id="btn-cycle-trivia"
                onClick={cycleTrivia}
                className="text-[10px] px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-200 border border-white/10 flex items-center space-x-2 font-display tracking-widest uppercase cursor-pointer active:scale-95 transition-all shadow-inner"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-300" />
                <span>換一個知識</span>
              </button>
              
              <span className="text-[10px] text-white/40 font-mono">
                {currentTriviaIndex + 1} / {selectedCrop.triviaList.length}
              </span>
            </div>
          </div>
        </section>

        {/* 📸 SECTION 3: 植物照片 (PLANT IMAGE CARD) */}
        <section id="section-plant-photo" className="w-full">
          <div className="glass-panel p-5 shadow-xl backdrop-blur-xl bg-white/5 border-white/10 relative overflow-hidden flex flex-col space-y-4">
            
            {/* Header Title with sunset aesthetics */}
            <div className="flex items-center space-x-2 text-indigo-300">
              <span className="text-indigo-300 text-lg">🌱</span>
              <h3 className="font-display font-medium tracking-widest text-xs uppercase text-white/80">
                植物生長主日曆物候照片
              </h3>
            </div>

            {/* DASHED ACCENT SLEEK IMAGE CANVAS */}
            <div className="border border-dashed border-indigo-400/20 p-2 rounded-2xl relative bg-black/20 overflow-hidden group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-inner">
                {/* Visual Image */}
                <img
                  src={selectedCrop.photoUrl}
                  alt={selectedCrop.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Visual HUD grid frame with orange state indicators */}
                <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-neutral-900/80 backdrop-blur border border-white/10 rounded font-mono text-[9px] text-indigo-300 flex items-center space-x-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  <span>實時攝像 LATEST</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 🎁 SECTION 4: 每日簽到與智慧扭蛋機 (DAILY CHECK-IN & GASHAPON CAPSULE REWARDS) */}
        <section id="section-exclusive-prize" className="w-full">
          <div className="glass-panel p-6 border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/15 via-white/[0.08] to-purple-500/[0.04] shadow-[0_8px_32px_rgba(99,102,241,0.15)] relative overflow-hidden flex flex-col space-y-4">
            
            {/* Glowing corner vectors */}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center space-x-2.5 text-indigo-200">
              <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                <Trophy className="w-5 h-5 text-indigo-300" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-display font-semibold tracking-wide text-sm text-white">
                  每日小農巡禮・簽到扭蛋
                </h3>
                <span className="text-[9px] text-indigo-200/80 tracking-widest font-mono uppercase">DAILY CHECK-IN REWARDS</span>
              </div>
            </div>

            <p className="text-xs text-indigo-100/80 leading-relaxed font-light">
              累積簽到滿 7 天，即可解鎖「智慧溫室扭蛋機」！100% 隨機抽取各類頂級鮮嫩蔬果、鮮搾特調好禮與產地回饋兌換券！
            </p>

            {/* 7 Days Grid indicators */}
            <div id="checkin-grid" className="grid grid-cols-7 gap-1.5 py-1">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isSigned = num <= checkInDays;
                const isLast = num === 7;
                return (
                  <div
                    key={num}
                    className={`relative rounded-xl p-2 flex flex-col items-center justify-center border transition-all duration-300 ${
                      isSigned
                        ? 'bg-gradient-to-b from-indigo-500/20 to-indigo-500/5 border-indigo-400/40 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                        : isLast
                        ? 'bg-[#bb86fc]/20 border-[#bb86fc]/40 text-[#d4af37] animate-pulse'
                        : 'bg-white/[0.02] border-white/5 text-white/30'
                    }`}
                  >
                    <span className="text-[8px] font-mono tracking-widest text-center opacity-60 leading-none mb-1">
                      D{num}
                    </span>
                    <div className="flex items-center justify-center w-5 h-5 rounded-lg">
                      {isSigned ? (
                        <Check className="w-3.5 h-3.5 text-indigo-400 stroke-[3.5px]" />
                      ) : isLast ? (
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      ) : (
                        <Calendar className="w-3 h-3 text-white/10" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status note and Reset hook */}
            <div className="flex justify-between items-center text-[10px] text-white/40 px-0.5">
              <span>目前簽到進度: <strong className="text-indigo-300 font-mono text-xs font-semibold">{checkInDays}</strong> / 7 天</span>
              <button
                onClick={resetCheckIn}
                className="text-white/30 hover:text-indigo-300 underline font-mono cursor-pointer transition-colors"
              >
                重置簽到
              </button>
            </div>

            {/* Dynamic Checkin or Gashapon Trigger Button */}
            {checkInDays < 7 ? (
              <button
                id="btn-claim-reward"
                onClick={handleCheckIn}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest duration-200 cursor-pointer outline-none font-display flex items-center justify-center space-x-2.5 transition-all shadow-[0_4px_22px_rgba(255,255,255,0.05)] ${
                  checkedToday
                    ? 'bg-gradient-to-r from-neutral-800 to-neutral-900 text-white/60 hover:text-white border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-[0_4px_22px_rgba(99,102,241,0.20)] active:scale-95'
                }`}
              >
                <span>{checkedToday ? '今日已完成簽到 (點擊可連續前進)' : '立即簽到 Check In'}</span>
                <ChevronRight className={`w-4 h-4 stroke-[3px] ${!checkedToday && 'animate-bounce'}`} />
              </button>
            ) : (
              <button
                id="btn-claim-reward"
                onClick={() => {
                  setGashaponOpen(true);
                  setGashaponStage('idle');
                  setGashaponPrize(null);
                }}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-purple-400/45 active:scale-[0.97] transition-all duration-300 cursor-pointer outline-none font-display flex items-center justify-center space-x-2.5 animate-bounce"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span>啟動智慧扭蛋機抽獎！</span>
                <ChevronRight className="w-4 h-4 text-white stroke-[3px]" />
              </button>
            )}
            
          </div>
        </section>

        {/* 📊 SECTION 5: 生長環境監測數據 & 完整農事歷程 */}
        <section id="section-grow-charts" className="w-full space-y-5">
          
          {/* A. 生長環境監測數據 (ENVIRONMENT MONITORING CARD in Deep Glass Panel) */}
          <div className="glass-panel-deep p-6 shadow-2xl relative overflow-hidden flex flex-col space-y-4">
            
            <div className="flex items-center space-x-2 text-indigo-300">
              <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="font-display font-medium tracking-wide text-xs uppercase text-white/80">
                農業環境實時監測數據
              </h3>
            </div>

            {selectedCrop.metrics.length === 0 ? (
              /* 初期無數據下的溫質提示 (No data clean template) */
              <div id="no-metrics-prompt" className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-2.5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
                <Droplets className="w-8 h-8 text-white/15 animate-pulse" />
                <p className="text-xs text-white/45 tracking-wide font-light">
                  數據與歷程正在有機累積中，敬請期待...
                </p>
              </div>
            ) : (
              /* Live graph rendering */
              <div className="space-y-4">
                {/* Tabs selection selectors */}
                <div id="chart-tabs" className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/40 text-center text-[10px]">
                  <button
                    id="btn-tab-temp"
                    onClick={() => setActiveTab('temp')}
                    className={`py-2 px-1 rounded-lg transition-colors ${
                      activeTab === 'temp' ? 'bg-white/10 text-rose-300 font-semibold' : 'text-white/45 hover:text-white'
                    }`}
                  >
                    溫度
                  </button>
                  <button
                    id="btn-tab-humidity"
                    onClick={() => setActiveTab('humidity')}
                    className={`py-2 px-1 rounded-lg transition-colors ${
                      activeTab === 'humidity' ? 'bg-white/10 text-sky-400 font-semibold' : 'text-white/45 hover:text-white'
                    }`}
                  >
                    濕度
                  </button>
                  <button
                    id="btn-tab-soil"
                    onClick={() => setActiveTab('soil')}
                    className={`py-2 px-1 rounded-lg transition-colors ${
                      activeTab === 'soil' ? 'bg-white/10 text-emerald-400 font-semibold' : 'text-white/45 hover:text-white'
                    }`}
                  >
                    含水量
                  </button>
                  <button
                    id="btn-tab-light"
                    onClick={() => setActiveTab('light')}
                    className={`py-2 px-1 rounded-lg transition-colors ${
                      activeTab === 'light' ? 'bg-white/10 text-amber-300 font-semibold' : 'text-white/45 hover:text-white'
                    }`}
                  >
                    照度
                  </button>
                </div>

                {/* Telemetry charts space */}
                <div className="h-44 w-full bg-black/30 border border-white/10 rounded-2xl p-2 flex items-center justify-center">
                  {renderSensorChart(selectedCrop.metrics)}
                </div>
              </div>
            )}

          </div>

          {/* B. 完整農事歷程 (FARMING LOGS VERTICAL STEPS) */}
          <div className="glass-panel-deep p-6 shadow-2xl relative overflow-hidden flex flex-col space-y-4">
            
            <div className="flex items-center space-x-2 text-rose-300">
              <div className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/20">
                <FileText className="w-4 h-4 text-rose-400" />
              </div>
              <h3 className="font-display font-medium tracking-wide text-xs uppercase text-white/80">
                全程完整耕作日志農事歷程
              </h3>
            </div>

            {selectedCrop.logs.length === 0 ? (
              /* 初期無數據下的溫質提示 (No data clean template) */
              <div id="no-logs-prompt" className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-2.5 rounded-2xl border border-dashed border-white/20 bg-black/40">
                <Sprout className="w-8 h-8 text-white/20 animate-pulse" />
                <p className="text-xs text-white/45 tracking-wide font-light">
                  本期作物栽培履歷正在有機累積中，敬請期待...
                </p>
              </div>
            ) : (
              /* vertical custom log nodes step outline */
              <div id="logs-timeline" className="relative pl-7 space-y-5 pt-2">
                {/* Core axis line */}
                <div className="absolute left-2.5 top-0 bottom-4 w-[1px] bg-white/10" />

                {selectedCrop.logs.map((log, index) => (
                  <div key={index} className="relative flex flex-col">
                    {/* Floating Axis Node Indicator */}
                    <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-neutral-900 border border-white/15 flex items-center justify-center text-[10px] shadow-md">
                      {log.iconType === 'sprout' && <Sprout className="w-3.5 h-3.5 text-emerald-300" />}
                      {log.iconType === 'droplet' && <Droplets className="w-3.5 h-3.5 text-sky-400" />}
                      {log.iconType === 'sun' && <Sun className="w-3.5 h-3.5 text-amber-300" />}
                      {log.iconType === 'clipboard' && <FileText className="w-3.5 h-3.5 text-pink-400" />}
                    </div>

                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-mono font-medium text-orange-200 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                          {log.date}
                        </span>
                        <span className="text-xs text-white/90 font-medium">
                          {log.stage}
                        </span>
                      </div>
                      <span className="text-[11px] text-orange-200/80 font-medium font-display uppercase tracking-wider">
                        作業: {log.action}
                      </span>
                      <p className="text-[11px] text-white/60 leading-relaxed font-light">
                        {log.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </section>

        {/* FOOTER */}
        <footer id="app-footer" className="py-8 flex flex-col items-center justify-center space-y-2.5 border-t border-white/10 opacity-70 text-center">
          <p className="text-[10px] text-white/50 font-mono tracking-wider">
            © 2026 宜蘭員山契作智慧農耕聯盟 • 雲端區塊鏈防偽認證中
          </p>
          <div className="text-[9px] text-orange-300/80 flex items-center space-x-1.5 font-mono justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
            <span>CONSUMER VERIFICATION PORTALSECURE</span>
          </div>
        </footer>

      </div>

      {/* 🎫 PREMIUM CONSUMER REWARD MODAL OVERLAY (領取專屬獎品彈窗) */}
      <AnimatePresence>
        {claimModalOpen && (
          <div id="modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Soft dark blur filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setClaimModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-[8px]"
            />

            {/* Modal Body Card is fully styled with high quality glassmorphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="glass-panel p-6 w-full max-w-sm relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] border border-orange-500/25 flex flex-col space-y-5"
            >
              {/* Close Button Trigger */}
              <button
                id="btn-close-modal"
                onClick={() => setClaimModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Gift Voucher Logo */}
              <div className="flex flex-col items-center justify-center space-y-3 pt-2">
                <div className="p-3.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 flex items-center justify-center animate-bounce duration-[4000ms]">
                  <Gift className="w-7 h-7 text-orange-300" />
                </div>
                
                <h3 className="font-display font-bold text-center text-lg text-white">
                  {selectedCrop.reward.title}
                </h3>
                <span className="text-[10px] text-orange-300 font-mono tracking-widest font-semibold uppercase">
                  {selectedCrop.reward.subtitle}
                </span>
              </div>

              {/* Promo Coupon Body Details */}
              <div className="p-4 rounded-xl bg-black/45 border border-white/10 flex flex-col items-center justify-center space-y-3.5 text-center">
                <span className="text-[11px] text-white/50 tracking-wider">折抵權益價值</span>
                
                {/* Premium Golden Label */}
                <div className="text-xl font-bold tracking-wider font-display text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-100 to-orange-200">
                  {selectedCrop.reward.claimValue}
                </div>

                {/* Simulated dynamic QR code (Using pure SVG lines for high precision and native representation) */}
                <div className="p-2.5 bg-white rounded-lg inline-block shadow-md">
                  <svg id="coupon-qrcode" viewBox="0 0 100 100" className="w-24 h-24 text-black">
                    <rect x="0" y="0" width="25" height="25" fill="black" />
                    <rect x="5" y="5" width="15" height="15" fill="white" />
                    <rect x="9" y="9" width="7" height="7" fill="black" />

                    <rect x="75" y="0" width="25" height="25" fill="black" />
                    <rect x="80" y="5" width="15" height="15" fill="white" />
                    <rect x="84" y="9" width="7" height="7" fill="black" />

                    <rect x="0" y="75" width="25" height="25" fill="black" />
                    <rect x="5" y="80" width="15" height="15" fill="white" />
                    <rect x="9" y="84" width="7" height="7" fill="black" />

                    <rect x="35" y="10" width="15" height="5" fill="black" />
                    <rect x="60" y="10" width="5" height="20" fill="black" />
                    <rect x="35" y="25" width="10" height="10" fill="black" />
                    <rect x="50" y="35" width="25" height="5" fill="black" />
                    <rect x="40" y="50" width="20" height="15" fill="black" />
                    <rect x="10" y="40" width="15" height="5" fill="black" />
                    <rect x="70" y="60" width="15" height="15" fill="black" />
                    <rect x="75" y="80" width="10" height="10" fill="black" />
                    <rect x="35" y="75" width="15" height="5" fill="black" />
                    <rect x="55" y="85" width="10" height="10" fill="black" />
                  </svg>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-[9px] text-white/30 font-mono tracking-wider">兌換碼 Promo Code</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/5 rounded text-xs font-mono text-indigo-200 font-semibold uppercase select-all">
                    {selectedCrop.reward.promoCode}
                  </span>
                </div>
              </div>

              {/* Explanation note */}
              <div className="flex flex-col space-y-1.5 text-center">
                <p className="text-[11px] text-white/70 leading-relaxed font-light">
                  {selectedCrop.reward.description}
                </p>
                <div className="text-[9px] text-white/35 font-light pt-1 border-t border-white/5 scale-95 font-sans leading-relaxed">
                  使用規範: {selectedCrop.reward.terms}
                </div>
              </div>

              {/* Confirm Bottom Trigger */}
              <button
                id="btn-confirm-redeem"
                onClick={() => {
                  setClaimedAwards(prev => ({ ...prev, [selectedCrop.id]: true }));
                  setClaimModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-white bg-white/10 hover:bg-white/15 border border-white/10 active:scale-95 duration-200 cursor-pointer text-center outline-none"
              >
                確定
              </button>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* 🔮 SCIENTIFIC GASHAPON TOY MACHINE MODAL OVERLAY */}
      <AnimatePresence>
        {gashaponOpen && (
          <div id="gashapon-backdrop" className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            
            {/* Ambient overlay blur background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (gashaponStage !== 'rolling') setGashaponOpen(false);
              }}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-[12px]"
            />

            {/* Immersive interactive vintage-style physical capsule toy body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 35 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-panel p-6 w-full max-w-sm relative z-10 shadow-[0_30px_70px_rgba(99,102,241,0.25)] border border-purple-500/35 bg-gradient-to-b from-[#0f1128] to-[#050612] bg-[#0d0f22]/95 flex flex-col space-y-5 rounded-[28px] overflow-hidden"
            >
              {/* Close Button (only displayed if not actively spinning) */}
              {gashaponStage !== 'rolling' && (
                <button
                  id="btn-close-gashapon"
                  onClick={() => setGashaponOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Machine Header */}
              <div className="flex flex-col items-center text-center space-y-1.5 pt-2">
                <span className="px-3 py-1 bg-indigo-500/25 text-indigo-200 border border-indigo-500/30 text-[9px] font-mono tracking-widest rounded-full uppercase leading-none font-bold">
                  SENSING GASHAPON
                </span>
                <h3 className="font-display font-black text-xl text-white tracking-wide uppercase">
                  智慧小農補給站・扭蛋機
                </h3>
                <p className="text-[11px] text-indigo-200/70 font-light max-w-[85%]">
                  集滿七日大田氣候足跡，扭動黃金手把隨機抽契作極鮮特選好禮！
                </p>
              </div>

              {/* Physical Glass Chamber display container */}
              <div id="gashapon-glass-cage" className="relative aspect-[4/3] rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center p-4">
                
                {/* Shiny glass reflection cover overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-10" />

                {/* Idle Phase Capsule Ball physics layout visualization */}
                {gashaponStage === 'idle' && (
                  <div className="relative w-full h-full flex flex-wrap gap-2.5 items-center justify-center content-center opacity-90">
                    {['🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '💖', '⭐', '🌈', '🔮'].map((emoji, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, Math.sin(i) * 6, 0],
                          x: [0, Math.cos(i) * 5, 0],
                          rotate: [0, i % 2 === 0 ? 12 : -12]
                        }}
                        transition={{
                          duration: 2.0 + (i * 0.18),
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-2xl select-none leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] cursor-default"
                      >
                        {emoji}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Spinning shake phase of physical gashapon */}
                {gashaponStage === 'rolling' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                    <motion.div
                      animate={{
                        x: [-7, 7, -5, 5, -2, 2, 0],
                        y: [-5, 5, -7, 7, -3, 3, 0],
                        rotate: [-14, 14, -8, 8, -4, 4, 0]
                      }}
                      transition={{
                        duration: 0.2,
                        repeat: 12,
                        ease: "linear"
                      }}
                      className="text-5xl select-none leading-none"
                    >
                      🎰🌀✨
                    </motion.div>
                    
                    {/* Concentric rotating glowing ring */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-24 h-24 rounded-full border-4 border-dashed border-indigo-400/20 animate-spin" />
                    </div>
                  </div>
                )}

                {/* Revealed prize phase */}
                {gashaponStage === 'revealed' && gashaponPrize && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: [0, 1.25, 1], rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="flex flex-col items-center justify-center space-y-2.5 text-center"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="text-6.5xl animate-bounce select-none leading-none z-10">
                        {gashaponPrize.icon}
                      </span>
                      <div className="absolute w-16 h-16 bg-indigo-400/20 rounded-full blur-xl animate-pulse" />
                      <span className="absolute -top-3 -left-3 text-sm animate-pulse">✨</span>
                      <span className="absolute -bottom-2 -right-3 text-sm animate-pulse delay-500">✨</span>
                    </div>
                    
                    <span className="text-[9px] text-indigo-300 font-mono tracking-widest uppercase leading-none font-bold">
                      CONGRATULATIONS!
                    </span>
                    <h4 className="text-white font-bold leading-tight font-display text-base">
                      {gashaponPrize.title}
                    </h4>
                  </motion.div>
                )}
                
                {/* Dispenser lower chute boundary */}
                <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-neutral-900 to-transparent border-t border-white/5" />
              </div>

              {/* Mechanical dial knob control station */}
              <div className="flex flex-col items-center justify-center py-2.5 relative">
                {gashaponStage === 'idle' && (
                  <motion.button
                    onClick={drawGashapon}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 border-4 border-neutral-900 shadow-[0_6px_22px_rgba(99,102,241,0.65)] flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-90 duration-100 z-10 group"
                  >
                    <RotateCw className="w-7 h-7 text-white font-bold transition-transform duration-500 group-hover:rotate-180" />
                  </motion.button>
                )}

                {gashaponStage === 'rolling' && (
                  <div className="w-16 h-16 rounded-full bg-neutral-900 border-4 border-black/50 flex items-center justify-center shadow-inner">
                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {gashaponStage === 'revealed' && (
                  <button
                    onClick={() => {
                      setGashaponStage('idle');
                      setGashaponPrize(null);
                      drawGashapon();
                    }}
                    className="text-[10px] px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-200 border border-white/10 uppercase tracking-widest font-display flex items-center space-x-1.5 font-bold cursor-pointer transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-indigo-300" />
                    <span>再扣一次！</span>
                  </button>
                )}

                <div className="text-[8px] text-white/30 tracking-widest font-mono uppercase mt-2.5">
                  {gashaponStage === 'idle' ? 'TWIST KNOB TO SPIN' : gashaponStage === 'rolling' ? 'ROUNDS ARE ROLLING...' : 'CAPSULE POPPED!'}
                </div>
              </div>

              {/* Redraw prize receipt details card */}
              {gashaponStage === 'revealed' && gashaponPrize && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-black/45 border border-white/5 text-center flex flex-col space-y-2 shadow-inner"
                >
                  <p className="text-xs text-white/80 leading-relaxed font-light">
                    {gashaponPrize.detail}
                  </p>
                  
                  <div className="pt-2 flex flex-col items-center justify-center space-y-1">
                    <span className="text-[8px] text-white/30 font-mono tracking-wider">產地專屬認證密鑰 SECURE CODE</span>
                    <span className="px-2.5 py-0.5 bg-indigo-400/10 border border-indigo-400/20 text-indigo-300 rounded font-mono text-[10px] uppercase font-bold tracking-widest select-all">
                      GF-{Math.floor(1000 + Math.random() * 9000)}-{selectedCrop.id.substring(0,3).toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Footer validation dismissal button */}
              <button
                onClick={() => {
                  if (gashaponStage !== 'rolling') {
                    setGashaponOpen(false);
                  }
                }}
                disabled={gashaponStage === 'rolling'}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-center border transition-all ${
                  gashaponStage === 'rolling'
                    ? 'bg-neutral-800 border-neutral-700/50 text-neutral-500 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/15 border-white/10 text-white cursor-pointer active:scale-95 duration-100'
                }`}
              >
                {gashaponStage === 'revealed' ? '收下禮物卡，返回田園' : '關閉'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔮 SCIENTIFIC SCANNER MODAL OVERLAY (作物 QR code 相機掃描彈窗) */}
      <AnimatePresence>
        {scannerOpen && (
          <div id="scanner-backdrop" className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Ambient overlay blur background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setScannerOpen(false)}
              className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[10px]"
            />

            {/* Immersive high-tech interactive body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="glass-panel p-6 w-full max-w-md relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-orange-500/20 bg-[#0a1020]/95 flex flex-col space-y-5 rounded-[28px]"
            >
              {/* Top Row Title details */}
              <div className="flex justify-between items-start pb-2 border-b border-white/5">
                <div className="flex items-center space-x-2 text-orange-200">
                  <Camera className="w-5 h-5 text-orange-400 animate-pulse" />
                  <div className="flex flex-col text-left">
                    <h3 className="font-display font-medium text-sm tracking-widest text-white leading-none">智慧園區掃描儀</h3>
                    <span className="text-[8px] text-orange-300/60 uppercase tracking-widest font-mono mt-0.5 leading-none">Automated tag decoder</span>
                  </div>
                </div>
                
                <button
                  id="btn-close-scanner"
                  onClick={() => setScannerOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Viewfinder Window screen */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 shadow-inner flex flex-col items-center justify-center text-center">
                
                {/* Moving grid overlay background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:15px_15px]" />
                
                {scanningActive ? (
                  <>
                    {/* Viewfinder corner brackets using styled absolute elements */}
                    <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-orange-400 rounded-tl-sm" />
                    <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-orange-400 rounded-tr-sm" />
                    <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-orange-400 rounded-bl-sm" />
                    <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-orange-400 rounded-br-sm" />
                    
                    {/* Continuous scrolling laser beam line */}
                    <motion.div
                      animate={{ top: ['20%', '80%', '20%'] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                      className="absolute left-[10%] right-[10%] h-0.5 bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)] z-10"
                    />

                    {/* Central Target Viewfinder Box */}
                    <div className="w-44 h-44 border border-dashed border-white/20 rounded-xl flex items-center justify-center relative bg-white/[0.01]">
                      {/* Interactive pulsing focus ring */}
                      <div className="absolute inset-3 border border-orange-500/20 rounded-lg animate-ping duration-[3000ms]" />
                      <QrCode className="w-16 h-16 text-white/15 animate-pulse" />
                    </div>

                    <p className="absolute bottom-6 text-[10px] text-orange-200/50 font-mono tracking-widest uppercase">
                      尋找作物 QR 碼生長插籤...
                    </p>
                  </>
                ) : (
                  /* Decoded state */
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-5 flex flex-col items-center justify-center space-y-3 z-10"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Check className="w-8 h-8 stroke-[3.5px]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-300 font-display uppercase tracking-widest">解碼成功 !</h4>
                      <p className="text-[10px] text-white/40 font-mono mt-1">SIGNATURE SHA-256 SECURED</p>
                    </div>
                    
                    <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-orange-200">
                      已載入 履歷資料
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Garden Stakes Selector (The interactive garden tags to click and scan with scroll limits) */}
              <div className="flex flex-col space-y-2">
                <span className="text-[10px] text-white/40 tracking-wider font-display text-left">作物生長插籤掛牌 (模擬晶片對準鏡頭)</span>
                
                <div id="simulated-tags" className="max-h-[190px] overflow-y-auto pr-1 flex flex-col space-y-1.5 scrollbar-thin scrollbar-thumb-orange-500/20">
                  {cropDatabase.map((crop) => {
                    const isSelected = selectedCrop.id === crop.id;
                    return (
                      <button
                        key={crop.id}
                        id={`btn-scan-sim-${crop.id}`}
                        onClick={() => {
                          if (!scanningActive) return;
                          
                          // Trigger Scan Action sequence
                          playScanBeep();
                          setScanningActive(false);
                          
                          // Set success target crop and switch active crop profile after a delay
                          setSelectedCrop(crop);
                          
                          setTimeout(() => {
                            setScannerOpen(false);
                          }, 1300);
                        }}
                        disabled={!scanningActive}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-300 ${
                          isSelected 
                            ? 'bg-orange-500/15 border-orange-500/40 text-white' 
                            : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:border-white/10 hover:text-white'
                        } cursor-pointer`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {/* Mini QR Tag representation */}
                          <div className="p-1.5 bg-neutral-950 border border-white/10 rounded-lg flex items-center justify-center text-white/80">
                            <QrCode className="w-3.5 h-3.5 text-orange-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-semibold tracking-wide">{crop.name.replace(/\s+/g, '')}</span>
                            <span className="text-[8px] font-mono text-white/35">
                              {crop.id === 'sweet-basil' && 'BLOCK-02Y / BAS-1A'}
                              {crop.id === 'cherry-tomato' && 'BLOCK-04R / TOM-2B'}
                              {crop.id === 'royal-mint' && 'BLOCK-01B / MIN-1C'}
                              {crop.id === 'golden-pineapple' && 'BLOCK-05P / PIN-3A'}
                              {crop.id === 'alpine-cabbage' && 'BLOCK-06C / CAB-4D'}
                              {crop.id === 'kyoho-grape' && 'BLOCK-07G / GRA-5E'}
                              {crop.id === 'sweet-corn' && 'BLOCK-08M / COR-6F'}
                              {crop.id === 'water-bamboo' && 'BLOCK-09W / BAM-7G'}
                              {crop.id === 'green-broccoli' && 'BLOCK-10K / BRO-8H'}
                              {crop.id === 'mountain-apple' && 'BLOCK-11A / APL-9I'}
                            </span>
                          </div>
                        </div>

                        <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-display uppercase tracking-widest text-orange-300">
                          點選對準
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanatory footer note */}
              <p className="text-[10px] text-white/40 font-light text-center leading-relaxed">
                對準農場中隨作物設立的契作插籤掛牌 QR Code，<br />
                即可零遲延同步更新讀取當前生長數據與履歷。
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔐 USER AUTHENTICATION MODAL OVERLAY (登入/註冊) */}
      <AnimatePresence>
        {authModalOpen && (
          <div id="auth-backdrop" className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Ambient overlay blur background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[10px]"
            />

            {/* Glassmorphic register/login card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="glass-panel p-6 w-full max-w-sm relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-indigo-500/20 bg-[#090e1c]/95 flex flex-col space-y-5 rounded-[28px]"
            >
              {/* Close Button & Title */}
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center space-x-2 text-indigo-300">
                  <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <User className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="font-display font-medium text-sm tracking-widest text-white leading-none">
                      {authMode === 'login' ? '會員登入' : '註冊新帳號'}
                    </h3>
                    <span className="text-[8px] text-indigo-300/60 uppercase tracking-widest font-mono mt-0.5 leading-none">
                      {authMode === 'login' ? 'Access your account' : 'Create new profile'}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-close-auth"
                  onClick={() => setAuthModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Switch Tabs */}
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                    setAuthSuccessMsg('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    authMode === 'login'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-white/40 hover:text-white/60'
                  } cursor-pointer`}
                >
                  登入
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                    setAuthSuccessMsg('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    authMode === 'register'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-white/40 hover:text-white/60'
                  } cursor-pointer`}
                >
                  註冊
                </button>
              </div>

              {/* Status messages / Toast like banners */}
              {authError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center"
                >
                  ⚠️ {authError}
                </motion.div>
              )}
              {authSuccessMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center font-medium"
                >
                  {authSuccessMsg}
                </motion.div>
              )}

              {/* Main Submit Form */}
              <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="flex flex-col space-y-4">
                
                {authMode === 'register' && (
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] text-white/45 tracking-wider uppercase font-medium text-left">姓名 Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        placeholder="請輸入您的姓名"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.05] border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-white/45 tracking-wider uppercase font-medium text-left">電子郵件 Email</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.05] border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-white/45 tracking-wider uppercase font-medium text-left">密碼 Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-white/30" />
                    <input
                      type="password"
                      placeholder="請輸入密碼 (最少 6 碼)"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.05] border border-white/10 hover:border-white/20 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Submit trigger button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-medium text-xs tracking-wider uppercase shadow-[0_4px_16px_rgba(99,102,241,0.25)] active:scale-95 duration-100 cursor-pointer mt-2"
                >
                  {authMode === 'login' ? '登入帳戶' : '註冊並登入'}
                </button>
              </form>

              {/* Demo accounts hint tip if in login mode */}
              {authMode === 'login' && (
                <div className="pt-2 border-t border-white/5 text-center flex flex-col space-y-1">
                  <span className="text-[8px] text-white/30 font-mono tracking-wider">DEMO ACCOUNT</span>
                  <div className="flex items-center justify-center space-x-2 text-[9px] text-[#8ea4df]/75 font-mono select-all">
                    <span>Email: demo@example.com</span>
                    <span>•</span>
                    <span>密碼: password123</span>
                  </div>
                </div>
              )}

              {/* Form switch trigger */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthError('');
                    setAuthSuccessMsg('');
                  }}
                  className="text-[10px] text-indigo-300 hover:text-indigo-200 hover:underline cursor-pointer"
                >
                  {authMode === 'login' ? '還沒有帳號？立即註冊' : '已經有帳號了？點此登入'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
