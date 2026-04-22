"""書き起こしスクリプト生成 → 承認 → TTS音声化ツール (Streamlit)"""

from __future__ import annotations

import io
import os
import re
from typing import List, Tuple

import streamlit as st
from openai import OpenAI

SCRIPT_MODELS = ["gpt-4.1", "gpt-4.1-mini", "gpt-4o", "gpt-4o-mini"]
TTS_MODELS = ["gpt-4o-mini-tts", "tts-1-hd", "tts-1"]
VOICES = [
    "alloy", "ash", "ballad", "coral", "echo",
    "fable", "onyx", "nova", "sage", "shimmer", "verse",
]

SPEAKER_LINE = re.compile(r"^\s*([^:：]{1,30})[:：]\s*(.+?)\s*$")


def init_state() -> None:
    defaults = {
        "script": "",
        "approved": False,
        "audio_bytes": None,
        "last_inputs": None,
    }
    for k, v in defaults.items():
        st.session_state.setdefault(k, v)


def parse_script(text: str) -> List[Tuple[str, str]]:
    """「名前: 発言」形式の行をパース。"""
    lines: List[Tuple[str, str]] = []
    for raw in text.splitlines():
        if not raw.strip():
            continue
        m = SPEAKER_LINE.match(raw)
        if m:
            lines.append((m.group(1).strip(), m.group(2).strip()))
    return lines


def get_client(api_key: str) -> OpenAI:
    if not api_key:
        st.error("サイドバーで OpenAI API Key を入力してください。")
        st.stop()
    return OpenAI(api_key=api_key)


def generate_script(
    client: OpenAI,
    model: str,
    title: str,
    scenario: str,
    speakers: List[str],
    length_hint: str,
    extra: str,
) -> str:
    system = (
        "あなたは商談・対話コンテンツのシナリオライターです。"
        "自然な日本語で、登場人物の発言のみを「名前: 発言」の形式で1行ずつ出力してください。"
        "ト書き・括弧書き・効果音・見出しは一切含めないでください。"
    )
    user = f"""
以下のシナリオに沿って、書き起こし風の会話スクリプトを作成してください。

【タイトル】{title}
【シナリオ / 状況設定】
{scenario}

【登場人物】
{chr(10).join(f"- {s}" for s in speakers)}

【分量目安】{length_hint}

【追加指示】
{extra or "(なし)"}

出力フォーマット要件:
- 各行は「名前: 発言」。名前は登場人物リストの表記と完全一致させる。
- ト書き・(笑)・BGM等の表記は含めない。
- 冒頭と締めの挨拶を自然に含める。
- 長い独白は避け、適度にターンテイクを挟む。
""".strip()
    resp = client.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
    )
    return resp.choices[0].message.content or ""


def synthesize(
    client: OpenAI,
    tts_model: str,
    lines: List[Tuple[str, str]],
    voice_map: dict,
    speed: float,
    instructions: str,
) -> bytes:
    buf = io.BytesIO()
    progress = st.progress(0.0, text="音声合成中...")
    total = len(lines)
    for idx, (speaker, utterance) in enumerate(lines, start=1):
        voice = voice_map.get(speaker, VOICES[0])
        kwargs = {
            "model": tts_model,
            "voice": voice,
            "input": utterance,
            "response_format": "mp3",
        }
        if tts_model in ("tts-1", "tts-1-hd"):
            kwargs["speed"] = speed
        elif instructions.strip():
            kwargs["instructions"] = instructions.strip()

        with client.audio.speech.with_streaming_response.create(**kwargs) as resp:
            for chunk in resp.iter_bytes():
                buf.write(chunk)

        progress.progress(idx / total, text=f"音声合成中... ({idx}/{total})")
    progress.empty()
    return buf.getvalue()


def main() -> None:
    st.set_page_config(page_title="書き起こし音声化ツール", layout="wide")
    init_state()

    with st.sidebar:
        st.header("設定")
        api_key = st.text_input(
            "OpenAI API Key",
            type="password",
            value=os.environ.get("OPENAI_API_KEY", ""),
            help="入力値はセッション内のみで保持されます。",
        )
        script_model = st.selectbox("スクリプト生成モデル", SCRIPT_MODELS, index=0)
        tts_model = st.selectbox("TTSモデル", TTS_MODELS, index=0)
        st.caption(
            "`gpt-4o-mini-tts` はトーン指示 (instructions) に対応。"
            "`tts-1` / `tts-1-hd` は話速 (speed) に対応。"
        )

    st.title("書き起こしスクリプト → TTS 音声化ツール")
    st.caption("シナリオからスクリプトを生成し、承認後に音声を合成します。")

    # ---- Step 1: シナリオ入力 ----
    st.subheader("1. シナリオ入力")
    col1, col2 = st.columns(2)
    with col1:
        title = st.text_input("タイトル", "製造ライン自動化提案 初回商談")
        scenario = st.text_area(
            "シナリオ / 状況設定",
            "自動車部品メーカーへの初回訪問。営業側が産業用ロボットアームを提案し、"
            "顧客は予算・運用負荷・既存ライン停止リスクに懸念を示す。"
            "競合他社との比較、次回のPoC提案までの合意形成を含める。",
            height=160,
        )
    with col2:
        speakers_raw = st.text_area(
            "登場人物 (1行1人)",
            "田中 (営業担当)\n佐藤 (エンジニア)\n山田部長 (顧客側)\n鈴木課長 (顧客側)",
            height=160,
            help="行頭を話者名として使用します。括弧内は役職メモ用。",
        )
        length_hint = st.select_slider(
            "分量目安",
            options=["短め (約1,000字)", "中 (約2,000字)", "長め (約3,500字)"],
            value="中 (約2,000字)",
        )
        extra = st.text_area("追加指示 (任意)", "", height=80)

    speakers = [ln.strip() for ln in speakers_raw.splitlines() if ln.strip()]

    if st.button("スクリプト生成", type="primary", disabled=not speakers):
        client = get_client(api_key)
        with st.spinner("スクリプト生成中..."):
            try:
                st.session_state.script = generate_script(
                    client, script_model, title, scenario, speakers, length_hint, extra
                )
                st.session_state.approved = False
                st.session_state.audio_bytes = None
            except Exception as e:
                st.error(f"生成失敗: {e}")

    # ---- Step 2: スクリプト確認 ----
    if st.session_state.script:
        st.subheader("2. スクリプト確認・編集")
        st.session_state.script = st.text_area(
            "生成スクリプト (編集可)",
            value=st.session_state.script,
            height=380,
        )
        parsed = parse_script(st.session_state.script)
        st.caption(
            f"検出行数: {len(parsed)} / 検出話者: "
            + (", ".join(sorted({s for s, _ in parsed})) or "なし")
        )

        cols = st.columns([1, 1, 4])
        with cols[0]:
            if st.button("承認する", type="primary", disabled=not parsed):
                st.session_state.approved = True
                st.session_state.audio_bytes = None
        with cols[1]:
            if st.button("承認を取り消す", disabled=not st.session_state.approved):
                st.session_state.approved = False

        if st.session_state.approved:
            st.success("承認済み。下の「3. 音声合成」で音声化できます。")

    # ---- Step 3: 音声合成 ----
    if st.session_state.approved and st.session_state.script:
        st.subheader("3. 音声合成")
        parsed = parse_script(st.session_state.script)
        if not parsed:
            st.warning("スクリプトから話者行を検出できませんでした。")
            return

        speaker_names = sorted({s for s, _ in parsed})
        st.markdown("**話者への声 (voice) 割り当て**")
        voice_map: dict = {}
        cols = st.columns(min(len(speaker_names), 4) or 1)
        for i, name in enumerate(speaker_names):
            with cols[i % len(cols)]:
                voice_map[name] = st.selectbox(
                    name,
                    VOICES,
                    index=i % len(VOICES),
                    key=f"voice_{name}",
                )

        opt_cols = st.columns(2)
        with opt_cols[0]:
            speed = st.slider(
                "話速 (tts-1 / tts-1-hd のみ)",
                0.5, 2.0, 1.0, 0.05,
                disabled=tts_model not in ("tts-1", "tts-1-hd"),
            )
        with opt_cols[1]:
            instructions = st.text_input(
                "トーン指示 (gpt-4o-mini-tts のみ)",
                "落ち着いた日本語のビジネス会話のトーンで。",
                disabled=tts_model == "tts-1" or tts_model == "tts-1-hd",
            )

        if st.button("音声を生成", type="primary"):
            client = get_client(api_key)
            try:
                st.session_state.audio_bytes = synthesize(
                    client, tts_model, parsed, voice_map, speed, instructions
                )
            except Exception as e:
                st.error(f"音声合成失敗: {e}")

        if st.session_state.audio_bytes:
            st.audio(st.session_state.audio_bytes, format="audio/mp3")
            st.download_button(
                "MP3をダウンロード",
                data=st.session_state.audio_bytes,
                file_name="transcript.mp3",
                mime="audio/mpeg",
            )


if __name__ == "__main__":
    main()
