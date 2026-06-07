export interface CropReward {
  title: string;
  subtitle: string;
  description: string;
  claimValue: string;
  promoCode: string;
  terms: string;
}

export interface MetricData {
  time: string;
  temperature: number; // °C
  humidity: number;    // %
  light: number;       // lux
  soilMoisture: number;// %
}

export interface FarmerLog {
  date: string;
  stage: string;
  action: string;
  detail: string;
  iconType: 'sprout' | 'droplet' | 'sun' | 'clipboard' | 'award';
}

export interface CropProfile {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  batchNo: string; // Batch code, e.g. "BAS-2026-05A" or "新苗孕育中"
  startDate: string; // e.g. "05.29"
  location: string;
  farmerName: string;
  farmerPhilosophy: string;
  triviaList: string[]; // List of agricultural trivia
  photoUrl: string;
  triviaTitle: string; // Secondary botanical label
  reward: CropReward;
  metrics: MetricData[];
  logs: FarmerLog[];
}

export const cropDatabase: CropProfile[] = [
  {
    id: "sweet-basil",
    name: "有 機 甜 九 層 塔",
    scientificName: "Ocimum basilicum 'Sweet'",
    category: "香草藥用植物",
    batchNo: "BAS-2026-05A",
    startDate: "05.29",
    location: "宜蘭員山有機認證二號棚",
    farmerName: "陳建國 (老建叔)",
    farmerPhilosophy: "以天然草本酵素驅蟲，給九層塔喝雪山純淨山泉水，每一片都飽含日光的能量。",
    triviaTitle: "九層塔",
    triviaList: [
      "「九層塔」因其花序重重疊疊如寶塔般而得名，其實它就是羅勒家族的重要一員！",
      "九層塔富含維生素A、C及多種礦物質，其中的精油成分能帶來令人放鬆的獨特香氣。",
      "在烹調最後一刻才加入九層塔，能完美保留其揮發性香氣，使其風味發揮到極致。",
      "我們農場在九層塔旁混種了萬壽菊，利用天然氣味建立起昆蟲害物理屏障，完全不施農藥。",
      "九層塔喜溫怕冷，當氣溫低於 12°C 時需要特別開啟暖風保溫以防凍傷葉緣。"
    ],
    photoUrl: "https://images.unsplash.com/photo-1618386229616-5777df480746?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "新鮮草本好禮",
      description: "感謝您支持在地小農，送您一份專屬回饋禮！憑此券至契作市集，即刻享有頂級小農精品折抵扣，或免費兌換新鮮有機小香草束一份！",
      claimValue: "NT$ 50 折折抵券",
      promoCode: "BASILSMART2026",
      terms: "限單次兌換，本券不記名且不可折現。使用期限至 2026.12.31 止。"
    },
    metrics: [
      { time: "06:00", temperature: 22.4, humidity: 82, light: 1200, soilMoisture: 68 },
      { time: "09:00", temperature: 25.8, humidity: 75, light: 4500, soilMoisture: 65 },
      { time: "12:00", temperature: 28.5, humidity: 68, light: 8500, soilMoisture: 62 },
      { time: "15:00", temperature: 27.2, humidity: 70, light: 6200, soilMoisture: 60 },
      { time: "18:00", temperature: 24.1, humidity: 78, light: 1500, soilMoisture: 64 },
      { time: "21:00", temperature: 21.9, humidity: 85, light: 0, soilMoisture: 66 }
    ],
    logs: [
      { date: "05.29", stage: "幼苗定植", action: "溫室定植與微噴灌溉", detail: "選拔高10cm強健幼苗進行有機定植，施用雪山活水泉微灌15分鐘。", iconType: "sprout" },
      { date: "05.21", stage: "苗床管理", action: "天然稻草覆蓋保水", detail: "於育苗床覆蓋一層薄稻草，防止水分蒸發，促進根系穩固健全。", iconType: "droplet" },
      { date: "05.15", stage: "土壤整置", action: "有機自製堆肥與土壤活性化", detail: "混合稻殼、蔗渣與草本酵素活性菌堆肥，為土壤注入滿滿微量元素與好菌。", iconType: "clipboard" }
    ]
  },
  {
    id: "cherry-tomato",
    name: "無 毒 紅 聖 女 番 茄",
    scientificName: "Solanum lycopersicum var. cerasiforme",
    category: "茄科蔓生作物",
    batchNo: "TOM-2026-05C",
    startDate: "05.20",
    location: "宜蘭員山日光風感三號溫室",
    farmerName: "李大同 (大同班長)",
    farmerPhilosophy: "實施『一株一雙果』精緻疏果，利用黑糖酵母液肥灌溉，孕育皮薄多汁、酸甜比完美的鮮甜番茄。",
    triviaTitle: "聖女小番茄",
    triviaList: [
      "聖女番茄在充足陽光下會累積大量茄紅素，這是一種極佳的天然抗氧化營養素！",
      "溫室栽培的秘訣是控制早晚溫差，適度的溫差能讓小番茄的糖分高度濃縮入果肉。",
      "小番茄其實是在樹上「轉色」的。我們堅持等到九分熟、果蒂周圍轉金橙紅才親手採收。",
      "採用熊蜂授粉技術，取代傳統人工作業，讓授粉更自然、果型更圓潤完美。"
    ],
    photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "溫室鮮果體驗",
      description: "感謝您支持在地小農，送您一份專屬回饋禮！憑券至大同鮮果園區可享『採果DIY 85折』，並加贈當日限定鮮榨番茄梅子冰飲一杯！",
      claimValue: "採果之旅 85 折體驗券",
      promoCode: "TOMATOMAGIC",
      terms: "需提前一日預約。入園須遵守果園摘採規範，效期至 2026 採收季結束。"
    },
    metrics: [
      { time: "06:00", temperature: 21.1, humidity: 80, light: 1500, soilMoisture: 58 },
      { time: "09:00", temperature: 26.2, humidity: 70, light: 5200, soilMoisture: 55 },
      { time: "12:00", temperature: 29.8, humidity: 59, light: 9500, soilMoisture: 52 },
      { time: "15:00", temperature: 28.1, humidity: 62, light: 7100, soilMoisture: 50 },
      { time: "18:00", temperature: 23.5, humidity: 74, light: 1800, soilMoisture: 53 },
      { time: "21:00", temperature: 20.2, humidity: 82, light: 0, soilMoisture: 56 }
    ],
    logs: [
      { date: "05.20", stage: "攀藤引導", action: "架設高密度攀枝網", detail: "為番茄蔓莖綁縛柔性編織繩，引導其有序向上攀爬，確保每一側都有極佳採光。", iconType: "sun" },
      { date: "05.12", stage: "側芽摘除", action: "人工整枝與修葉", detail: "抹除第一花序下方的強盛側芽，集中養分至主藤，保持底層空氣流通，減少濕氣積聚。", iconType: "clipboard" },
      { date: "05.04", stage: "生態定植", action: "黑糖酵母益菌肥養根", detail: "幼苗下地定植，並精準澆灌自行發酵的黑糖酵母液肥，促發健康白根。", iconType: "sprout" }
    ]
  },
  {
    id: "royal-mint",
    name: "頂 級 綠 薄 荷",
    scientificName: "Mentha spicata 'Royal Green'",
    category: "脣形科多年生香草",
    batchNo: "新苗孕育中",
    startDate: "05.30",
    location: "宜蘭雪山高冷風感林蔭區",
    farmerName: "張雅婷 (雅婷姐)",
    farmerPhilosophy: "讓薄荷在半遮陰的高山林蔭中自然深吸山嵐微風，淬鍊出極具穿透力、純淨涼爽的綠薄荷醇。",
    triviaTitle: "綠薄荷",
    triviaList: [
      "綠薄荷的清涼感來自於其中高純度的薄荷腦成分，嗅吸其香氣能令人瞬間神清氣爽。",
      "薄荷是出了名的好動分子！為了避免它野生侵佔其他作物，我們全部採用深盆陶土獨立盆栽栽培。",
      "高山遮陰環境能延緩薄荷纖維化，使得摘取下來的頂部一芯二葉極為嫩綠，入口即化。"
    ],
    photoUrl: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "山林香草提神體驗",
      description: "感謝您支持在地小農，送您一份專屬回饋禮！憑券至張雅婷薄荷工作坊，可享薄荷盆栽 DIY 買一送一，現場還可以免費品嚐現沖山泉薄荷氣泡飲！",
      claimValue: "薄荷盆栽 DIY 買一送一",
      promoCode: "MINTSPOK26",
      terms: "限平日兌換使用。每人限持乙張，請於兌換時向櫃檯出示本條碼介面。"
    },
    metrics: [], // Empty initially to show organic wait prompt!
    logs: []     // Empty initially to show organic wait prompt!
  },
  {
    id: "golden-pineapple",
    name: "安心香甜 金鑽鳳梨",
    scientificName: "Ananas comosus 'Tainung No.17'",
    category: "鳳梨科熱帶水果",
    batchNo: "PIN-2026-04B",
    startDate: "04.18",
    location: "屏東大武山暖陽排水緩坡",
    farmerName: "吳茂林 (茂林伯)",
    farmerPhilosophy: "堅持不用植物生長調節劑（催熟賀爾蒙），讓鳳梨在南台灣烈日下自然熟成吐露焦糖果香。",
    triviaTitle: "金鑽鳳梨",
    triviaList: [
      "鳳梨其實不是單一一個果實，而是由上百個不開花的小果聚集在一起形成的「聚花果」！",
      "金鑽鳳梨（台農17號）果肉特別細緻、酸度低纖維細，甚至連中心最硬的「鳳梨心」都可以直接爽脆食用。",
      "鳳梨中含有豐富的「鳳梨酵素」（Bromelain），它能幫助分解蛋白質，因此非常適合飯後當作消化水果！",
      "挑選鳳梨時可以輕彈果實：聲音緊實沉重如「肉聲」的表示水分多、甜度高；而清脆呈「鼓聲」的較耐放、香氣更清雅。",
      "在種植鳳梨時，農夫會給每顆鳳梨戴上「防曬遮陽帽」（用紙袋或塑膠套遮蓋），這是為了避免南台灣猛烈陽光曬傷嬌嫩的外皮。"
    ],
    photoUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "鳳梨原鄉焦糖好禮",
      description: "感謝您掃描大武山純淨認證金鑽鳳梨！憑此兌換券，前往茂林伯自營產地農場，即可免費獲得新鮮手作的「古法無糖金鑽鳳梨乾」一包，或享現場整箱鮮果免運配回府！",
      claimValue: "手作金鑽鳳梨乾免費兌換券",
      promoCode: "PINEAPPLEPINE",
      terms: "本券不找零、不折現，每人每次限兌換一包，有效期限至 2026.11.30 止。"
    },
    metrics: [
      { time: "06:00", temperature: 24.5, humidity: 85, light: 2000, soilMoisture: 45 },
      { time: "09:00", temperature: 29.2, humidity: 75, light: 6500, soilMoisture: 42 },
      { time: "12:00", temperature: 33.1, humidity: 60, light: 10500, soilMoisture: 40 },
      { time: "15:00", temperature: 31.8, humidity: 62, light: 8200, soilMoisture: 38 },
      { time: "18:00", temperature: 27.4, humidity: 74, light: 2200, soilMoisture: 41 },
      { time: "21:00", temperature: 25.0, humidity: 80, light: 0, soilMoisture: 44 }
    ],
    logs: [
      { date: "05.28", stage: "果實防曬", action: "手工套袋戴防曬帽", detail: "屏東高溫烈日來臨，為防止果肉變質曬黑，全園手工為露出鳳梨冠套上遮光防曬帽。", iconType: "sun" },
      { date: "05.10", stage: "追肥管理", action: "高鉀有機堆肥追施", detail: "於果實發育關鍵期，施用純天然有機菜籽粕高鉀液肥，能大幅提升金鑽鳳梨獨特的果香與糖酸比。", iconType: "clipboard" },
      { date: "04.18", stage: "萌芽開花", action: "高山天然活水灌溉點滴", detail: "春季抽穗開花階段，引大武山無污染湧泉，採用滴灌系統精準浸潤鳳梨根系，預防乾旱果皮龜裂。", iconType: "droplet" }
    ]
  },
  {
    id: "alpine-cabbage",
    name: "高 山 甜 脆 高 麗 菜",
    scientificName: "Brassica oleracea var. capitata",
    category: "十字花科葉菜類",
    batchNo: "CAB-2026-05E",
    startDate: "05.12",
    location: "宜蘭大同鄉高海拔冷霧區",
    farmerName: "林忠信 (信伯)",
    farmerPhilosophy: "利用梨山極大晝夜溫差，高山冷泉自然灌溉，讓水分與甜度高度鎖在緊密結球的菜心中，咬下極致甘脆清甜。",
    triviaTitle: "高山高麗菜",
    triviaList: [
      "高山高麗菜因為白天日照溫暖、夜晚高海拔低溫，呼吸作用減弱，使大量光合作用產生的澱粉直接轉化為糖分儲存在葉片中！",
      "高麗菜原產於地中海沿岸，屬十字花科植物，內含強抗氧能力的「維生素U」（甲硫丁氨酸），對於胃黏膜修復非常有益。",
      "優質高麗菜結球飽滿有彈性，雙手托起感覺沉甸甸的最佳；而高山種因為高溫差結球呈圓錐尖塔型（或微尖），普通平地種則多呈圓扁形。",
      "我們農場在田埂四周遍植九層塔與薄荷，藉由天然薄荷精油與氣味驅避十字花科特有的紋白蝶與蚜蟲，建立綠色安全屏障。"
    ],
    photoUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "鮮脆菜王產地好禮",
      description: "感謝您支持大同高山無毒契作高麗菜！憑此券於大同契作合作社或農圃櫃檯，每購買一箱精美小農蔬菜，可直接出示本券免費加贈無農藥翠綠高山高麗菜一大顆！",
      claimValue: "高山鮮美高麗菜免費兌換",
      promoCode: "CRISPYCABBAGE",
      terms: "限大同信伯產區實體合作社現場兌換，視每日精選採收量而定，效期至 2026.11.15 止。"
    },
    metrics: [
      { time: "06:00", temperature: 14.8, humidity: 95, light: 800, soilMoisture: 72 },
      { time: "09:00", temperature: 18.2, humidity: 82, light: 3800, soilMoisture: 68 },
      { time: "12:00", temperature: 21.5, humidity: 70, light: 7500, soilMoisture: 65 },
      { time: "15:00", temperature: 19.8, humidity: 75, light: 5200, soilMoisture: 64 },
      { time: "18:00", temperature: 16.1, humidity: 88, light: 1000, soilMoisture: 69 },
      { time: "21:00", temperature: 13.5, humidity: 92, light: 0, soilMoisture: 71 }
    ],
    logs: [
      { date: "05.28", stage: "結球初期", action: "追施有機黃豆粉複合肥", detail: "開始捲葉結球時，於根部追施發酵黃豆粉與海藻有機精華，提供豐富植物性氮素，使球心層層飽滿肥厚。", iconType: "clipboard" },
      { date: "05.20", stage: "人工抓蟲", action: "晨間徒手清除小菜蛾", detail: "清晨趁冷霧未散透，人工撥開菜葉，逐一清除初生小菜蛾幼蟲與斜紋夜蛾卵塊，完全避免化學噴藥。", iconType: "sprout" },
      { date: "05.12", stage: "高山定植", action: "高山雪水微霧引流灌溉", detail: "利用高山冷裂雪水開闢微型重力微噴頭，灌溉嫩苗，降低定植後曝曬高熱，大幅提高蔬菜幼苗成活率。", iconType: "droplet" }
    ]
  },
  {
    id: "kyoho-grape",
    name: "巨 峰 紫 晶 葡 萄",
    scientificName: "Vitis vinifera 'Kyoho'",
    category: "葡萄科落葉木質藤本",
    batchNo: "GRA-2026-05F",
    startDate: "05.10",
    location: "苗栗卓蘭向陽石礫排水優量區",
    farmerName: "趙自強 (強哥)",
    farmerPhilosophy: "實施網室栽植不除草（草生栽培），每串限制留果35-40粒，堅持每一顆果粒都覆蓋純淨天然果粉，甜度高達18度以上！",
    triviaTitle: "巨峰葡萄",
    triviaList: [
      "葡萄外皮上那一層厚厚、均勻的白粉並不是農藥，而是葡萄自身分泌的「天然果粉」（Bloom），含有珍貴的植物酵母與花青素，是極佳的天然保護層！",
      "巨峰葡萄原產於日本，有「葡萄之王」的美譽。完美的果實標準是果粒紫黑發亮、果蒂緊密、口感Q彈帶有濃郁獨特的荔枝與蜂蜜香氣。",
      "我們農場採用「草生栽培」，不在果樹下噴灑除草劑，而是定時用割草機割除牧草，讓牧草在土壤表面腐爛形成天然綠肥，維持優良的土壤通氣性。",
      "在洗巨峰葡萄時，建議連梗剪下，保留果蒂再用清水緩緩沖洗，避免水分滲入果肉中導致糖分流失或風味變淡。"
    ],
    photoUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "紫晶葡萄極致好禮",
      description: "感謝您親臨卓蘭網室，掃描契作巨峰葡萄晶亮成果！憑本券前往趙大強網室果園，購買原裝手提禮盒兩箱，即可當場由農夫招待現摘手採巨峰葡萄「自選一整串（市價$150）」直接帶走！",
      claimValue: "現摘產地巨峰葡萄整串帶走券",
      promoCode: "KYOHOMAGIC2026",
      terms: "限卓蘭趙自強葡萄園區親自摘取兌換。不與其他現場團體優惠並用，有效期限至 2026.10.15 止。"
    },
    metrics: [
      { time: "06:00", temperature: 23.1, humidity: 82, light: 1800, soilMoisture: 48 },
      { time: "09:00", temperature: 27.5, humidity: 72, light: 5500, soilMoisture: 45 },
      { time: "12:00", temperature: 31.2, humidity: 55, light: 9200, soilMoisture: 42 },
      { time: "15:00", temperature: 29.5, humidity: 58, light: 7500, soilMoisture: 40 },
      { time: "18:00", temperature: 25.8, humidity: 71, light: 2000, soilMoisture: 43 },
      { time: "21:00", temperature: 23.9, humidity: 78, light: 0, soilMoisture: 46 }
    ],
    logs: [
      { date: "05.25", stage: "果實套袋", action: "手工穿抗蟲防鳥套紙袋", detail: "為防止鳥類、果實蠅啄食及陽光直曬，全園逐串手工精細穿套專用防水防蟲抗UV雙層白色紙袋。", iconType: "sun" },
      { date: "05.15", stage: "疏果作業", action: "每串限留35粒頂級果粒", detail: "果穗套袋前手工疏果，大膽移除擠壓果、畸形果與內側小果粒，使每顆葡萄有充足生長空間，保證糖度集中。", iconType: "clipboard" },
      { date: "05.10", stage: "花後期管理", action: "草生栽培腐植覆蓋與引流", detail: "葡萄花落謝結小青果初期，割草返還綠色地表，保持石礫土壤具有良好排水與微量元素活化。", iconType: "sprout" }
    ]
  },
  {
    id: "sweet-corn",
    name: "無 毒 鮮 甜 水 果 玉 米",
    scientificName: "Zea mays var. saccharata",
    category: "禾本科一年生草本",
    batchNo: "COR-2026-05G",
    startDate: "05.05",
    location: "宜蘭員山澄澈湧泉良質田",
    farmerName: "高阿滿 (阿滿姨)",
    farmerPhilosophy: "「我的玉米是水果、也是零食！」引用純淨蘭陽溪有機湧泉水細心滲洗，堅持不施用任何化學化肥，現折剝開即可生吃，甜如蜜梨！",
    triviaTitle: "水果玉米",
    triviaList: [
      "水果玉米不是基因改造作物，而是透過天然育種技術，阻斷了黃玉米中的澱粉轉化基因，使大部分糖分完整保留在黃白相間的飽滿籽粒中！",
      "玉米上千絲萬縷的「玉米鬚」，其實是玉米的「花柱」！每一條玉米鬚都連結著一顆玉米粒，因此玉米鬚越茂密，這顆玉米結出來的籽粒就越齊全飽滿。",
      "水果玉米極度嬌嫩甜美，是松鼠、果子狸及秋行軍蟲的最愛。我們在田間設置多處太陽能誘蟲器與生防益蟲（赤眼卵蜂），完全不動化學農藥。",
      "剛採收的水果玉米糖分極高，隨著存放時間增加會漸漸轉化為澱粉。所以最美味的吃法是當天採收現吃，爽脆多汁，咬開就像天然的鮮甘果汁！"
    ],
    photoUrl: "https://images.unsplash.com/photo-1551754625-70c994671df0?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "金黃鮮美水果禮券",
      description: "感謝您支持員山無毒永續栽植！憑此券於阿滿姨田野露天市集，消費滿 $300 即可立即現折 $50 開懷回饋，並現場招待親手自折、現剝熱呼呼的契作水果玉米一支！",
      claimValue: "消費折抵 50 元 + 現剝鮮果玉米",
      promoCode: "SWEETCORNLOVE",
      terms: "限阿滿姨作物站實體兌換，每日新鮮熟成玉米數量有限，換完為止。效期至 2026.11.30。"
    },
    metrics: [
      { time: "06:00", temperature: 21.8, humidity: 88, light: 1400, soilMoisture: 70 },
      { time: "09:00", temperature: 25.4, humidity: 78, light: 4800, soilMoisture: 65 },
      { time: "12:00", temperature: 29.1, humidity: 64, light: 8800, soilMoisture: 60 },
      { time: "15:00", temperature: 27.5, humidity: 66, light: 6500, soilMoisture: 58 },
      { time: "18:00", temperature: 23.8, humidity: 80, light: 1600, soilMoisture: 63 },
      { time: "21:00", temperature: 21.5, humidity: 85, light: 0, soilMoisture: 68 }
    ],
    logs: [
      { date: "05.22", stage: "抽雄吐絲", action: "釋放赤眼卵蜂害蟲生防", detail: "玉米頂端抽出雄穗、雌穗吐露玉米鬚為病蟲主要期，定點在葉片背部施放生物天敵赤眼卵蜂，進行無毒自然害蟲壓制。", iconType: "clipboard" },
      { date: "05.14", stage: "疏穗留精一", action: "每株手工摘除多餘幼穗", detail: "秉持高規品質，堅持一株玉米僅保留最頂部最強壯的一個幼穗發育，將中下部多餘的稚嫩玉米筍手工摘除，集中全株湧泉養分。", iconType: "sun" },
      { date: "05.05", stage: "蘭陽定植", action: "天然稻殼碎蓋保濕護根", detail: "於大田定植穴幼苗周遭鋪設炭化稻殼與粗糠，有效控制土傳雜草萌芽，且提供天然矽素，強固玉米莖稈直立。", iconType: "sprout" }
    ]
  },
  {
    id: "water-bamboo",
    name: "埔 里 美 人 茭 白 筍",
    scientificName: "Zizania latifolia",
    category: "禾本科多年生宿根草本",
    batchNo: "BAM-2026-05H",
    startDate: "05.08",
    location: "南投埔里純淨湧泉梯田",
    farmerName: "賴阿生 (阿生師)",
    farmerPhilosophy: "「水質就是美人腿的生命。」引入合歡山清澈冷爽泉水，不使用化學除草劑，施用乳酸菌發酵有機質，孕育出雪白細嫩、甘甜無雙的茭白筍。",
    triviaTitle: "美人腿茭白筍",
    triviaList: [
      "茭白筍外表白嫩如「美人腿」，其實它肥大的莖部並不是天然長成的，而是由「黑穗菌」寄生刺激後，使莖部細胞膨大形成的美味！",
      "如果切開茭白筍看到裡面有黑褐色小點點，千萬不要害怕。那是黑穗菌的黑孢子，對人體完全無害，甚至具有極高的天然抗氧化力喔！",
      "茭白筍含水量極高（達93%以上），熱量非常低，且富含豐富膳食纖維、鉀與維生素，具有清熱利尿、生津止渴之用。",
      "在種植茭白筍時，為了維持生態平衡，阿生師會在水中放養「大肚魚」與天敵昆蟲來防治危害幼筍的福壽螺，達成完美的無化學農藥共生體系。"
    ],
    photoUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "冷泉美人鮮筍好禮",
      description: "感謝您支持埔里無毒冷泉契作茭白筍！憑本券至埔里阿生師示範農場，購買現場現採茭白筍一箱，即可現折 $50 元，並免費贈送現烤甘甜茭白筍兩支（香甜多汁，產地限定）！",
      claimValue: "消費現折 50 元 + 現烤美人筍兩支",
      promoCode: "BAMBOOBEAUTY",
      terms: "限埔里本園產地現場折抵與兌換，不可兌換現金，有效期至 2026.11.30。"
    },
    metrics: [
      { time: "06:00", temperature: 20.2, humidity: 90, light: 1000, soilMoisture: 85 },
      { time: "09:00", temperature: 24.5, humidity: 80, light: 4200, soilMoisture: 82 },
      { time: "12:00", temperature: 27.8, humidity: 68, light: 8000, soilMoisture: 80 },
      { time: "15:00", temperature: 26.1, humidity: 72, light: 5800, soilMoisture: 78 },
      { time: "18:00", temperature: 22.4, humidity: 84, light: 1200, soilMoisture: 81 },
      { time: "21:00", temperature: 20.5, humidity: 88, light: 0, soilMoisture: 84 }
    ],
    logs: [
      { date: "05.24", stage: "生態防治", action: "放養福壽螺天敵魚類", detail: "在水梯田引水口與主圳溝放養原生大肚魚及青鱂魚，物理壓制福壽螺幼卵，保障嫩綠嫩筍安全萌發。", iconType: "droplet" },
      { date: "05.15", stage: "水質調控", action: "高山活湧泉微流引灌", detail: "因應入夏氣溫升高，調大合歡山冷泉源頭進水量，使田水維持在 22°C 核心舒適低溫，促使嫩莖雪白鮮脆。", iconType: "sun" },
      { date: "05.08", stage: "幼苗萌發", action: "乳酸活菌肥精準澆灌", detail: "筍苗定植第二週，於入水口滴灌自製活性乳酸益生菌肥，活化深水爛泥中的根系微生物結構。", iconType: "sprout" }
    ]
  },
  {
    id: "green-broccoli",
    name: "翠 綠 鮮 嫩 青 花 椰 菜",
    scientificName: "Brassica oleracea var. italica",
    category: "十字花科芸薹屬二年生草本",
    batchNo: "BRO-2026-05I",
    startDate: "05.15",
    location: "彰化溪州濁水溪沖積熟田",
    farmerName: "魏清海 (阿海伯)",
    farmerPhilosophy: "「我們要吃的是花，必須最潔淨！」採用微米細網溫室防蟲，堅持施用發酵豆粕有機複合肥，不含化學長效殺蟲劑，守護您最在意的健康與翠綠。",
    triviaTitle: "青花椰菜",
    triviaList: [
      "青花椰菜我們食用的部分，其實是它成千上萬個尚未開放的「綠色花蕾」聚集而成的密集花球！一旦放任其過度成熟，花球就會開出美麗的黃色小花喔！",
      "青花椰菜被譽為超級抗癌十字花科之王，富含高量的「蘿蔔硫素」（Sulforaphane）、維生素C及大量胡蘿蔔素，其營養密度在葉菜類中名列前茅。",
      "挑選美味的青花椰菜有妙招：花蕾越緊密、無空隙，整體呈深綠或微紫（冷溫下產生的花青素）最優；若表面發黃或花蕾散開，則表示過度成熟，纖維較粗。",
      "我們全區覆蓋物理防蟲網（防蟲罩），徹底阻斷斜紋夜蛾與紋白蝶媽媽進來產卵，因此能在無農藥無污染的環境下，培育出完全不需要擔心菜蟲危害的青翠花椰菜。"
    ],
    photoUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "翠綠花椰產地體驗好禮",
      description: "感謝您掃描契作翠綠青花椰菜！憑此券至彰化溪州阿海伯溫室，於產季期間親自到場體驗『採收有機花椰菜二顆裝』可享 8 折優惠，並免費兌換現煮花椰菜什錦蔬果高湯一碗！",
      claimValue: "鮮脆花椰二顆包裝打 8 折 + 鮮高湯",
      promoCode: "BROCCOLIKING",
      terms: "限彰化溪州魏清海溫室產地使用，需配合產季安排。每人限用乙次，效期至 2026.11.30。"
    },
    metrics: [
      { time: "06:00", temperature: 22.0, humidity: 88, light: 1100, soilMoisture: 65 },
      { time: "09:00", temperature: 25.8, humidity: 76, light: 4600, soilMoisture: 61 },
      { time: "12:00", temperature: 28.9, humidity: 62, light: 8600, soilMoisture: 58 },
      { time: "15:00", temperature: 27.2, humidity: 64, light: 6400, soilMoisture: 57 },
      { time: "18:00", temperature: 23.9, humidity: 78, light: 1400, soilMoisture: 60 },
      { time: "21:00", temperature: 21.8, humidity: 84, light: 0, soilMoisture: 64 }
    ],
    logs: [
      { date: "05.28", stage: "花球萌發", action: "微量元素液肥葉面噴施", detail: "中心頂端開始萌現硬幣大小的微綠花蕾球，立即噴施含高硼與高鈣海藻液肥，促使花梗硬朗、花球不空心。", iconType: "clipboard" },
      { date: "05.20", stage: "物理覆網", action: "32目超細微米網搭防護罩", detail: "迎來纹白蝶大繁衍期，全面密閉式覆蓋32目細微編織網，100%隔絕蝶類產卵，免去化學殺蟲噴灑。", iconType: "sun" },
      { date: "05.15", stage: "田間定植", action: "濁水溪礦物黑泥開溝施肥", detail: "幼苗定植彰化濁水溪特有富鐵黑泥田，基肥打入發酵豆粕堆肥，建立深厚有機緩衝養分層。", iconType: "sprout" }
    ]
  },
  {
    id: "mountain-apple",
    name: "高 山 蜜 香 蜜 蘋 果",
    scientificName: "Malus domestica 'Fuji'",
    category: "薔薇科蘋果屬落葉喬木果樹",
    batchNo: "APL-2026-05J",
    startDate: "05.02",
    location: "台中梨山2400m向陽高陡坡",
    farmerName: "張世賢 (世賢叔)",
    farmerPhilosophy: "「真正的蜜腺，是高山冷霧與日光追逐出來的自然奇蹟。」堅持不催熟、不用工業蠟塗抹，讓每顆蜜蘋果在霜降洗禮下，形成閃著高山晶瑩光澤的極致蜜香核。",
    triviaTitle: "高山蜜蘋果",
    triviaList: [
      "蜜蘋果的「結蜜」現象並非品種特殊，而是因為高海拔夜晚溫度驟降，果樹為了防凍，將澱粉快速水解轉化為「山梨糖醇」防凍液防寒，聚積在果核周圍形成了晶瑩剔透、極度甘甜的蜜腺！",
      "高山蜜蘋果因為不塗人工石化化學微晶蠟，外表看起來有些微天然的果粉與風霜顆粒感，但只要簡單洗淨、連皮直接大口咬下，美味又最安心健康！",
      "蘋果富含水溶性膳食纖維「蘋果果膠」以及多酚抗氧化物，能有效維持腸道健康與抗老化，正是俗話所說的『一天一蘋果，醫生遠離我』！",
      "在梨山種植蘋果，世賢叔會在果樹間放養「黑水虻」與利用枯葉漚製天然木醋液，肥沃土壤也兼顧物理驅避病蟲效果，實現高山極低碳永續耕作。"
    ],
    photoUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1000&q=80",
    reward: {
      title: "消費者專屬好禮",
      subtitle: "高山蜜香珍寶好禮",
      description: "感謝您掃描梨山特海拔契作無毒蜜蘋果！憑本券前往台中梨山世賢叔示範果莊，購買現摘精品蜜蘋果手提禮盒，現場隨箱免費贈送「初榨無濾蜜蘋果汁（300ml）」一瓶，味道醇厚無比！",
      claimValue: "現榨高山蜜蘋果汁一瓶免費贈",
      promoCode: "MOUNTAINAPPLE",
      terms: "限梨山產區張世賢果莊自提取，亦可隨整箱訂單低溫免運宅配回府時一併附贈.效期至 2026.11.15。"
    },
    metrics: [
      { time: "06:00", temperature: 12.5, humidity: 92, light: 900, soilMoisture: 52 },
      { time: "09:00", temperature: 16.8, humidity: 80, light: 4800, soilMoisture: 48 },
      { time: "12:00", temperature: 20.2, humidity: 65, light: 8900, soilMoisture: 45 },
      { time: "15:00", temperature: 18.5, humidity: 68, light: 6200, soilMoisture: 44 },
      { time: "18:00", temperature: 14.1, humidity: 82, light: 1100, soilMoisture: 47 },
      { time: "21:00", temperature: 11.0, humidity: 88, light: 0, soilMoisture: 50 }
    ],
    logs: [
      { date: "05.26", stage: "果實套袋", action: "抗風精細紙袋套袋", detail: "為使果品色澤均勻鮮艷、防止冰雹與鳥害啄傷，手工精準為剛褪綠的小蘋果套上透光透氧抗水環保套袋。", iconType: "sun" },
      { date: "05.18", stage: "果實萌發", action: "高磷鉀微量海藻精追施", detail: "謝花結小指大青果初期，根部施加高質量有機磷鉀與天然冷壓海藻微量元素，強化幼果發育、鎖定蜜糖原質。", iconType: "clipboard" },
      { date: "05.02", stage: "保花保果", action: "草本木醋液全園噴霧物理驅避", detail: "高山氣候多變，初夏溫潤之際，精細噴霧自製草本木醋液活性稀釋液，強固花盤，並自然驅趕金龜子與毛蟲危害。", iconType: "sprout" }
    ]
  }
];

