# キャンプ記録 (camp-visits)

家族のキャンプ記録。MulmoClaude 上の schema-driven collection として管理していたデータとスキル定義をエクスポートしたもの。

## 🌐 ビューを見る

GitHub Pages で公開中: **https://kzknakajima.github.io/camp-visits/**

- [一覧](https://kzknakajima.github.io/camp-visits/) — キャンプの記録一覧
- [🗺️ 地図](https://kzknakajima.github.io/camp-visits/map.html) — キャンプ場ごとにピン表示
- [📅 カレンダー](https://kzknakajima.github.io/camp-visits/calendar.html) — 日付から記録を探す(連泊は滞在期間の全日に表示)
- [📊 ダッシュボード](https://kzknakajima.github.io/camp-visits/dashboard.html) — 年別の回数・泊数・費用、スタイル別割合、費目別内訳

`docs/` 以下が公開サイトのソース(`data.json` を fetch して描画する静的版)。MulmoClaude 内で使っていた `skill/views/*.html` は host が注入する `window.__MC_VIEW` に依存するため、GitHub Pages 用に host 非依存の版として書き直したもの。

## 構成

- `data/camp-visits/items/*.json` — キャンプ1回(何泊でも) = 1レコード(MulmoClaude 側の正データ)。開始日・終了日・場所(名前+緯度経度)・スタイル・天気・気温・混雑度・同行者・持ち物/装備・食事/料理・焚き火・アクティビティ・むしとり記録([bug-visits](https://github.com/kzknakajima/bug-visits))への参照リンク・費用・満足度・また行きたいか・メモを持つ。
- `skill/SKILL.md` — 記録ルール(ワンライン登録の解釈ロジック、むしとり記録との自動リンクなど)。
- `skill/schema.json` — コレクションのスキーマ定義。
- `skill/views/map.html` / `skill/views/dashboard.html` — MulmoClaude アプリ内で使うビュー(host 依存)。
- `docs/` — GitHub Pages で公開する静的サイト(`index.html` / `map.html` / `calendar.html` / `dashboard.html` / `data.json`)。

## レコードの例

```json
{
  "id": "2026-09-19-yamamori-circuit",
  "startDate": "2026-09-19",
  "endDate": "2026-09-20",
  "placeName": "やまもりサーキット",
  "siteType": "オートキャンプ",
  "lat": 35.1688774,
  "lng": 135.2786281,
  "weatherLog": [
    { "timing": "9/19 昼", "weather": "晴れ" },
    { "timing": "9/19 夜", "weather": "雨" }
  ],
  "companions": "妻の父(子どもから見て母方の祖父)",
  "gear": [{ "item": "テント", "note": "2張" }],
  "campfire": true,
  "rating": 5,
  "wantToReturn": true,
  "relatedBugVisits": [{ "visit": "2026-09-19-yamamori-circuit" }]
}
```
