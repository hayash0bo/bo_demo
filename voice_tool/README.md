# 書き起こし音声化ツール (Streamlit)

シナリオからスクリプトを LLM で生成し、承認後に OpenAI TTS で音声 (MP3) を合成する社内用の簡易ツール。

## セットアップ

```bash
cd voice_tool
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 起動

```bash
export OPENAI_API_KEY=sk-...   # サイドバーからの直接入力も可
streamlit run app.py
```

ブラウザが開かない場合は `http://localhost:8501` にアクセス。

## 使い方

1. **シナリオ入力**: タイトル・状況設定・登場人物・分量などを入力し「スクリプト生成」。
2. **スクリプト確認・編集**: 生成された「名前: 発言」形式のスクリプトをそのまま編集可。問題なければ「承認する」。
3. **音声合成**: 話者ごとに voice (alloy / nova / echo など) を割り当て、「音声を生成」でMP3を取得。

## 仕様メモ

- スクリプト生成モデル: `gpt-4.1` など (サイドバー切替可)。
- TTSモデル:
  - `gpt-4o-mini-tts`: `instructions` でトーン指示が可能 (speed 非対応)。
  - `tts-1` / `tts-1-hd`: `speed` でピッチを維持したまま速度調整が可能。
- スクリプトのパーサは「名前: 発言」または「名前：発言」の行のみを拾う。ト書きや空行はスキップ。
- 音声は各発言ごとに TTS API を呼び、MP3 バイトを順に連結して1ファイルとして返す。
