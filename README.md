# 數位名片：vCard 下載頁

一個單頁網站，讓客戶一鍵把你的聯絡資訊存進手機通訊錄。
可以搭配 LINKGOODS 使用：在 LINKGOODS 新增一顆「📇 儲存我的聯絡資訊」按鈕，連到這個頁面。

- 純前端，不需要後端或資料庫，免費部署在 GitHub Pages
- 所有個人資料集中在 `config.js`
- 從 LINE 打開時，會自動改用外部瀏覽器開啟（LINE 內建瀏覽器無法存聯絡人）
- 從 IG、FB、Threads 打開時，頁面會提示「改用瀏覽器開啟」
- 有放頭像的話，會自動縮小並一起存進聯絡人照片

LINKGOODS 的文案素材請看 [`LINKGOODS-素材包.md`](LINKGOODS-素材包.md)。

## 檔案說明

| 檔案 | 用途 | 需要改嗎 |
|---|---|---|
| `config.js` | 姓名、電話、Email、LINE、登錄字號等資料 | ✅ 要改 |
| `assets/avatar.jpg` | 頭像（正方形，600×600 以上） | ✅ 自行放入 |
| `index.html` / `style.css` / `app.js` | 頁面、樣式、程式 | 不用 |
| `blueprint/index.html` | 「五感藍圖」服務介紹頁，文案直接寫在這個檔案裡 | 改文案時才需要 |

## 1. 修改個人資料

在 GitHub 網頁上打開 `config.js`，點右上角鉛筆圖示（Edit）。
修改引號 `""` 裡的文字後，按 **Commit changes**。

- 不需要的欄位留空 `""`，就不會出現在頁面和名片上
- 頭像：進入 `assets` 資料夾，用 **Add file → Upload files** 上傳，檔名要是 `avatar.jpg`

## 2. 免費部署到 GitHub Pages

1. 打開 repo 的 **Settings → Pages**
2. Source 選 **Deploy from a branch**
3. Branch 選放程式碼的分支（例如 `main`），資料夾選 `/ (root)`，按 **Save**
4. 等 1～2 分鐘，網址會顯示在同一頁，格式像這樣：
   `https://<你的帳號>.github.io/<repo 名稱>/`

> GitHub Pages 免費方案只支援**公開（public）**的 repo。

之後每次修改 `config.js` 並 commit，網站會在 1～2 分鐘內自動更新。

## 3. 接到 LINKGOODS

在 LINKGOODS 新增一顆按鈕：

- 標題：`📇 儲存我的聯絡資訊`
- 連結：上一步取得的 GitHub Pages 網址

## 4. 進階：掃描或感應後直接存聯絡人

網址後面加上 `?download=1`，打開頁面時會自動觸發儲存：

```
https://<你的帳號>.github.io/<repo 名稱>/?download=1
```

適合寫進 NFC 卡片，或做成「存聯絡人專用」的 QR Code。

## 5. 本機預覽（選用）

```bash
python3 -m http.server 8000
# 打開 http://localhost:8000
```

## 上線後請實測

- iPhone：分別用 Safari、LINE 打開，點「儲存到通訊錄」，確認會跳出聯絡人畫面
- Android：分別用 Chrome、LINE 打開，確認檔案下載後能匯入
- 打開存好的聯絡人，確認姓名、電話、LINE 連結和照片都正確
