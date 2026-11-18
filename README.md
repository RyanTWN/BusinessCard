# IRAIT Advisory 數位名片

網址：**https://card.irait.win/**

- 純前端，不需要後端或資料庫，部署在 Cloudflare Pages（免費）
- 所有個人資料集中在 `public/config.js`
- 從 LINE 打開時，會自動改用外部瀏覽器（LINE 內建瀏覽器無法存聯絡人）
- 從 IG、FB、Threads 打開時，頁面會提示「改用瀏覽器開啟」
- 頭像會自動縮小，一起存進聯絡人照片

## 目錄結構

```
public/                 ← 只有這個資料夾會發布到網站
  index.html            名片頁（儲存聯絡人）
  config.js             ✅ 個人資料：要改資料就改這個檔案
  app.js / style.css    名片頁的程式與樣式
  assets/avatar.jpg     頭像／Logo
  blueprint/            五感藍圖服務頁   → /blueprint/
  heritage/             恆產基業服務頁   → /heritage/
LINKGOODS-素材包.md      LINKGOODS 後台文案（不會發布）
README.md               本說明（不會發布）
```

## 1. 修改個人資料

在 GitHub 網頁打開 `public/config.js`，點右上角鉛筆圖示（Edit），
修改引號 `""` 裡的文字後，按 **Commit changes**。約 1 分鐘後網站自動更新。

- 不需要的欄位留空 `""`，就不會出現在頁面和名片上
- 換頭像：進入 `public/assets`，上傳新圖並命名為 `avatar.jpg`
- 可點擊的標籤寫成 `{ text: "#文字", url: "網址" }`
- 服務頁的文案直接寫在 `public/blueprint/index.html`、`public/heritage/index.html` 裡

## 2. Cloudflare Pages 設定（第一次設定才需要）

1. Cloudflare 後台 → **Workers & Pages** → **Create** → **Pages** 分頁 → **Connect to Git**
2. 選擇 repo `RyanTWN/BusinessCard`
3. 建置設定：
   - Production branch：目前程式碼所在的分支
   - Framework preset：**None**
   - Build command：**留空**
   - Build output directory：`public`
4. **Save and Deploy**
5. 專案 → **Custom domains** → **Set up a custom domain** → 輸入 `card.irait.win`

之後每次推送到 Production branch，Cloudflare 都會自動重新發布。

## 3. 常用網址

| 用途 | 網址 |
|---|---|
| 名片頁 | `https://card.irait.win/` |
| NFC／QR Code（打開直接存聯絡人） | `https://card.irait.win/?download=1` |
| 五感藍圖 | `https://card.irait.win/blueprint/` |
| 恆產基業 | `https://card.irait.win/heritage/` |

## 4. 本機預覽（選用）

```bash
cd public
python3 -m http.server 8000
# 打開 http://localhost:8000
```

## 上線後請實測

- iPhone：分別用 Safari、LINE 打開，點「儲存到通訊錄」，確認會跳出聯絡人畫面
- Android：分別用 Chrome、LINE 打開，確認檔案下載後能匯入
- 打開存好的聯絡人，確認姓名、電話、LINE、網站和照片都正確
