/*
 * Formoya shared internationalization layer.
 *
 * The application keeps one DOM and one set of business logic. Chinese is the
 * canonical source copy; this module translates both server-rendered and
 * dynamically-created UI without duplicating a page per language.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'formoya_language';
  const SUPPORTED = ['zh-TW', 'en', 'ja'];

  const en = {
    '抽獎券':'Draw tickets','設定':'Settings','語言':'Language','福萌芽 Formoya - 智慧農場動態履歷':'Formoya — Smart Farm Production Records','收合':'Collapse','載入中...':'Loading...','背景音樂':'Background music','上一首':'Previous track','下一首':'Next track','播放清單（開發中）':'Playlist (in development)',
    '福萌芽 Formoya':'Formoya','記錄每一步農場成長':'Record every step of farm growth','午安！':'Good afternoon!','記錄每一步，串聯信任的農業未來':'Record every step and grow a trusted agricultural future',
    '今日農場紀錄':'Today’s farm record','查看全部 ›':'View all ›','點擊下方按鈕開始今天的第一筆紀錄':'Use the button below to add today’s first record','尚未紀錄':'No record yet','作物':'Crop','溫度':'Temperature','濕度':'Humidity','土壤 pH':'Soil pH','開始記錄':'Start recording',
    '🌱 快速操作':'🌱 Quick actions','拍攝照片':'Take photo','上傳照片':'Upload photo','產生 QR Code':'Create QR code','我的任務':'My tasks','💧 今日任務':'💧 Today’s tasks','澆水':'Watering','施肥':'Fertilizing','除草':'Weeding','巡視農場':'Inspect farm','查看任務詳情':'View task details',
    '🎁 農場扭蛋機':'🎁 Farm capsule machine','完成每日任務':'Complete daily tasks','獲得扭蛋抽獎機會！':'to earn capsule draws!','今日剩餘次數':'Draws remaining today','次':'draws','立即抽獎':'Draw now','查看扭蛋圖鑑 ›':'View capsule collection ›','完成任務可獲得抽獎券 🎟':'Complete tasks to earn draw tickets 🎟',
    '新增今日觀測日誌':'Add today’s observation','作物種類':'Crop','批次編號':'Batch number','溫度（°C）':'Temperature (°C)','濕度（%）':'Humidity (%)','土壤 pH 值':'Soil pH','備註':'Notes','儲存並發布至生產履歷 ☁':'Save and publish to production record ☁','植物照片記錄':'Plant photos',
    '消費者履歷 QR Code':'Consumer record QR code','📋 複製連結':'📋 Copy link','⬇ 下載':'⬇ Download','我的':'Profile','在地小農':'Local farmer','⚙️ 農場設定':'⚙️ Farm settings','⭐ 任務與成就':'⭐ Tasks and achievements','📖 我的圖鑑':'📖 My collection','登出帳號':'Sign out',
    '目前金幣':'Current coins','開啟設定':'Open settings','圖鑑':'Collection','記錄農場的每一個發現！':'Record every discovery on the farm!','全部':'All','哺乳類':'Mammals','鳥類':'Birds','魚類':'Fish','蛙類':'Frogs','昆蟲':'Insects','樹類':'Trees','花類':'Flowers','水果類':'Fruit','蔬菜類':'Vegetables','美食類':'Food','人物':'People','收藏總數':'Total collected','成就':'Achievements','圖鑑載入中':'Collection loading',
    '首頁':'Home','履歷':'Records','任務':'Tasks','農場設定':'Farm settings','任務與成就':'Tasks and achievements','我的圖鑑':'My collection','生產履歷':'Production record','從產地到餐桌，農事全紀錄':'Every farm step, from field to table','優良的生長曲線是品質的保證。':'Healthy growth trends are a promise of quality.','生長環境監測數據':'Growing environment data','今日小知識':'Today’s tip','↻ 換一個知識':'↻ Another tip','正在為您挑選植物知識...':'Selecting a plant fact for you…','監測數據類型':'Monitoring metric','溫度變化（°C）':'Temperature trend (°C)','可愛玉米插圖':'Corn illustration','版面預覽':'Sample data','晨間巡田':'Morning inspection','藤蔓整理':'Vine care','採收前檢查':'Pre-harvest check','葉片舒展、土壤濕潤，完成晨間灌溉與生長觀察。':'Leaves are open and the soil is moist after morning irrigation and a growth check.','整理攀藤方向並移除老葉，日照與通風狀態良好。':'Vines were trained and old leaves removed; sunlight and ventilation are good.','株型飽滿、葉色均勻，已完成採收前品質確認。':'Plants are full with even leaf color; the pre-harvest quality check is complete.',
    '任務 ・ 成就':'Tasks · Achievements','完成任務，累積經驗，成為更優秀的農夫！':'Complete tasks, earn experience, and become a better farmer!','每日任務':'Daily tasks','每日午夜自動重置':'Resets every day at midnight','稱號':'Titles','每日記錄':'Daily records','每日更新':'Updated daily','已完成':'Completed ','項':' items','預覽資料':'Preview data','顯示整月':'Show full month','日':'Sun','一':'Mon','二':'Tue','三':'Wed','四':'Thu','五':'Fri','六':'Sat',
    '⚙ 設定':'⚙ Settings','農場資料':'Farm details','農場地點':'Farm location','農夫姓名':'Farmer name','更新農場資訊':'Update farm details','音樂設定':'Music','音量':'Volume','🔊 開啟':'🔊 On','帳號':'Account','更改密碼（發送重設信）':'Change password (send reset email)','關閉':'Close','上一個月':'Previous month','下一個月':'Next month','選擇年份':'Select year','選擇月份':'Select month','選擇日期':'Select date','植物照片':'Plant photo','農事紀錄照片':'Farm record photo',
    '完善農場資訊':'Complete farm details','這些資訊會顯示在消費者掃描的生產履歷上':'This information appears on the production record scanned by consumers','開始使用':'Get started','福萌芽':'Formoya','Formoya 智慧農場管理系統':'Formoya smart farm management','登入':'Sign in','電子郵件':'Email','密碼（至少 6 字元）':'Password (at least 6 characters)','再次輸入密碼':'Confirm password','記住我':'Remember me','忘記密碼？':'Forgot password?','← 返回登入':'← Back to sign in','還沒有帳號？':'No account yet?','立即註冊':'Create one now','台灣魚類':'Taiwan fish','加入圖鑑':'Add to collection','恭喜獲得':'You got',
    '如：空心菜':'e.g. water spinach','如：2026-A':'e.g. 2026-A','已施肥、澆水':'Fertilized and watered','例：南投埔里':'e.g. Puli, Nantou','例：王大明':'e.g. Alex Wang',
    '今日任務':'Today’s tasks','完成任務獲得經驗值！':'Complete tasks to earn experience!','記錄今日觀測日誌':'Record today’s observations','上傳今日植物照片':'Upload today’s plant photo','自動':'Automatic','手動':'Manual','已達最高稱號':'Highest title reached',
    '農場新人':'Farm beginner','農事學徒':'Farm apprentice','農場助手':'Farm assistant','農事達人':'Farm expert','農場老手':'Experienced farmer','農業先鋒':'Agricultural pioneer','傳說農夫':'Legendary farmer',
    '農事新手':'First farm record','記錄第1筆觀測日誌':'Record the first observation','累計記錄10筆農事':'Create 10 farm records','累計記錄50筆農事':'Create 50 farm records','愛記錄':'Documenter','上傳第1張植物照片':'Upload the first plant photo','植物攝影師':'Plant photographer','累計上傳7張植物照片':'Upload 7 plant photos','收藏入門':'First collectible','獲得第1個扭蛋角色':'Collect the first capsule character','角色收藏家':'Character collector','收集5個不同角色':'Collect 5 different characters','收藏大師':'Master collector','收集15個不同角色':'Collect 15 different characters','三日連續':'Three-day streak','連續三天有農事記錄':'Keep farm records for 3 consecutive days','一週堅持':'One-week streak','連續七天有農事記錄':'Keep farm records for 7 consecutive days',
    '筊白筍':'Water bamboo','百香果':'Passion fruit','青江菜':'Bok choy','番茄':'Tomato','玉米':'Corn','九層塔':'Taiwanese basil','敏豆':'Green bean','苦瓜':'Bitter melon','地瓜葉':'Sweet potato leaves',
    '埔里名產「美人腿」！含有豐富纖維質與維生素，熱量低，是健康料理的絕佳選擇。':'A Puli specialty nicknamed “beauty legs.” Rich in fiber and vitamins, low in calories, and ideal for healthy dishes.',
    '埔里大坪頂特產！果汁被譽為「果汁之王」，富含維他命C，表皮變皺時甜度最高。':'A specialty of Dapingding, Puli. Its juice is rich in vitamin C, and the fruit is sweetest when the skin wrinkles.',
    '又稱湯匙菜。含有豐富的鈣質與維生素A，消費者烹調時建議快炒以保留清脆口感。':'Also called spoon cabbage. Rich in calcium and vitamin A; stir-fry quickly to preserve its crisp texture.',
    '富含滿滿的茄紅素。選購時應挑選果實飽滿、色澤均勻且蒂頭翠綠者。':'Rich in lycopene. Choose plump fruit with even color and a fresh green stem.',
    '含有豐富葉黃素與玉米黃素，對眼睛保健極佳。購買後建議盡快食用以保甜度。':'Rich in lutein and zeaxanthin. Eat soon after purchase to preserve its sweetness.',
    '強大的天然抗氧化食材。買回家後建議不要冷藏，插在常溫水瓶中可延長保鮮期。':'A natural antioxidant. Keep the stems in room-temperature water instead of refrigerating to extend freshness.',
    '也就是四季豆。含有豐富的維生素 B 群，烹調前務必完全煮熟。':'Also known as string bean. Rich in B vitamins and must be cooked thoroughly.',
    '能退火、降血糖。表皮顆粒越粗、縫隙越寬的苦瓜，通常苦味會比較淡。':'Traditionally valued for cooling properties. Larger bumps and wider grooves usually indicate a milder taste.',
    '平民蔬菜之王！不需過多農藥，含有大量葉綠素與鐵質，是天然補血食材。':'An affordable nutritional favorite, rich in chlorophyll and iron and typically grown with little pesticide.'
  };

  const ja = {
    '抽獎券':'抽選券','設定':'設定','語言':'言語','福萌芽 Formoya - 智慧農場動態履歷':'福萌芽 Formoya — スマート農場生産履歴','收合':'折りたたむ','載入中...':'読み込み中…','背景音樂':'BGM','上一首':'前の曲','下一首':'次の曲','播放清單（開発中）':'プレイリスト（開発中）',
    '福萌芽 Formoya':'福萌芽 Formoya','記錄每一步農場成長':'農場の成長を一歩ずつ記録','午安！':'こんにちは！','記錄每一步，串聯信任的農業未來':'一歩ずつ記録し、信頼される農業の未来へ',
    '今日農場紀錄':'今日の農場記録','查看全部 ›':'すべて見る ›','點擊下方按鈕開始今天的第一筆紀錄':'下のボタンから今日最初の記録を追加しましょう','尚未紀錄':'記録なし','作物':'作物','溫度':'温度','濕度':'湿度','土壤 pH':'土壌 pH','開始記錄':'記録を開始',
    '🌱 快速操作':'🌱 クイック操作','拍攝照片':'写真を撮る','上傳照片':'写真をアップロード','產生 QR Code':'QRコードを作成','我的任務':'マイタスク','💧 今日任務':'💧 今日のタスク','澆水':'水やり','施肥':'施肥','除草':'草取り','巡視農場':'農場の見回り','查看任務詳情':'タスク詳細を見る',
    '🎁 農場扭蛋機':'🎁 農場カプセルマシン','完成每日任務':'毎日のタスクを完了して','獲得扭蛋抽獎機會！':'カプセル抽選に挑戦！','今日剩餘次數':'本日の残り回数','次':'回','立即抽獎':'今すぐ抽選','查看扭蛋圖鑑 ›':'カプセル図鑑を見る ›','完成任務可獲得抽獎券 🎟':'タスク完了で抽選券を獲得 🎟',
    '新增今日觀測日誌':'今日の観察記録を追加','作物種類':'作物の種類','批次編號':'ロット番号','溫度（°C）':'温度（°C）','濕度（%）':'湿度（%）','土壤 pH 值':'土壌 pH','備註':'メモ','儲存並發布至生產履歷 ☁':'保存して生産履歴に公開 ☁','植物照片記錄':'植物写真の記録',
    '消費者履歷 QR Code':'消費者向け履歴 QRコード','📋 複製連結':'📋 リンクをコピー','⬇ 下載':'⬇ ダウンロード','我的':'マイページ','在地小農':'地域の農家','⚙️ 農場設定':'⚙️ 農場設定','⭐ 任務與成就':'⭐ タスクと実績','📖 我的圖鑑':'📖 マイ図鑑','登出帳號':'ログアウト',
    '目前金幣':'現在のコイン','開啟設定':'設定を開く','圖鑑':'図鑑','記錄農場的每一個發現！':'農場での発見をすべて記録しよう！','全部':'すべて','哺乳類':'哺乳類','鳥類':'鳥類','魚類':'魚類','蛙類':'カエル','昆蟲':'昆虫','樹類':'樹木','花類':'花','水果類':'果物','蔬菜類':'野菜','美食類':'グルメ','人物':'人物','收藏總數':'収集総数','成就':'実績','圖鑑載入中':'図鑑を読み込み中',
    '首頁':'ホーム','履歷':'履歴','任務':'タスク','農場設定':'農場設定','任務與成就':'タスクと実績','我的圖鑑':'マイ図鑑','生產履歷':'生産履歴','從產地到餐桌，農事全紀錄':'産地から食卓まで、農作業をすべて記録','優良的生長曲線是品質的保證。':'良好な成長曲線は品質の証です。','生長環境監測數據':'生育環境データ','今日小知識':'今日の豆知識','↻ 換一個知識':'↻ 別の豆知識','正在為您挑選植物知識...':'植物の豆知識を選んでいます…','監測數據類型':'モニタリング項目','溫度變化（°C）':'温度推移（°C）','可愛玉米插圖':'トウモロコシのイラスト','版面預覽':'サンプルデータ','晨間巡田':'朝の見回り','藤蔓整理':'つるの手入れ','採收前檢查':'収穫前点検','葉片舒展、土壤濕潤，完成晨間灌溉與生長觀察。':'葉が開き土壌も湿潤。朝の灌水と生育観察を完了しました。','整理攀藤方向並移除老葉，日照與通風狀態良好。':'つるの方向を整え古い葉を除去。日当たりと風通しは良好です。','株型飽滿、葉色均勻，已完成採收前品質確認。':'株は充実し葉色も均一。収穫前の品質確認を完了しました。',
    '任務 ・ 成就':'タスク・実績','完成任務，累積經驗，成為更優秀的農夫！':'タスクを完了し、経験を積んでより良い農家へ！','每日任務':'デイリータスク','每日午夜自動重置':'毎日0時にリセット','稱號':'称号','每日記錄':'毎日の記録','每日更新':'毎日更新','已完成':'完了 ','項':' 件','預覽資料':'プレビューデータ','顯示整月':'月全体を表示','日':'日','一':'月','二':'火','三':'水','四':'木','五':'金','六':'土',
    '⚙ 設定':'⚙ 設定','農場資料':'農場情報','農場地點':'農場所在地','農夫姓名':'農家名','更新農場資訊':'農場情報を更新','音樂設定':'音楽設定','音量':'音量','🔊 開啟':'🔊 オン','帳號':'アカウント','更改密碼（發送重設信）':'パスワード変更（再設定メール）','關閉':'閉じる','上一個月':'前の月','下一個月':'次の月','選擇年份':'年を選択','選擇月份':'月を選択','選擇日期':'日付を選択','植物照片':'植物写真','農事紀錄照片':'農作業記録の写真',
    '完善農場資訊':'農場情報を入力','這些資訊會顯示在消費者掃描的生產履歷上':'この情報は消費者が読み取る生産履歴に表示されます','開始使用':'利用を開始','福萌芽':'福萌芽','Formoya 智慧農場管理系統':'Formoya スマート農場管理システム','登入':'ログイン','電子郵件':'メールアドレス','密碼（至少 6 字元）':'パスワード（6文字以上）','再次輸入密碼':'パスワードを再入力','記住我':'ログイン状態を保持','忘記密碼？':'パスワードを忘れた場合','← 返回登入':'← ログインへ戻る','還沒有帳號？':'アカウントをお持ちでないですか？','立即註冊':'今すぐ登録','台灣魚類':'台湾の魚類','加入圖鑑':'図鑑に追加','恭喜獲得':'獲得しました',
    '如：空心菜':'例：空心菜','如：2026-A':'例：2026-A','已施肥、澆水':'施肥・水やり済み','例：南投埔里':'例：南投・埔里','例：王大明':'例：山田太郎',
    '今日任務':'今日のタスク','完成任務獲得經驗值！':'タスク完了で経験値を獲得！','記錄今日觀測日誌':'今日の観察記録を作成','上傳今日植物照片':'今日の植物写真をアップロード','自動':'自動','手動':'手動','已達最高稱號':'最高称号に到達',
    '農場新人':'農場ビギナー','農事學徒':'農業見習い','農場助手':'農場アシスタント','農事達人':'農業エキスパート','農場老手':'ベテラン農家','農業先鋒':'農業パイオニア','傳說農夫':'伝説の農家',
    '農事新手':'初めての農作業記録','記錄第1筆觀測日誌':'最初の観察記録を作成','累計記錄10筆農事':'農作業を10件記録','累計記錄50筆農事':'農作業を50件記録','愛記錄':'記録好き','上傳第1張植物照片':'最初の植物写真をアップロード','植物攝影師':'植物フォトグラファー','累計上傳7張植物照片':'植物写真を7枚アップロード','收藏入門':'コレクション入門','獲得第1個扭蛋角色':'最初のカプセルキャラクターを獲得','角色收藏家':'キャラクターコレクター','收集5個不同角色':'異なるキャラクターを5体収集','收藏大師':'コレクションマスター','收集15個不同角色':'異なるキャラクターを15体収集','三日連續':'3日連続','連續三天有農事記錄':'3日連続で農作業を記録','一週堅持':'1週間連続','連續七天有農事記錄':'7日連続で農作業を記録',
    '筊白筍':'マコモダケ','百香果':'パッションフルーツ','青江菜':'チンゲンサイ','番茄':'トマト','玉米':'トウモロコシ','九層塔':'台湾バジル','敏豆':'インゲン豆','苦瓜':'ゴーヤー','地瓜葉':'サツマイモの葉',
    '埔里名產「美人腿」！含有豐富纖維質與維生素，熱量低，是健康料理的絕佳選擇。':'埔里名物「美人腿」。食物繊維とビタミンが豊富で低カロリー、健康的な料理に最適です。',
    '埔里大坪頂特產！果汁被譽為「果汁之王」，富含維他命C，表皮變皺時甜度最高。':'埔里・大坪頂の特産品。ビタミンCが豊富で、皮にしわが出た頃が最も甘くなります。',
    '又稱湯匙菜。含有豐富的鈣質與維生素A，消費者烹調時建議快炒以保留清脆口感。':'スプーン菜とも呼ばれ、カルシウムとビタミンAが豊富。手早く炒めると歯ごたえを保てます。',
    '富含滿滿的茄紅素。選購時應挑選果實飽滿、色澤均勻且蒂頭翠綠者。':'リコピンが豊富。ふっくらして色むらがなく、へたが鮮やかな緑色のものを選びましょう。',
    '含有豐富葉黃素與玉米黃素，對眼睛保健極佳。購買後建議盡快食用以保甜度。':'ルテインとゼアキサンチンが豊富。甘さを保つため、購入後は早めに食べましょう。',
    '強大的天然抗氧化食材。買回家後建議不要冷藏，插在常溫水瓶中可延長保鮮期。':'天然の抗酸化食材。冷蔵せず、茎を常温の水に挿すと鮮度が長持ちします。',
    '也就是四季豆。含有豐富的維生素 B 群，烹調前務必完全煮熟。':'インゲン豆のこと。ビタミンB群が豊富で、必ず十分に加熱してください。',
    '能退火、降血糖。表皮顆粒越粗、縫隙越寬的苦瓜，通常苦味會比較淡。':'体を冷ます食材として親しまれています。表面の粒が大きく溝が広いほど、苦味は穏やかです。',
    '平民蔬菜之王！不需過多農藥，含有大量葉綠素與鐵質，是天然補血食材。':'手頃で栄養豊富な野菜。葉緑素と鉄分を多く含み、農薬をあまり使わず育てられます。'
  };

  Object.assign(en, {
    '濕度變化（%）': 'Humidity trend (%)', '土壤酸鹼值（pH）': 'Soil pH trend',
    '週一': 'Mon', '週二': 'Tue', '週三': 'Wed', '週四': 'Thu', '週五': 'Fri', '週六': 'Sat', '紀錄': 'Record'
  });
  Object.assign(ja, {
    '濕度變化（%）': '湿度推移（%）', '土壤酸鹼值（pH）': '土壌pH推移',
    '週一': '月', '週二': '火', '週三': '水', '週四': '木', '週五': '金', '週六': '土', '紀錄': '記録'
  });

  const dictionaries = { en, ja };
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let language = normalize(localStorage.getItem(STORAGE_KEY) || navigator.language);
  let applying = false;

  function normalize(value) {
    if (value && value.toLowerCase().startsWith('ja')) return 'ja';
    if (value && value.toLowerCase().startsWith('en')) return 'en';
    return 'zh-TW';
  }

  function translateDynamic(source, lang) {
    if (lang === 'zh-TW') return source;
    const weekday = {
      en: { 日: 'Sun', 一: 'Mon', 二: 'Tue', 三: 'Wed', 四: 'Thu', 五: 'Fri', 六: 'Sat' },
      ja: { 日: '日', 一: '月', 二: '火', 三: '水', 四: '木', 五: '金', 六: '土' }
    };
    const monthName = month => new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en', { month: 'short' })
      .format(new Date(2020, Number(month) - 1, 1));
    const rules = lang === 'ja' ? [
      [/^已完成(\d+) 項$/, '$1 項目完了'], [/^(\d+) 項$/, '$1 件'], [/^(\d+)\/(\d+) 已解鎖$/, '$1/$2 解除済み'], [/^總 EXP：(\d+)$/, '合計 EXP：$1'],
      [/^(\d{4})年(\d{1,2})月$/, '$1年$2月'],
      [/^(\d{2})月（([日一二三四五六])）$/, (_, month, day) => `${Number(month)}月（${weekday.ja[day]}）`],
      [/^可愛(.+)插圖$/, (_, crop) => `${dictionaries.ja[crop] || crop}のイラスト`],
      [/^(.+)照片$/, (_, crop) => `${dictionaries.ja[crop] || crop}の写真`],
      [/^下個等級：(.+)（(\d+) EXP）$/, (_, name, exp) => `次のレベル：${dictionaries.ja[name] || name}（${exp} EXP）`],
      [/^(.+)（(\d+) EXP）$/, (_, name, exp) => `${dictionaries.ja[name] || name}（${exp} EXP）`],
      [/^(.+) · (.+)$/, (_, crop, action) => `${dictionaries.ja[crop] || crop} · ${dictionaries.ja[action] || action}`],
      [/^溫 (.+)$/, '温度 $1'], [/^濕 (.+)$/, '湿度 $1'],
      [/^([🌱🌿🍃🌾🏡🏅👑]️?) (.+)$/, (_, icon, name) => `${icon} ${dictionaries.ja[name] || name}`],
      [/^恭喜抽中：(.+)！$/, 'おめでとう：$1！'], [/^已按讚 ♥$/, 'いいね済み ♥'], [/^為這位農夫按讚$/, 'この農家にいいね'],
      [/^(早安|午安|晚安)，(.+)！$/, (_, _greeting, name) => `こんにちは、${dictionaries.ja[name] || name}さん！`]
    ] : [
      [/^已完成(\d+) 項$/, '$1 completed'], [/^(\d+) 項$/, '$1 items'], [/^(\d+)\/(\d+) 已解鎖$/, '$1/$2 unlocked'], [/^總 EXP：(\d+)$/, 'Total EXP: $1'],
      [/^(\d{4})年$/, '$1'], [/^(\d{1,2})月$/, (_, month) => monthName(month)],
      [/^(\d{4})年(\d{1,2})月$/, (_, year, month) => `${monthName(month)} ${year}`],
      [/^(\d{2})月（([日一二三四五六])）$/, (_, month, day) => `${monthName(month)} (${weekday.en[day]})`],
      [/^可愛(.+)插圖$/, (_, crop) => `${dictionaries.en[crop] || crop} illustration`],
      [/^(.+)照片$/, (_, crop) => `${dictionaries.en[crop] || crop} photo`],
      [/^下個等級：(.+)（(\d+) EXP）$/, (_, name, exp) => `Next level: ${dictionaries.en[name] || name} (${exp} EXP)`],
      [/^(.+)（(\d+) EXP）$/, (_, name, exp) => `${dictionaries.en[name] || name} (${exp} EXP)`],
      [/^(.+) · (.+)$/, (_, crop, action) => `${dictionaries.en[crop] || crop} · ${dictionaries.en[action] || action}`],
      [/^溫 (.+)$/, 'Temp $1'], [/^濕 (.+)$/, 'Humidity $1'],
      [/^([🌱🌿🍃🌾🏡🏅👑]️?) (.+)$/, (_, icon, name) => `${icon} ${dictionaries.en[name] || name}`],
      [/^恭喜抽中：(.+)！$/, 'You drew: $1!'], [/^已按讚 ♥$/, 'Liked ♥'], [/^為這位農夫按讚$/, 'Like this farmer'],
      [/^(早安|午安|晚安)，(.+)！$/, (_, _greeting, name) => `Hello, ${dictionaries.en[name] || name}!`]
    ];
    for (const [pattern, replacement] of rules) {
      if (pattern.test(source)) return source.replace(pattern, replacement);
    }
    return source;
  }

  function t(source, variables) {
    let result = language === 'zh-TW' ? source : (dictionaries[language]?.[source] || translateDynamic(source, language));
    if (variables) Object.entries(variables).forEach(([key, value]) => { result = result.replaceAll(`{${key}}`, value); });
    return result;
  }

  function translateTextNode(node, forceCanonical = false) {
    const current = node.nodeValue;
    if (!originalText.has(node)) {
      originalText.set(node, current);
    } else if (!forceCanonical) {
      const previousSource = originalText.get(node);
      const previousTrimmed = previousSource.trim();
      const previousExpected = previousTrimmed
        ? previousSource.replace(previousTrimmed, t(previousTrimmed))
        : previousSource;
      // Application renders can reuse a text node. Capture the new canonical
      // Chinese copy instead of translating the stale value stored at startup.
      if (current !== previousSource && current !== previousExpected) originalText.set(node, current);
    }
    const source = originalText.get(node);
    const trimmed = source.trim();
    if (!trimmed) return;
    const translated = t(trimmed);
    const desired = source.replace(trimmed, translated);
    if (node.nodeValue !== desired) node.nodeValue = desired;
  }

  function translateElement(element, forceCanonical = false) {
    if (!(element instanceof Element) || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) return;
    if (!originalAttributes.has(element)) originalAttributes.set(element, {});
    const originals = originalAttributes.get(element);
    ['placeholder', 'title', 'aria-label', 'alt'].forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      const current = element.getAttribute(attribute);
      if (!(attribute in originals)) {
        originals[attribute] = current;
      } else if (!forceCanonical) {
        const previousSource = originals[attribute];
        const previousExpected = t(previousSource);
        // Dynamic application renders may reuse an image or field and update
        // its canonical Chinese accessibility copy after initial rendering.
        if (current !== previousSource && current !== previousExpected) originals[attribute] = current;
      }
      const desired = t(originals[attribute]);
      if (current !== desired) element.setAttribute(attribute, desired);
    });
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) translateTextNode(child, forceCanonical);
      else if (child.nodeType === Node.ELEMENT_NODE) translateElement(child, forceCanonical);
    }
  }

  function apply(root = document.documentElement) {
    if (applying) return;
    applying = true;
    document.documentElement.lang = language;
    // A direct language change must always translate from the canonical
    // Chinese source captured for each node, never from the previous locale.
    translateElement(root, true);
    const selector = document.getElementById('formoyaLanguage');
    if (selector) selector.value = language;
    applying = false;
  }

  function setLanguage(nextLanguage) {
    language = SUPPORTED.includes(nextLanguage) ? nextLanguage : 'zh-TW';
    localStorage.setItem(STORAGE_KEY, language);
    apply();
    window.dispatchEvent(new CustomEvent('formoya:languagechange', { detail: { language } }));
  }

  function createSwitcher() {
    if (document.getElementById('formoyaLanguageSwitcher')) return;
    const wrapper = document.createElement('div');
    wrapper.id = 'formoyaLanguageSwitcher';
    wrapper.className = 'language-switcher';
    wrapper.innerHTML = '<label for="formoyaLanguage" class="sr-only">語言</label><span aria-hidden="true">🌐</span><select id="formoyaLanguage" aria-label="語言"><option value="zh-TW">繁體中文</option><option value="en">English</option><option value="ja">日本語</option></select>';
    document.body.appendChild(wrapper);
    wrapper.querySelector('select').addEventListener('change', event => setLanguage(event.target.value));
  }

  const observer = new MutationObserver(mutations => {
    if (applying) return;
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateTextNode(mutation.target);
      if (mutation.type === 'attributes') translateElement(mutation.target);
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
        else if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
      });
    }
  });

  createSwitcher();
  apply();
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['placeholder', 'title', 'aria-label', 'alt']
  });

  window.FormoyaI18n = { t, apply, setLanguage, getLanguage: () => language, supported: [...SUPPORTED] };
})();
