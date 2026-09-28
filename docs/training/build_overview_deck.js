const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const md = require("react-icons/md");

const SKILL_PATH = "/root/.claude/skills/synced/2fa6c4d3-4c91-4b46-9ad7-4c1eefa4d0c1_67a0bcab-c9c5-419c-92f4-750343be7a59/bo-presentation";
const OUT = __dirname;
const OUTFILE = process.argv[2] || OUT + "/BringOut_全体像研修.pptx";

const F = "BIZ UDPGothic";
const TF = "Yu Gothic";
const P = "7724EB", LP = "F3EAFD", G = "F5F5F5", SUB = "666666", TXT = "333333";

async function icon(Comp, color = "#" + P) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color, size: "256" }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Bring Out 全体像ガイド";
let n = 0;

function T(slide, text, opts) {
  slide.addText(text, Object.assign({ fontFace: F, color: TXT, isTextBox: true, lineSpacingMultiple: 1.2, margin: 0.05 }, opts));
}
function box(slide, x, y, w, h, color) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color }, line: { color, width: 0 } });
}
function common(slide) {
  n++;
  slide.addImage({ path: SKILL_PATH + "/assets/master-logo.png", x: 10.77, y: 0.27, w: 1.90, h: 0.31 });
  slide.addImage({ path: OUT + "/gradient_accent.png", x: 0.67, y: 0.74, w: 1.52, h: 0.04 });
  slide.addImage({ path: OUT + "/gradient_bottom_line.png", x: 0, y: 7.46, w: 13.33, h: 0.04 });
  T(slide, `Confidential ©${new Date().getFullYear()} BringOut.inc`, { x: 0.64, y: 7.24, w: 3.42, h: 0.24, fontSize: 8, color: "999999", lineSpacingMultiple: 1 });
  T(slide, String(n), { x: 12.0, y: 7.24, w: 0.8, h: 0.24, fontSize: 8, color: "999999", align: "right", lineSpacingMultiple: 1 });
}
function content(title, headline, section) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  common(s);
  T(s, title, { x: 0.65, y: 0.10, w: 9.0, h: 0.60, fontSize: 24, bold: true, color: "000000", valign: "middle" });
  if (section) T(s, section, { x: 9.0, y: 0.60, w: 3.67, h: 0.3, fontSize: 10, color: P, align: "right", bold: true });
  T(s, headline, { x: 0.67, y: 0.84, w: 12.0, h: 0.45, fontSize: 18, color: SUB });
  return s;
}
function numCircle(s, x, y, d, label, size = 14) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: P }, line: { color: P, width: 0 } });
  T(s, label, { x, y, w: d, h: d, fontSize: size, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1 });
}
function rightArrow(s, x, y, w, h, color = P) {
  s.addShape(pres.shapes.RIGHT_ARROW, { x, y, w, h, fill: { color }, line: { color, width: 0 } });
}

(async () => {
  const I = {};
  for (const k of ["MdAccountTree", "MdAssignment", "MdSchedule", "MdSearch", "MdPerson", "MdBusinessCenter", "MdHandshake",
    "MdInsights", "MdSupportAgent", "MdDashboard", "MdSmartToy", "MdRoute", "MdGroups", "MdLayers", "MdSchool", "MdMenuBook",
    "MdHelpOutline", "MdTravelExplore", "MdApartment", "MdVideoLibrary", "MdAutorenew", "MdFlag", "MdTrendingUp", "MdRecordVoiceOver",
    "MdStars", "MdTrackChanges", "MdTune"]) I[k] = await icon(md[k]);
  I.white = {};
  for (const k of ["MdPerson", "MdBusinessCenter", "MdHandshake", "MdInsights", "MdSupportAgent", "MdDashboard", "MdSmartToy"]) I.white[k] = await icon(md[k], "#FFFFFF");

  // ===== 1. Cover =====
  {
    const s = pres.addSlide();
    s.background = { color: "FFFFFF" };
    const B = 0.12;
    s.addImage({ path: OUT + "/gradient_top_border.png", x: 0, y: 0, w: 13.33, h: B });
    s.addImage({ path: OUT + "/gradient_bottom_border.png", x: 0, y: 7.50 - B, w: 13.33, h: B });
    s.addImage({ path: OUT + "/gradient_left_border.png", x: 0, y: 0, w: B, h: 7.50 });
    s.addImage({ path: OUT + "/gradient_right_border.png", x: 13.33 - B, y: 0, w: B, h: 7.50 });
    T(s, "新メンバー研修 Module 0", { x: 0.66, y: 3.01, w: 12.0, h: 0.41, fontSize: 13, color: SUB });
    T(s, "Bring Out 全体像ガイド", { x: 0.66, y: 3.56, w: 12.0, h: 0.76, fontSize: 28, bold: true, color: "000000" });
    T(s, "アカウントジャーニー・役割・プロダクトの関係と、研修プログラムの地図", { x: 0.66, y: 4.30, w: 12.0, h: 0.45, fontSize: 16, color: SUB });
    T(s, "2026年9月", { x: 0.66, y: 4.97, w: 2.23, h: 0.28, fontSize: 12, color: "999999" });
    s.addImage({ path: SKILL_PATH + "/assets/cover-logo.png", x: 9.33, y: 6.52, w: 3.32, h: 0.54 });
  }

  // ===== 2. Summary =====
  {
    const s = pres.addSlide();
    s.background = { color: "FFFFFF" };
    common(s);
    T(s, "本日の要旨", { x: 0.65, y: 0.10, w: 9.0, h: 0.60, fontSize: 24, bold: true, color: "000000", valign: "middle" });
    const items = [
      "研修の課題は「中身の質」ではなく「順番と置き場所」。本資料を、最初に全体像を示す入口（Module 0）として位置づける",
      "典型的なアカウントジャーニーを6フェーズで整理し、顧客・Bring Out・プロダクト・C3BO（Claude）の7つの役割を対応づけた",
      "プロジェクトは「導入初期（約2〜3か月）」と「運用中コンサル（月次サイクル）」の2種類で、進め方と担当を整理した",
      "プロダクトを「エンドユーザーが見る」「Bring Outがセットアップする」「セットアップをラクにする社内ツール」の3層で整理した",
      "個別研修を3ステージ・9モジュール（M0〜M8）＋実技課題・OJTに再編し、Week1で全体像から実技までを終える構成を提案する",
    ];
    const tc = [{ text: "本日のご報告:", options: { bold: true, fontSize: 14, breakLine: true, color: "000000" } }];
    items.forEach((t, i) => tc.push({ text: t, options: { bullet: true, indentLevel: 1, fontSize: 13, color: TXT, breakLine: i < items.length - 1 } }));
    s.addText(tc, { x: 0.67, y: 1.40, w: 11.5, h: 3.9, fontFace: F, paraSpaceAfter: 8, lineSpacingMultiple: 1.4, valign: "top", isTextBox: true });
    // 本資料の構成（読み方）
    const parts = [["1", "アカウントジャーニーと役割", "いつ・誰が動くか"], ["2", "プロジェクトの進め方", "導入初期／運用コンサル"], ["3", "プロダクトの関係性", "見る・設定する・ラクにする"], ["4", "研修プログラム全体像", "この後の個別研修の地図"]];
    const w = 2.85, g = 0.2;
    parts.forEach((p, i) => {
      const x = 0.67 + i * (w + g), y = 5.45;
      box(s, x, y, w, 1.35, LP);
      numCircle(s, x + 0.2, y + 0.22, 0.45, p[0]);
      T(s, p[1], { x: x + 0.75, y: y + 0.15, w: w - 0.85, h: 0.6, fontSize: 13, bold: true, color: "000000", valign: "middle" });
      T(s, p[2], { x: x + 0.2, y: y + 0.82, w: w - 0.3, h: 0.4, fontSize: 12, color: SUB });
    });
  }

  // ===== 3. 課題と本資料の狙い =====
  {
    const s = content("研修コンテンツの課題と本資料の狙い", "4つの課題に「全体像を先に示す」「タスク単位で見せる」「置き場所を案内する」で応える");
    const rows = [
      [I.MdAccountTree, "プロダクトの全体像が掴めない", "音声→テンプレート→解析→ダッシュボードのつながりが見えず、「できる／できない」が判断できない", "3層構造とデータの流れを最初に1枚で示す（第3章）"],
      [I.MdAssignment, "実際に何をすればいいか分からない", "「何ができるか」は分かっても「自分がどう作るか」が見えない", "ジャーニー×役割、プロジェクトの進め方をタスク単位で示す（第1・2章）"],
      [I.MdSchedule, "ペースが遅く、量が多い", "プロダクト系10本・約10時間がweek1から四半期先まで散らばる", "3ステージ・9モジュールに再編し、Week1に集約（第4章）"],
      [I.MdSearch, "どこを見ればいいか分からない", "機能マスタ・FAQ等の情報源はあるが研修での案内がない", "「困ったらここ」の情報源ガイドを研修に組み込む（第4章）"],
    ];
    T(s, "現状の課題", { x: 0.67, y: 1.40, w: 6.4, h: 0.35, fontSize: 13, bold: true, color: SUB });
    T(s, "本資料・新研修での対応", { x: 7.87, y: 1.40, w: 4.8, h: 0.35, fontSize: 13, bold: true, color: P });
    const h = 1.2, g = 0.14;
    rows.forEach((r, i) => {
      const y = 1.80 + i * (h + g);
      box(s, 0.67, y, 6.6, h, G);
      s.addImage({ data: r[0], x: 0.85, y: y + 0.18, w: 0.42, h: 0.42 });
      T(s, r[1], { x: 1.4, y: y + 0.12, w: 5.7, h: 0.4, fontSize: 14, bold: true, color: "000000", valign: "middle" });
      T(s, r[2], { x: 1.4, y: y + 0.52, w: 5.75, h: 0.62, fontSize: 12, color: SUB, valign: "top" });
      rightArrow(s, 7.37, y + h / 2 - 0.18, 0.4, 0.36);
      box(s, 7.87, y, 4.8, h, LP);
      T(s, r[3], { x: 8.05, y, w: 4.5, h, fontSize: 13, bold: true, color: "000000", valign: "middle" });
    });
  }

  // ===== 4. 典型的なアカウントジャーニー =====
  {
    const s = content("典型的なアカウントジャーニー", "受注から更新・拡大まで6フェーズ。前半が「導入初期」、後半が「運用中コンサル」のプロジェクト", "1. アカウントジャーニーと役割");
    const ph = [
      ["受注・契約", "〜0か月", "導入目的と期待値を顧客と合意する", "提案書・導入計画"],
      ["キックオフ", "0〜1か月", "体制・KPI・対象範囲を確定する", "キックオフ資料・スケジュール"],
      ["初期設定", "1〜2か月", "顧客の営業の型を解析設定に反映する", "テンプレート・ダッシュボード"],
      ["展開・定着", "2〜3か月", "現場が日常的に使う状態をつくる", "説明会・利用ガイド"],
      ["運用・活用", "3か月〜", "データを営業成果の改善につなげる", "月次レポート・改善施策"],
      ["更新・拡大", "12か月〜", "成果を示し、次の打ち手を合意する", "効果検証・拡大提案"],
    ];
    const w = 1.88, g = 0.144, x0 = 0.67;
    ph.forEach((p, i) => {
      const x = x0 + i * (w + g);
      s.addShape(pres.shapes.CHEVRON, { x, y: 1.45, w: w + 0.1, h: 0.75, fill: { color: P }, line: { color: P, width: 0 } });
      T(s, `${i + 1}. ${p[0]}`, { x: x + 0.2, y: 1.45, w: w - 0.25, h: 0.75, fontSize: 13, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
      box(s, x, 2.35, w, 3.25, LP);
      T(s, p[1], { x: x + 0.12, y: 2.45, w: w - 0.24, h: 0.35, fontSize: 12, bold: true, color: P });
      T(s, "ゴール", { x: x + 0.12, y: 2.85, w: w - 0.24, h: 0.3, fontSize: 11, color: SUB });
      T(s, p[2], { x: x + 0.12, y: 3.15, w: w - 0.24, h: 1.05, fontSize: 12, bold: true, color: "000000", valign: "top" });
      T(s, "主なアウトプット", { x: x + 0.12, y: 4.35, w: w - 0.24, h: 0.3, fontSize: 11, color: SUB });
      T(s, p[3], { x: x + 0.12, y: 4.65, w: w - 0.24, h: 0.85, fontSize: 12, color: TXT, valign: "top" });
    });
    // プロジェクト区分バー
    const bar = (i0, i1, label, fill, fc) => {
      const x = x0 + i0 * (w + g), xe = x0 + i1 * (w + g) + w;
      box(s, x, 5.78, xe - x, 0.5, fill);
      T(s, label, { x, y: 5.78, w: xe - x, h: 0.5, fontSize: 13, bold: true, color: fc, align: "center", valign: "middle" });
    };
    bar(0, 0, "営業フェーズ", G, SUB);
    bar(1, 3, "導入初期プロジェクト（約2〜3か月）", P, "FFFFFF");
    bar(4, 5, "運用中コンサル（月次サイクル）", P, "FFFFFF");
    T(s, "期間は標準的な目安。顧客規模・対象部署数により前後する", { x: 0.67, y: 6.45, w: 12.0, h: 0.35, fontSize: 11, color: "999999" });
  }

  // ===== 5. 登場人物と役割 =====
  {
    const s = content("アカウントに関わる7つの役割", "顧客側2者・Bring Out側3者に、プロダクトとC3BO（Claude）が加わってアカウントを動かす", "1. アカウントジャーニーと役割");
    const groups = [
      { name: "顧客", x: 0.67, w: 3.7, items: [
        ["MdPerson", "エンドユーザー", "顧客の営業担当・マネージャー", "商談を録音し、解析結果やフィードバックで日々の商談を改善する。マネージャーはダッシュボードでチームを把握"],
        ["MdBusinessCenter", "事務局", "営業企画・DX推進などの推進担当", "社内の導入推進役でBring Outとの窓口。目的・KPIの合意、利用ルール整備、現場への展開を担う"]] },
      { name: "Bring Out（人）", x: 4.52, w: 4.3, items: [
        ["MdHandshake", "アカウントリード", "アカウント全体の責任者", "受注から更新・拡大まで関係を築き、期待値・体制・スケジュールを管理する"],
        ["MdInsights", "コンサル", "営業課題と設計・分析のプロ", "評価観点とテンプレートを設計し、データから示唆を出して改善施策を提案する"],
        ["MdSupportAgent", "CS", "利用定着と運用の支援", "設定・連携の実作業、問い合わせ対応、利用状況のモニタリングと再設定を担う"]] },
      { name: "仕組み", x: 8.97, w: 3.7, items: [
        ["MdDashboard", "Bring Out プロダクト", "顧客が使う商談解析SaaS", "音声を書き起こし、テンプレートに沿って解析し、ダッシュボード・CAAで可視化する"],
        ["MdSmartToy", "C3BO（Claude）", "Bring Outメンバー用の社内AI", "テンプレート生成・検証、デモ作成、データ分析などを代行し、セットアップと分析をラクにする"]] },
    ];
    groups.forEach(gp => {
      T(s, gp.name, { x: gp.x, y: 1.40, w: gp.w, h: 0.35, fontSize: 13, bold: true, color: P });
      const top = 1.80, total = 5.05, gap = 0.12, k = gp.items.length, h = (total - gap * (k - 1)) / k;
      gp.items.forEach((it, i) => {
        const y = top + i * (h + gap);
        box(s, gp.x, y, gp.w, h, i % 1 === 0 ? LP : LP);
        s.addShape(pres.shapes.OVAL, { x: gp.x + 0.15, y: y + 0.15, w: 0.5, h: 0.5, fill: { color: P }, line: { color: P, width: 0 } });
        s.addImage({ data: I.white[it[0]], x: gp.x + 0.25, y: y + 0.25, w: 0.3, h: 0.3 });
        T(s, it[1], { x: gp.x + 0.75, y: y + 0.1, w: gp.w - 0.85, h: 0.32, fontSize: 14, bold: true, color: "000000" });
        T(s, it[2], { x: gp.x + 0.75, y: y + 0.42, w: gp.w - 0.85, h: 0.28, fontSize: 11, color: SUB, lineSpacingMultiple: 1 });
        T(s, it[3], { x: gp.x + 0.15, y: y + 0.78, w: gp.w - 0.3, h: h - 0.85, fontSize: 12, color: TXT, valign: "top" });
      });
    });
  }

  // ===== 6. ジャーニー × 役割 =====
  {
    const s = content("ジャーニー × 役割：誰がいつ何をするか", "同じアカウントでもフェーズごとに主役が変わる。自分の出番と前後の担当を押さえる", "1. アカウントジャーニーと役割");
    const hdr = ["", "受注・契約", "キックオフ", "初期設定", "展開・定着", "運用・活用", "更新・拡大"];
    const data = [
      ["エンドユーザー", "—", "説明会で目的を理解", "パイロットで試用", "録音・結果を確認", "結果を商談改善に活用", "成果・声を共有"],
      ["事務局", "導入目的を社内合意", "KPI・対象範囲を決定", "評価観点を提供", "社内展開・ルール整備", "定例で施策を判断", "効果を社内報告"],
      ["アカウントリード", "提案・期待値合意", "体制・計画を主導", "進捗・リスク管理", "定着状況を確認", "関係深耕・課題発掘", "更新・拡大提案"],
      ["コンサル", "課題仮説の整理", "要件ヒアリング", "テンプレート設計", "精度チューニング", "分析・示唆出し", "成果の振り返り"],
      ["CS", "—", "環境・アカウント準備", "設定・連携の実作業", "問い合わせ・利用促進", "ヘルス管理・再設定", "利用実績を集計"],
      ["BOプロダクト", "デモで価値を体感", "—", "テンプレートを反映", "解析・結果を表示", "ダッシュボード・CAA", "利用データを提供"],
      ["C3BO（Claude）", "デモ・ダミー商談生成", "議事録・要件整理", "YAML生成・検証", "解析結果の点検", "MCPでデータ分析", "振り返り資料作成"],
    ];
    // 主担当ハイライト（行, 列）
    const hi = new Set(["2,1", "2,2", "2,6", "3,3", "3,4", "3,5", "4,4", "4,5", "1,2", "1,4"]);
    const rows = [hdr.map((h, j) => ({ text: h, options: { bold: true, color: "FFFFFF", fill: { color: j === 0 ? "FFFFFF" : P }, align: "center" } }))];
    data.forEach((r, i) => rows.push(r.map((c, j) => {
      if (j === 0) return { text: c, options: { bold: true, fill: { color: G }, color: "000000" } };
      const on = hi.has(`${i},${j}`);
      return { text: c, options: { fill: { color: on ? LP : "FFFFFF" }, color: on ? "000000" : TXT, bold: on, align: "center" } };
    })));
    s.addTable(rows, { x: 0.67, y: 1.42, w: 12.0, colW: [1.92, 1.68, 1.68, 1.68, 1.68, 1.68, 1.68], rowH: [0.42, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62],
      fontSize: 12, fontFace: TF, valign: "middle", border: { type: "solid", pt: 0.5, color: "E5E5E5" }, margin: 0.05 });
    box(s, 0.67, 6.45, 0.3, 0.22, LP);
    T(s, "＝そのフェーズでBring Out側の主担当・顧客側の意思決定者になる役割", { x: 1.05, y: 6.38, w: 11.0, h: 0.36, fontSize: 11, color: SUB, valign: "middle" });
  }

  // ===== 7. 2種類のプロジェクト =====
  {
    const s = content("プロジェクトは2種類：導入初期と運用中コンサル", "導入初期は「使える状態をつくる」、運用中コンサルは「データで成果を出す」。目的が違えば主役も違う", "2. プロジェクトの進め方");
    const labels = ["目的", "期間", "BO側の主担当", "顧客側の関わり", "ゴール", "主な成果物"];
    const cols = [
      { t: "導入初期プロジェクト", ic: I.MdFlag, v: ["顧客の営業の型をプロダクトに反映し、現場で使われる状態をつくる", "約2〜3か月（キックオフ〜定着）", "アカウントリード（推進）、コンサル（設計）、CS（設定）", "事務局が中心。現場はパイロットで参加", "解析が意図どおり動き、利用が定着している", "テンプレート、ダッシュボード、利用ガイド"] },
      { t: "運用中コンサル", ic: I.MdAutorenew, v: ["蓄積した商談データから示唆を出し、営業成果の改善につなげる", "月次サイクルで継続", "コンサル（分析・提案）、CS（再設定・ヘルス管理）", "事務局＋営業マネージャーが施策を判断", "施策が回り、成果指標が改善している", "月次レポート、改善施策、テンプレート改訂"] },
    ];
    const lw = 1.9, cw = 4.95, g = 0.1, top = 1.42, hh = 0.62, rh = 0.72;
    cols.forEach((c, j) => {
      const x = 0.67 + lw + g + j * (cw + g);
      box(s, x, top, cw, hh, P);
      s.addImage({ data: j === 0 ? I.white.MdHandshake : I.white.MdInsights, x: x + 0.2, y: top + 0.14, w: 0.34, h: 0.34 });
      T(s, c.t, { x: x + 0.65, y: top, w: cw - 0.8, h: hh, fontSize: 16, bold: true, color: "FFFFFF", valign: "middle" });
    });
    labels.forEach((l, i) => {
      const y = top + hh + g + i * (rh + g);
      box(s, 0.67, y, lw, rh, G);
      T(s, l, { x: 0.8, y, w: lw - 0.2, h: rh, fontSize: 13, bold: true, color: "000000", valign: "middle" });
      cols.forEach((c, j) => {
        const x = 0.67 + lw + g + j * (cw + g);
        box(s, x, y, cw, rh, LP);
        T(s, c.v[i], { x: x + 0.15, y, w: cw - 0.3, h: rh, fontSize: 12, color: "000000", valign: "middle" });
      });
    });
  }

  // ===== 8. 導入初期の進め方 =====
  {
    const s = content("導入初期プロジェクトの進め方", "約8週間・5ステップ。設計と検証をC3BOで前倒しし、パイロットで精度を上げてから全体展開する", "2. プロジェクトの進め方");
    const st = [
      ["キックオフ", "W0", ["導入目的・KPIの合意", "対象部署・商談種別の決定", "体制・定例の設定"], "アカウントリード", "議事録から論点・宿題を整理"],
      ["要件整理", "W1〜2", ["評価観点のヒアリング", "トークスクリプト等の収集", "見たい指標の整理"], "コンサル", "ヒアリング内容を要件書に整理"],
      ["設計・設定", "W2〜4", ["テンプレート（解析項目）設計", "ダッシュボード構成", "録音・連携の設定"], "コンサル＋CS", "YAML生成とダミー商談での検証"],
      ["パイロット", "W4〜6", ["一部チームで試用", "解析結果のレビュー", "項目・精度のチューニング"], "コンサル", "解析結果の点検と修正案"],
      ["展開・定着", "W6〜8", ["全体説明会・利用ガイド", "利用状況のモニタリング", "運用体制へ引継ぎ"], "CS＋事務局", "ガイド・FAQの下書き"],
    ];
    const w = 2.2, g = 0.25;
    st.forEach((p, i) => {
      const x = 0.67 + i * (w + g), y = 1.95;
      numCircle(s, x + w / 2 - 0.27, 1.40, 0.54, String(i + 1), 16);
      if (i < st.length - 1) rightArrow(s, x + w + 0.02, 1.52, g - 0.04, 0.3);
      box(s, x, y, w, 4.95, LP);
      T(s, p[0], { x, y: y + 0.12, w, h: 0.4, fontSize: 16, bold: true, color: "000000", align: "center" });
      T(s, p[1], { x, y: y + 0.52, w, h: 0.3, fontSize: 12, bold: true, color: P, align: "center" });
      s.addText(p[2].map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < p[2].length - 1 } })), {
        x: x + 0.1, y: y + 0.95, w: w - 0.2, h: 1.75, fontSize: 12, fontFace: F, color: TXT, valign: "top", paraSpaceAfter: 4, lineSpacingMultiple: 1.2, isTextBox: true });
      box(s, x + 0.12, y + 2.8, w - 0.24, 0.9, "FFFFFF");
      T(s, "主担当", { x: x + 0.2, y: y + 2.85, w: w - 0.4, h: 0.28, fontSize: 11, color: SUB });
      T(s, p[3], { x: x + 0.2, y: y + 3.13, w: w - 0.4, h: 0.5, fontSize: 13, bold: true, color: "000000" });
      box(s, x + 0.12, y + 3.8, w - 0.24, 1.03, "FFFFFF");
      s.addImage({ data: I.MdSmartToy, x: x + 0.2, y: y + 3.86, w: 0.24, h: 0.24 });
      T(s, "C3BO活用", { x: x + 0.48, y: y + 3.84, w: w - 0.6, h: 0.28, fontSize: 11, color: P, bold: true });
      T(s, p[4], { x: x + 0.2, y: y + 4.13, w: w - 0.4, h: 0.65, fontSize: 12, color: "000000", valign: "top" });
    });
  }

  // ===== 9. 運用中コンサルの進め方 =====
  {
    const s = content("運用中コンサルの進め方", "月次で「見る→示唆→合意→反映」を回す。テンプレートは一度作って終わりではなく育てるもの", "2. プロジェクトの進め方");
    const cyc = [
      ["データを見る", "ダッシュボード・CAAで商談の傾向を把握。C3BOがMCP経由で一次分析", I.MdDashboard, "担当：コンサル／C3BO"],
      ["示唆を出す", "勝ちパターン・失注要因・顧客の声を整理し、月次レポートにまとめる", I.MdInsights, "成果物：月次レポート"],
      ["施策を合意する", "定例で事務局・営業マネージャーと優先順位と打ち手を決める", I.MdHandshake, "場：月次定例（事務局・マネージャー）"],
      ["現場に反映する", "テンプレート改訂・再設定、トーク改善や育成への展開を行う", I.MdTune, "担当：CS（再設定）／事務局（展開）"],
    ];
    const cw = 3.6, ch = 2.35, gx = 0.7, gy = 0.5, x0 = 0.67, y0 = 1.45;
    const pos = [[0, 0], [1, 0], [1, 1], [0, 1]];
    cyc.forEach((c, i) => {
      const x = x0 + pos[i][0] * (cw + gx), y = y0 + pos[i][1] * (ch + gy);
      box(s, x, y, cw, ch, LP);
      numCircle(s, x + 0.2, y + 0.2, 0.5, String(i + 1));
      T(s, c[0], { x: x + 0.85, y: y + 0.2, w: cw - 1.0, h: 0.5, fontSize: 16, bold: true, color: "000000", valign: "middle" });
      T(s, c[1], { x: x + 0.2, y: y + 0.9, w: cw - 0.4, h: 0.8, fontSize: 12, color: TXT, valign: "top" });
      box(s, x + 0.2, y + ch - 0.62, cw - 0.4, 0.45, "FFFFFF");
      T(s, c[3], { x: x + 0.3, y: y + ch - 0.62, w: cw - 0.6, h: 0.45, fontSize: 12, bold: true, color: P, valign: "middle" });
    });
    // 矢印（時計回り）
    rightArrow(s, x0 + cw + 0.12, y0 + ch / 2 - 0.2, gx - 0.24, 0.4);
    s.addShape(pres.shapes.DOWN_ARROW, { x: x0 + cw + gx + cw / 2 - 0.2, y: y0 + ch + 0.06, w: 0.4, h: gy - 0.12, fill: { color: P }, line: { color: P, width: 0 } });
    s.addShape(pres.shapes.LEFT_ARROW, { x: x0 + cw + 0.12, y: y0 + ch + gy + ch / 2 - 0.2, w: gx - 0.24, h: 0.4, fill: { color: P }, line: { color: P, width: 0 } });
    s.addShape(pres.shapes.UP_ARROW, { x: x0 + cw / 2 - 0.2, y: y0 + ch + 0.06, w: 0.4, h: gy - 0.12, fill: { color: P }, line: { color: P, width: 0 } });
    T(s, "毎月", { x: x0 + cw + 0.05, y: y0 + ch + 0.05, w: gx - 0.1, h: gy - 0.1, fontSize: 12, bold: true, color: P, align: "center", valign: "middle", margin: 0 });
    // 右：典型テーマ
    const rx = 9.0, rw = 3.67;
    box(s, rx, 1.45, rw, 5.2, G);
    T(s, "よくあるテーマ", { x: rx + 0.2, y: 1.55, w: rw - 0.4, h: 0.4, fontSize: 14, bold: true, color: "000000" });
    const th = [[I.MdStars, "トップ営業の型化", "成果の出る進め方を抽出し全体に展開"], [I.MdTrackChanges, "失注・停滞要因の分析", "どこで止まるかを商談データで特定"],
      [I.MdRecordVoiceOver, "顧客の声（VoC）の集約", "要望・懸念を製品や企画にフィードバック"], [I.MdSchool, "育成・コーチング", "個人別の強み・課題を面談に活用"]];
    th.forEach((t, i) => {
      const y = 2.05 + i * 1.12;
      s.addImage({ data: t[0], x: rx + 0.2, y: y + 0.05, w: 0.4, h: 0.4 });
      T(s, t[1], { x: rx + 0.72, y, w: rw - 0.85, h: 0.38, fontSize: 13, bold: true, color: "000000" });
      T(s, t[2], { x: rx + 0.72, y: y + 0.38, w: rw - 0.85, h: 0.62, fontSize: 12, color: SUB, valign: "top" });
    });
  }

  // ===== 10. 3層構造 =====
  {
    const s = content("プロダクトの3層構造", "顧客が見る画面の裏に、Bring Outの設定があり、その設定をC3BOなど社内ツールが支えている", "3. プロダクトの関係性");
    const layers = [
      ["エンドユーザーが見るプロダクト", "使う人：顧客の営業・マネージャー・事務局", ["録画・書き起こし", "商談ごとの解析結果", "ダッシュボード", "CAA（複数面談分析）"], I.white.MdPerson],
      ["Bring Outがセットアップするプロダクト", "設定する人：コンサル・CS", ["テンプレート（解析項目）", "トピック・評価基準", "ダッシュボード構成", "CAA分析グループ", "録音・外部連携"], I.white.MdSupportAgent],
      ["セットアップをラクにする社内ツール", "使う人：Bring Outメンバー", ["C3BO\n（Claude）", "テンプレートYAML生成", "ダミー商談音声生成", "デモダッシュボード作成", "MCPでのデータ分析"], I.white.MdSmartToy],
    ];
    const lh = 1.5, gap = 0.5, lw = 3.4;
    layers.forEach((L, i) => {
      const y = 1.45 + i * (lh + gap);
      box(s, 0.67, y, lw, lh, P);
      s.addImage({ data: L[3], x: 0.82, y: y + 0.17, w: 0.36, h: 0.36 });
      T(s, L[0], { x: 1.25, y: y + 0.08, w: lw - 0.65, h: 0.62, fontSize: 13, bold: true, color: "FFFFFF", valign: "middle" });
      T(s, L[1], { x: 0.82, y: y + 0.75, w: lw - 0.25, h: 0.45, fontSize: 11, color: "FFFFFF", valign: "top" });
      box(s, 0.67 + lw, y, 12.0 - lw, lh, LP);
      const k = L[2].length, pw = (12.0 - lw - 0.3 - 0.15 * (k - 1)) / k;
      L[2].forEach((t, j) => {
        const px = 0.67 + lw + 0.15 + j * (pw + 0.15);
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: y + 0.3, w: pw, h: lh - 0.6, fill: { color: "FFFFFF" }, line: { color: "D9C4F8", width: 0.75 }, rectRadius: 0.08 });
        T(s, t, { x: px + 0.05, y: y + 0.3, w: pw - 0.1, h: lh - 0.6, fontSize: 12, bold: j === 0 && i === 2, color: "000000", align: "center", valign: "middle" });
      });
    });
    const arr = [["設定した内容が、解析結果や画面として顧客に届く", 0], ["ドラフト生成と事前検証で、設定を速く・正確にする", 1]];
    arr.forEach(([t, i]) => {
      const y = 1.45 + lh + i * (lh + gap);
      s.addShape(pres.shapes.UP_ARROW, { x: 2.17, y: y + 0.05, w: 0.4, h: gap - 0.1, fill: { color: P }, line: { color: P, width: 0 } });
      T(s, t, { x: 2.75, y, w: 9.5, h: gap, fontSize: 12, bold: true, color: P, valign: "middle" });
    });
  }

  // ===== 11. データの流れ =====
  {
    const s = content("データの流れと、各段階に関わる人", "音声からダッシュボードまでの5段階を押さえると「これはできる／できない」を自分で判断できる", "3. プロダクトの関係性");
    const cols = ["音声データ", "書き起こし", "テンプレート", "解析", "ダッシュボード・CAA"];
    const rows = [
      ["何が起きるか", ["商談を録音・アップロードする", "音声を話者別のテキストに変換する", "何を抽出・評価するかを定義する", "LLMがテンプレートに沿って項目を抽出・評価する", "結果を集計・横断分析し可視化する"]],
      ["主に関わる人", ["エンドユーザー", "プロダクト（自動）", "コンサルが設計、C3BOがドラフト", "プロダクト（自動）、コンサルが確認", "エンドユーザー・事務局が閲覧"]],
      ["BOが設定すること", ["録音方法・外部連携", "—", "解析項目・プロンプト・出力形式", "精度チューニング", "ダッシュボード構成・分析グループ"]],
    ];
    const lw = 1.9, cw = (12.0 - lw - 0.1) / 5, x0 = 0.67 + lw + 0.1;
    cols.forEach((c, j) => {
      const x = x0 + j * cw;
      s.addShape(pres.shapes.CHEVRON, { x, y: 1.45, w: cw + 0.12, h: 0.7, fill: { color: j === 2 ? P : LP }, line: { color: j === 2 ? P : LP, width: 0 } });
      T(s, c, { x: x + 0.22, y: 1.45, w: cw - 0.3, h: 0.7, fontSize: 13, bold: true, color: j === 2 ? "FFFFFF" : "000000", align: "center", valign: "middle", margin: 0 });
    });
    const rh = [1.3, 1.0, 1.0];
    let y = 2.3;
    rows.forEach((r, i) => {
      box(s, 0.67, y, lw, rh[i], G);
      T(s, r[0], { x: 0.8, y, w: lw - 0.2, h: rh[i], fontSize: 13, bold: true, color: "000000", valign: "middle" });
      r[1].forEach((t, j) => {
        const x = x0 + j * cw;
        box(s, x + 0.04, y, cw - 0.08, rh[i], j === 2 ? LP : "FAFAFA");
        T(s, t, { x: x + 0.12, y, w: cw - 0.24, h: rh[i], fontSize: 12, color: "000000", valign: "middle", align: "center" });
      });
      y += rh[i] + 0.1;
    });
    box(s, 0.67, 5.9, 12.0, 0.95, LP);
    s.addImage({ data: I.MdHelpOutline, x: 0.87, y: 6.15, w: 0.45, h: 0.45 });
    T(s, [{ text: "判断のコツ：", options: { bold: true, color: P } }, { text: "「この情報は取れる？」は多くの場合テンプレートの設計次第。音声に含まれていれば抽出でき、含まれていなければ取れない。見せ方はダッシュボードの設定で決まる", options: { color: "000000" } }],
      { x: 1.45, y: 5.9, w: 11.1, h: 0.95, fontSize: 12, valign: "middle" });
  }

  // ===== 12. C3BOで変わること =====
  {
    const s = content("C3BO（Claude）でセットアップはこう変わる", "ドラフトと事前検証をC3BOが担い、人は顧客との合意と最終判断に時間を使う", "3. プロダクトの関係性");
    const rows = [
      [I.MdTune, "テンプレート設計", "YAMLを手作業で記述。実データが来るまで出力を確認できない", "自然言語からYAMLを生成し、ダミー書き起こしで出力を事前検証", "YAMLジェネレーター"],
      [I.MdRecordVoiceOver, "デモ・検証データ", "商談音声やサンプルデータをその都度手配する", "シナリオを伝えるだけでダミー商談音声を生成", "ダミー商談生成"],
      [I.MdDashboard, "ダッシュボード提案", "データが溜まるまで完成イメージを見せにくい", "顧客シナリオに合わせたデモダッシュボードをすぐ作成", "ダッシュボード作成"],
      [I.MdInsights, "データ分析", "画面を行き来して手作業で集計・確認する", "MCP経由で商談データを対話的に分析", "MCPナビゲーター"],
    ];
    T(s, "これまで", { x: 1.4, y: 1.4, w: 4.5, h: 0.35, fontSize: 13, bold: true, color: SUB });
    T(s, "C3BOを使うと", { x: 6.7, y: 1.4, w: 4.0, h: 0.35, fontSize: 13, bold: true, color: P });
    T(s, "使うスキル", { x: 10.85, y: 1.4, w: 1.8, h: 0.35, fontSize: 13, bold: true, color: SUB });
    const h = 1.05, g = 0.15;
    rows.forEach((r, i) => {
      const y = 1.82 + i * (h + g);
      s.addImage({ data: r[0], x: 0.7, y: y + 0.12, w: 0.42, h: 0.42 });
      T(s, r[1], { x: 0.67, y: y + 0.58, w: 1.9, h: 0.45, fontSize: 12, bold: true, color: "000000" });
      box(s, 2.55, y, 3.6, h, G);
      T(s, r[2], { x: 2.7, y, w: 3.3, h, fontSize: 12, color: SUB, valign: "middle" });
      rightArrow(s, 6.22, y + h / 2 - 0.17, 0.4, 0.34);
      box(s, 6.7, y, 4.0, h, LP);
      T(s, r[3], { x: 6.85, y, w: 3.7, h, fontSize: 12, bold: true, color: "000000", valign: "middle" });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 10.85, y: y + 0.3, w: 1.82, h: 0.5, fill: { color: "FFFFFF" }, line: { color: P, width: 1 }, rectRadius: 0.1 });
      T(s, r[4], { x: 10.85, y: y + 0.3, w: 1.82, h: 0.5, fontSize: 11, color: P, bold: true, align: "center", valign: "middle", margin: 0 });
    });
    T(s, "C3BOの出力はドラフト。顧客への提示前に、必ず担当者が内容を確認する", { x: 0.67, y: 6.6, w: 12.0, h: 0.3, fontSize: 11, color: "999999" });
  }

  // ===== 13. 研修プログラム全体像 =====
  {
    const s = content("研修プログラムの全体像", "「全体を掴む→触って作る→運用で使いこなす」の3ステージ。全体像から始めて細部へ降りていく", "4. 研修プログラム全体像");
    const stages = [
      ["STAGE 1", "全体を掴む", "Week1 前半", [["M0", "全体像ガイド（本資料）", "ジャーニー・役割・3層構造"], ["M1", "アカウントジャーニーと役割", "事例でフェーズと担当を追う"], ["M2", "エンドユーザー体験", "顧客の立場でプロダクトを触る"], ["M3", "情報源の歩き方", "困ったときにどこを見るか"]]],
      ["STAGE 2", "触って作る", "Week1 後半", [["M4", "テンプレートと解析", "解析項目を設計し結果を確認"], ["M5", "ダッシュボードとCAA", "見せ方と横断分析を設定"], ["M6", "C3BOでラクにする", "YAML生成・デモ作成・分析"], ["課題", "模擬顧客で一式セットアップ", "M4〜M6を通しで実践"]]],
      ["STAGE 3", "運用で使いこなす", "Week2〜 配属後", [["M7", "導入初期PJの進め方", "8週間の動き方とチェック項目"], ["M8", "運用コンサルの進め方", "月次サイクルとレポート作成"], ["OJT", "実案件シャドーイング", "定例・設定作業に同席"], ["振返", "1か月後の振り返り", "つまずきを研修へ還元"]]],
    ];
    const w = 3.85, g = 0.225;
    stages.forEach((st, i) => {
      const x = 0.67 + i * (w + g);
      box(s, x, 1.42, w, 0.85, P);
      T(s, st[0], { x: x + 0.15, y: 1.45, w: 1.3, h: 0.35, fontSize: 11, bold: true, color: "FFFFFF" });
      T(s, st[2], { x: x + w - 2.0, y: 1.45, w: 1.85, h: 0.35, fontSize: 11, color: "FFFFFF", align: "right" });
      T(s, st[1], { x: x + 0.15, y: 1.78, w: w - 0.3, h: 0.42, fontSize: 16, bold: true, color: "FFFFFF" });
      if (i < 2) rightArrow(s, x + w + 0.02, 1.67, g - 0.04, 0.36);
      st[3].forEach((m, k) => {
        const y = 2.4 + k * 1.13, isExtra = !/^M\d/.test(m[0]);
        box(s, x, y, w, 1.03, isExtra ? G : LP);
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: y + 0.24, w: 0.62, h: 0.55, fill: { color: isExtra ? "FFFFFF" : P }, line: { color: P, width: 1 }, rectRadius: 0.08 });
        T(s, m[0], { x: x + 0.15, y: y + 0.24, w: 0.62, h: 0.55, fontSize: 12, bold: true, color: isExtra ? P : "FFFFFF", align: "center", valign: "middle", margin: 0 });
        T(s, m[1], { x: x + 0.9, y: y + 0.1, w: w - 1.0, h: 0.42, fontSize: 13, bold: true, color: "000000", valign: "middle" });
        T(s, m[2], { x: x + 0.9, y: y + 0.52, w: w - 1.0, h: 0.4, fontSize: 12, color: SUB, valign: "top" });
      });
    });
  }

  // ===== 14. ロール別受講パス =====
  {
    const s = content("ロール別の受講パスとスケジュール", "全員共通の土台はWeek1前半でそろえ、実技はロール別に深掘り。1週間で配属準備を終える", "4. 研修プログラム全体像");
    const H = ["モジュール", "時期", "形式", "目安", "アカウントリード", "コンサル", "CS"];
    const R = [
      ["M0 全体像ガイド", "Day1", "講義", "1h", "必須", "必須", "必須"],
      ["M1 アカウントジャーニーと役割", "Day1", "講義＋ケース", "1.5h", "必須", "必須", "必須"],
      ["M2 エンドユーザー体験", "Day2", "ハンズオン", "1.5h", "必須", "必須", "必須"],
      ["M3 情報源の歩き方", "Day2", "ハンズオン", "0.5h", "必須", "必須", "必須"],
      ["M4 テンプレートと解析", "Day3", "ハンズオン", "2h", "推奨", "必須", "必須"],
      ["M5 ダッシュボードとCAA", "Day3", "ハンズオン", "1.5h", "推奨", "必須", "必須"],
      ["M6 C3BOでラクにする", "Day4", "ハンズオン", "1.5h", "必須", "必須", "必須"],
      ["実技課題 模擬セットアップ", "Day4〜5", "演習", "3h", "推奨", "必須", "必須"],
      ["M7 導入初期PJの進め方", "Day5", "講義＋ケース", "1h", "必須", "必須", "必須"],
      ["M8 運用コンサルの進め方", "Week2〜", "講義＋ケース", "1h", "必須", "必須", "推奨"],
      ["OJT 実案件シャドーイング", "Week2〜", "OJT", "—", "必須", "必須", "必須"],
    ];
    const rows = [H.map(h => ({ text: h, options: { bold: true, color: "FFFFFF", fill: { color: P }, align: "center" } }))];
    R.forEach((r, i) => rows.push(r.map((c, j) => {
      const o = { fill: { color: j === 0 ? G : "FFFFFF" }, color: "000000", align: j === 0 ? "left" : "center", bold: j === 0 };
      if (c === "必須") Object.assign(o, { fill: { color: LP }, color: P, bold: true });
      if (c === "推奨") Object.assign(o, { color: SUB });
      return { text: c, options: o };
    })));
    s.addTable(rows, { x: 0.67, y: 1.42, w: 12.0, colW: [3.5, 1.2, 1.6, 0.9, 1.8, 1.5, 1.5], rowH: 0.43,
      fontSize: 12, fontFace: TF, valign: "middle", border: { type: "solid", pt: 0.5, color: "E5E5E5" }, margin: 0.06 });
    T(s, "Week1の合計は約13.5時間（うち実技課題3時間）。現行のプロダクト系 約10時間を再編し、四半期に分散していた内容をWeek1に集約。時間は目安", { x: 0.67, y: 6.6, w: 12.0, h: 0.3, fontSize: 11, color: "999999" });
  }

  // ===== 15. 情報源ガイド =====
  {
    const s = content("困ったときはここを見る：情報源ガイド", "研修で全部を覚えるのではなく、「どこを見れば分かるか」を覚える", "4. 研修プログラム全体像");
    const c = [
      [I.MdMenuBook, "この機能はある？できる？", "機能マスタ", "機能の有無・仕様・制約を確認する"],
      [I.MdHelpOutline, "顧客によく聞かれる質問は？", "FAQ", "過去の問い合わせと標準回答を確認する"],
      [I.MdTravelExplore, "社内の手順やナレッジを探したい", "BOナビ", "業務手順・資料の置き場所をたどる"],
      [I.MdApartment, "会社の制度やルールを知りたい", "コーポナビ", "全社の制度・ルール・連絡先を確認する"],
      [I.MdSmartToy, "設定や分析を手早く試したい", "C3BO（Claude）", "YAML生成・デモ作成・データ分析を依頼する"],
      [I.MdVideoLibrary, "研修の該当箇所だけ見返したい", "研修録画（章立て付き）", "モジュール・章ごとに区切って必要な部分だけ見る"],
    ];
    const w = 3.87, h = 2.55, gx = 0.2, gy = 0.2;
    c.forEach((it, i) => {
      const x = 0.67 + (i % 3) * (w + gx), y = 1.45 + Math.floor(i / 3) * (h + gy);
      box(s, x, y, w, h, i === 4 ? LP : G);
      s.addImage({ data: it[0], x: x + 0.25, y: y + 0.25, w: 0.48, h: 0.48 });
      T(s, "「" + it[1] + "」", { x: x + 0.85, y: y + 0.2, w: w - 1.0, h: 0.6, fontSize: 13, color: SUB, valign: "middle" });
      s.addShape(pres.shapes.LINE, { x: x + 0.25, y: y + 1.0, w: w - 0.5, h: 0, line: { color: "D9C4F8", width: 1 } });
      T(s, it[2], { x: x + 0.25, y: y + 1.15, w: w - 0.5, h: 0.5, fontSize: 18, bold: true, color: P });
      T(s, it[3], { x: x + 0.25, y: y + 1.7, w: w - 0.5, h: 0.7, fontSize: 12, color: "000000", valign: "top" });
    });
  }

  // ===== 16. 次のステップ =====
  {
    const s = content("次のステップ：個別研修の作り込み", "全体像を確定させてから、既存コンテンツを新しいモジュールに組み替える", "4. 研修プログラム全体像");
    const st = [
      ["全体像の確定", "〜2週間", "確定版の全体像資料・受講パス", ["本資料の役割分担・進め方を各チームでレビュー", "ジャーニー×役割表を実態に合わせて修正", "モジュール構成と受講パスを確定"]],
      ["教材の再編・作成", "〜1か月", "モジュール教材・録画の章立て", ["既存10本を各モジュールに割り当て、重複を削る", "不足分（M3・M6・実技課題）を新規作成", "録画を章立てし、情報源ガイドにリンク"]],
      ["試行と改善", "次の入社者から", "改善版の研修プログラム", ["新メンバーで試行し、理解度と所要時間を計測", "つまずき箇所をヒアリング", "1か月後の振り返りを研修に還元"]],
    ];
    const w = 3.7, g = 0.45;
    st.forEach((p, i) => {
      const x = 0.67 + i * (w + g), y = 1.45;
      box(s, x, y, w, 5.2, LP);
      numCircle(s, x + 0.25, y + 0.3, 0.6, String(i + 1), 18);
      T(s, p[0], { x: x + 1.0, y: y + 0.25, w: w - 1.1, h: 0.4, fontSize: 16, bold: true, color: "000000" });
      T(s, p[1], { x: x + 1.0, y: y + 0.65, w: w - 1.1, h: 0.3, fontSize: 12, bold: true, color: P });
      s.addText(p[3].map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < p[3].length - 1 } })), {
        x: x + 0.25, y: y + 1.3, w: w - 0.5, h: 2.6, fontSize: 13, fontFace: F, color: TXT, valign: "top", paraSpaceAfter: 12, lineSpacingMultiple: 1.3, isTextBox: true });
      box(s, x + 0.25, y + 4.05, w - 0.5, 0.9, "FFFFFF");
      T(s, "成果物", { x: x + 0.4, y: y + 4.1, w: w - 0.8, h: 0.3, fontSize: 11, color: SUB });
      T(s, p[2], { x: x + 0.4, y: y + 4.4, w: w - 0.8, h: 0.45, fontSize: 13, bold: true, color: P });
      if (i < 2) rightArrow(s, x + w + 0.05, y + 2.4, g - 0.1, 0.4);
    });
  }

  // ===== Back cover =====
  {
    const s = pres.addSlide();
    s.background = { color: "FFFFFF" };
    s.addImage({ path: SKILL_PATH + "/assets/backcover-logo.png", x: 3.87, y: 3.02, w: 5.59, h: 1.45 });
  }

  await pres.writeFile({ fileName: OUTFILE });
  console.log("wrote", OUTFILE);
})();
