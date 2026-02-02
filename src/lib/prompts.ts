import { TemplateItem, AnalysisResult } from "./types";

export function buildTranscriptPrompt(
  title: string,
  industry: string,
  product: string,
  salesMembers: string,
  customerMembers: string
): string {
  return `あなたは商談ロールプレイの台本作成者です。以下の設定で、リアルな商談の書き起こしテキストを約3000文字で生成してください。

## 設定
- 会議タイトル: ${title}
- 業界: ${industry}
- 商材: ${product}
- 営業側参加者: ${salesMembers}
- 顧客側参加者: ${customerMembers}

## 必須要素（すべて含めてください）
- 顧客の懸念・不安の表明（コスト、導入リスク、既存システムとの互換性など）
- 競合製品・競合企業への具体的な言及
- 予算・スケジュールに関する具体的な議論
- 次のアクション（次回打合せ、資料送付など）の合意
- 顧客の温度感が読み取れる発言（前向き/慎重の両方）
- ポジティブな反応とネガティブな反応の両方

## フォーマット
話者名: 発言内容
の形式で出力してください。タイムスタンプは不要です。自然な会話の流れで、あいづちや質問を含めてください。`;
}

export function buildSimpleSummaryPrompt(transcript: string): string {
  return `以下の商談の書き起こし内容を要約してください。

${transcript}`;
}

export function buildStructuredAnalysisPrompt(
  transcript: string,
  template: TemplateItem[]
): string {
  const fields = template.map((item) => {
    let typeDesc = "";
    switch (item.method) {
      case "summary":
        typeDesc = "string（自由文で要約）";
        break;
      case "enum":
        typeDesc = `string（次の選択肢から1つ: ${item.options}）`;
        break;
      case "list":
        typeDesc = "string[]（該当項目を配列で列挙）";
        break;
    }
    return `  "${item.id}": ${typeDesc} // ${item.name}: ${item.instruction}`;
  });

  return `以下の商談書き起こしを分析し、指定されたJSON形式で結果を返してください。

## 書き起こし
${transcript}

## 出力JSON形式
{
${fields.join(",\n")}
}

JSONのみを出力してください。`;
}

export function buildDummyDataPrompt(
  template: TemplateItem[],
  realAnalysis: AnalysisResult,
  count: number
): string {
  const schema = template.map((item) => {
    let typeDesc = "";
    switch (item.method) {
      case "summary":
        typeDesc = "string";
        break;
      case "enum":
        typeDesc = `string (選択肢: ${item.options})`;
        break;
      case "list":
        typeDesc = "string[]";
        break;
    }
    return `    "${item.id}": ${typeDesc} // ${item.name}`;
  });

  return `あなたは商談データ生成のエキスパートです。以下のスキーマに従い、さまざまな業界・商材の商談解析結果ダミーデータを${count}件生成してください。

## スキーマ
各レコードは以下の形式:
{
  "id": string,
  "title": string (商談タイトル),
  "industry": string (業界),
  "analysis": {
${schema.join(",\n")}
  }
}

## 実データ参考（1件目）
${JSON.stringify(realAnalysis, null, 2)}

## 要件
- 業界・商材にバリエーションを持たせる（IT、製造、金融、医療、小売など）
- enum値の分布を偏らせすぎない
- リアルな商談を想定したデータにする
- ${count}件分を"records"キーの配列として返す

JSONのみを出力してください。`;
}
