const adText = document.getElementById('adText');
const checkBtn = document.getElementById('checkBtn');
const sampleBtn = document.getElementById('sampleBtn');
const resultCard = document.getElementById('resultCard');
const resultTitle = document.getElementById('resultTitle');
const resultSummary = document.getElementById('resultSummary');
const meterFill = document.getElementById('meterFill');
const redFlags = document.getElementById('redFlags');
const greenFlags = document.getElementById('greenFlags');
const nextQuestions = document.getElementById('nextQuestions');
const promptOut = document.getElementById('promptOut');
const copyBtn = document.getElementById('copyBtn');
const copyToast = document.getElementById('copyToast');

const RED_RULES = [
  { label: '未経験OKを強く押している', score: 12, patterns: ['未経験', '初心者', '経験不要', 'スキル不要'] },
  { label: '高収入・月収を前面に出している', score: 16, patterns: ['月収', '高収入', '高単価', '50万円', '100万円', '稼げる', '収入保証'] },
  { label: '簡単さを強く押している', score: 12, patterns: ['簡単', '誰でも', 'スマホだけ', 'コピペ', 'スキマ時間', '1日10分'] },
  { label: 'LINE/DM誘導がある', score: 18, patterns: ['LINE', 'ライン', 'DM', '個別相談', '無料相談', '説明会'] },
  { label: '初期費用・サポート費用の気配', score: 22, patterns: ['初期費用', 'サポート費用', '教材費', '講座', 'スクール', 'プラン', 'コンサル'] },
  { label: '仕事内容より夢ワードが多い', score: 12, patterns: ['自由', '好きな場所', '人生逆転', '脱サラ', '権利収入', '自動化'] },
  { label: '急がせる表現がある', score: 8, patterns: ['限定', '今だけ', '先着', '本日中', '残り', '締切'] }
];

const GREEN_RULES = [
  { label: '納品物が書かれている', score: -18, patterns: ['納品物', '成果物', 'HTML', 'CSS', '画像', '動画', '記事', 'LP', 'スプレッドシート', 'GitHub'] },
  { label: '報酬条件が書かれている', score: -14, patterns: ['報酬', '支払い', '単価', '税込', '源泉', '請求書', '契約'] },
  { label: '作業内容が具体的', score: -14, patterns: ['修正', '作成', '編集', 'リライト', 'コーディング', 'デザイン', 'テスト', 'レビュー'] },
  { label: '納期や範囲が書かれている', score: -10, patterns: ['納期', '期日', '範囲', '仕様', '要件', '件数', 'ページ'] }
];

const checkboxScores = {
  initialCost: { label: '初期費用・サポート費用がある', score: 24, type: 'red' },
  lineFlow: { label: 'LINE/DMへ誘導される', score: 18, type: 'red' },
  unclearWork: { label: '仕事内容が曖昧', score: 16, type: 'red' },
  deliverableClear: { label: '納品物が明確', score: -18, type: 'green' },
  contractClear: { label: '契約・報酬条件が明確', score: -16, type: 'green' }
};

function includesPattern(text, patterns) {
  return patterns.some(pattern => text.includes(pattern.toLowerCase()));
}

function unique(items) {
  return [...new Set(items)];
}

function renderList(el, items, fallback) {
  el.innerHTML = '';
  const list = items.length ? items : [fallback];
  list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    el.appendChild(li);
  });
}

function buildQuestions(score, reds, greens) {
  const base = [
    'これは「仕事を受ける話」なのか、「教材・講座を買う話」なのか？',
    '初期費用・月額費用・サポート費用はあるか？',
    '実際に渡す納品物は何か？',
    '報酬は誰から、いつ、いくら支払われるのか？',
    '契約書・利用規約・返金条件は確認できるか？'
  ];

  if (score < 35) {
    return [
      '納品物・報酬・納期は文章内に明確にあるか？',
      '相手の会社名・実績・連絡先は確認できるか？',
      '応募前に、作業範囲を一文で説明できるか？'
    ];
  }

  if (reds.includes('LINE/DM誘導がある')) {
    base.push('LINE登録後に何を売られる可能性があるか？');
  }
  if (reds.includes('高収入・月収を前面に出している')) {
    base.push('収入例の根拠や条件は書かれているか？');
  }
  if (!greens.length) {
    base.push('仕事内容・納品物・報酬条件が書かれていない理由は何か？');
  }
  return unique(base).slice(0, 6);
}

function classify(score) {
  if (score >= 70) {
    return {
      title: '講座・高額サポート入口っぽい。要停止。',
      summary: '仕事募集というより、教材・講座・サポート販売への入口の可能性を強めに見る位置。まず財布を出さず、条件確認へ戻る。'
    };
  }
  if (score >= 45) {
    return {
      title: '要確認ゾーン。看板の裏を見る。',
      summary: 'すぐ応募するより、仕事内容・納品物・費用・契約条件を分けて確認したい位置。赤札はあるが、追加情報で変わる可能性あり。'
    };
  }
  if (score >= 20) {
    return {
      title: '少し赤札あり。情報不足かも。',
      summary: '案件の可能性は残るが、夢ワードや曖昧さが混ざっている。納品物と報酬条件が見えれば判断しやすくなる。'
    };
  }
  return {
    title: '案件寄り。ただし確認は必要。',
    summary: '納品物や条件が比較的見えている位置。とはいえ、契約・支払い・作業範囲の確認は必須。'
  };
}

function analyze() {
  const raw = adText.value.trim();
  const text = raw.toLowerCase();
  let score = raw ? 10 : 0;
  const reds = [];
  const greens = [];

  RED_RULES.forEach(rule => {
    if (includesPattern(text, rule.patterns)) {
      score += rule.score;
      reds.push(rule.label);
    }
  });

  GREEN_RULES.forEach(rule => {
    if (includesPattern(text, rule.patterns)) {
      score += rule.score;
      greens.push(rule.label);
    }
  });

  document.querySelectorAll('.quick-flags input:checked').forEach(input => {
    const flag = checkboxScores[input.value];
    score += flag.score;
    if (flag.type === 'red') reds.push(flag.label);
    if (flag.type === 'green') greens.push(flag.label);
  });

  score = Math.max(0, Math.min(100, score));
  const verdict = classify(score);
  const questions = buildQuestions(score, reds, greens);

  resultTitle.textContent = verdict.title;
  resultSummary.textContent = verdict.summary;
  meterFill.style.width = `${score}%`;
  renderList(redFlags, unique(reds), '強い赤札は未検出');
  renderList(greenFlags, unique(greens), '良い材料はまだ少ない');

  nextQuestions.innerHTML = '';
  questions.forEach(q => {
    const li = document.createElement('li');
    li.textContent = q;
    nextQuestions.appendChild(li);
  });

  promptOut.value = `次の広告文・案件文を、AI副業・フリーランス初心者向けに分解してください。\n\n【文章】\n${raw || 'ここに広告文を貼る'}\n\n【見てほしいこと】\n1. 仕事募集なのか、講座・高額サポート入口なのか\n2. 赤札になる表現\n3. 良い材料\n4. 応募前に確認する質問\n5. 初心者が財布を出す前に止まるべき点`;

  resultCard.classList.remove('is-hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

sampleBtn.addEventListener('click', () => {
  adText.value = '未経験OK！AIで月収50万円も可能。スマホだけで簡単に始められます。詳細はLINE登録後に無料相談で説明します。安心のサポートプランあり。今だけ先着10名。';
});

checkBtn.addEventListener('click', analyze);

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(promptOut.value);
    copyToast.textContent = 'コピーしました。AIにそのまま渡せます。';
  } catch (error) {
    promptOut.select();
    copyToast.textContent = 'コピーできない場合は、本文を選択して手動コピーしてください。';
  }
});
