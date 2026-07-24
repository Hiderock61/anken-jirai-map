const sourceText = document.querySelector('#sourceText');
const analyzeBtn = document.querySelector('#analyzeBtn');
const sampleBtn = document.querySelector('#sampleBtn');
const resultCard = document.querySelector('#resultCard');
const primaryType = document.querySelector('#primaryType');
const primarySummary = document.querySelector('#primarySummary');
const scoreList = document.querySelector('#scoreList');
const gainList = document.querySelector('#gainList');
const costList = document.querySelector('#costList');
const evidenceTags = document.querySelector('#evidenceTags');
const nextTitle = document.querySelector('#nextTitle');
const nextText = document.querySelector('#nextText');
const questionList = document.querySelector('#questionList');
const handoffText = document.querySelector('#handoffText');
const resetBtn = document.querySelector('#resetBtn');

const TYPES = {
  work: {
    label: '仕事入口',
    summary: '発注者・作業・納品物・報酬がある、仕事として進める入口です。',
    gains: ['報酬', '納品実績', '発注者との取引経験'],
    costs: ['作業時間', '修正対応', '納期管理'],
    nextTitle: '装備庫で「今日 → 納品」を組む',
    nextText: '仕事内容を、今日やる作業と渡す物に分けます。',
    questions: ['最終的な納品物は何か', '報酬額と支払日はいつか', '修正回数と完了条件は何か'],
    handoff: '装備庫では、作業内容・期限・納品物を入れて、提出文まで作ります。'
  },
  learning: {
    label: '学習入口',
    summary: '報酬を受ける仕事ではなく、教材・指導・練習機会を買う入口です。',
    gains: ['知識', '練習機会', '添削・指導'],
    costs: ['受講料', '学習時間', '成果が保証されない可能性'],
    nextTitle: '払う前に「成果物」を固定する',
    nextText: '学習後に何が手元へ残るかを確認します。',
    questions: ['受講後に完成する成果物は何か', '総額はいくらか', '案件紹介は保証か、単なる案内か'],
    handoff: '参加するなら、装備庫で学習内容を「公開できる制作物」に変換します。'
  },
  portfolio: {
    label: '実績作り入口',
    summary: '即時報酬より、URL・GitHub・テンプレなど公開できる成果を作る入口です。',
    gains: ['公開URL', 'ポートフォリオ', '制作工程の説明材料'],
    costs: ['無報酬の作業時間', '公開範囲の確認', '完成までの自己管理'],
    nextTitle: '装備庫で「URL・スクショ・説明」を作る',
    nextText: '作った事実を、他人へ渡せる三点セットにします。',
    questions: ['成果物を自分の実績として公開できるか', '自分の担当範囲を明記できるか', '完成条件と公開場所は何か'],
    handoff: '装備庫の納品モードで、URL・スクショ・説明文の三点を完成させます。'
  },
  community: {
    label: 'コミュニティ入口',
    summary: '人・制作現場・情報へ接続する入口です。仕事そのものとは限りません。',
    gains: ['現場観察', '共同作業の経験', '相談・接点'],
    costs: ['参加時間', '通知や会話への対応', '目的不明の滞在'],
    nextTitle: '最初は「見学する場所」を一つ決める',
    nextText: '全部参加せず、README・Issue・テンプレなど観察対象を固定します。',
    questions: ['参加者は何を作っているか', '初心者が最初に見る場所はどこか', '制作物や担当が残る仕組みがあるか'],
    handoff: '装備庫の見学・共有工程で、観察した内容を一つの作業へ変換します。'
  },
  sales: {
    label: '営業入口',
    summary: '応募・面談・提案を通して、仕事を取るための入口です。',
    gains: ['案件候補', '提案経験', '相手の要求情報'],
    costs: ['応募作業', '不採用', '無償テストの可能性'],
    nextTitle: '相手へ渡す材料を先に揃える',
    nextText: 'プロフィールより、見せられる成果物と対応範囲を準備します。',
    questions: ['選考後に実案件があるか', 'テスト作業に報酬があるか', '何を見て採否を決めるか'],
    handoff: '装備庫で提出URL・短い説明・対応可能範囲を一枚にします。'
  },
  exploitation: {
    label: '搾取入口',
    summary: '得るものに対して、無償作業・費用・権利放棄・無制限対応が大きい入口です。',
    gains: ['得られる物が不明確', '「経験」だけとされる可能性'],
    costs: ['長時間の無償作業', '制作物の権利', '費用・個人情報・気力'],
    nextTitle: '進む前に条件を文章で確定する',
    nextText: '条件が明確にならない限り、制作開始や支払いを止めます。',
    questions: ['報酬・費用・権利を文章で提示できるか', '作業量と修正回数に上限があるか', '辞退した場合の費用や制約があるか'],
    handoff: '装備庫へ進む前段階です。条件が確定してから作業項目を登録します。'
  },
  unknown: {
    label: '情報不足',
    summary: '仕事・学習・実績作りのどれかを判定する材料が足りません。',
    gains: ['まだ特定できない'],
    costs: ['確認せず進む時間と判断コスト'],
    nextTitle: '入口の正体を決める質問をする',
    nextText: '報酬・費用・作る物・公開権の四点を確認します。',
    questions: ['自分は払う側か、受け取る側か', '具体的に何を作るのか', '成果物を自分の実績として公開できるか'],
    handoff: '入口が確定したら装備庫へ渡します。今は確認工程です。'
  }
};

const RULES = [
  { type: 'work', points: 3, terms: ['報酬', '業務委託', '発注', '納品', '納期', '契約', '時給', '単価', '支払い', '案件'] },
  { type: 'learning', points: 3, terms: ['講座', 'スクール', '受講', '教材', 'カリキュラム', 'メンター', '添削', '学習', 'レッスン', 'サポート費'] },
  { type: 'portfolio', points: 3, terms: ['ポートフォリオ', '実績として', 'GitHubで公開', '公開可能', '制作物', 'テンプレート投稿', 'URLで公開', '共同制作'] },
  { type: 'community', points: 2, terms: ['Discord', 'コミュニティ', '勉強会', '交流会', 'Miroverse', 'オープンソース', 'Issue', 'メンバー募集', '参加者'] },
  { type: 'sales', points: 2, terms: ['応募', '面談', '選考', '提案', '営業', 'ポートフォリオ提出', 'テスト案件', '募集', '採用'] },
  { type: 'exploitation', points: 4, terms: ['無償', '報酬なし', '修正無制限', '権利譲渡', '初期費用', '参加費', '高額', '自己負担', '違約金', '永久サポート'] }
];

const CHECK_RULES = {
  paidByUser: { type: 'learning', points: 4, evidence: '自分が費用を払う' },
  paidToUser: { type: 'work', points: 4, evidence: '自分が報酬を受け取る' },
  portfolio: { type: 'portfolio', points: 4, evidence: '実績公開できる' },
  community: { type: 'community', points: 3, evidence: '共同の場がある' },
  deliverable: { type: 'work', points: 3, evidence: '納品物が決まっている' },
  deadline: { type: 'work', points: 2, evidence: '期間・納期がある' },
  rightsUnclear: { type: 'exploitation', points: 3, evidence: '制作物の権利が不明' },
  unlimitedRevision: { type: 'exploitation', points: 4, evidence: '作業量の上限がない' }
};

const samples = [
  'AIを使ったWeb制作メンバー募集。Discordで週1回勉強会を行い、共同制作物はGitHubで公開します。報酬はありませんが、ポートフォリオ掲載可能です。',
  '企業サイトの修正案件です。HTML/CSSで3ページを修正し、納期は来週金曜。報酬3万円、修正は2回まで。GitHubで納品します。',
  '未経験向けAIフリーランス講座。教材、週1回の添削、案件紹介サポート付き。受講料は198,000円です。',
  '新規サービスのデザイン案を無償募集。採用後の報酬は未定。修正回数に制限はなく、提出物の権利は運営へ譲渡されます。'
];
let sampleIndex = 0;

sampleBtn.addEventListener('click', () => {
  sourceText.value = samples[sampleIndex % samples.length];
  sampleIndex += 1;
});

analyzeBtn.addEventListener('click', analyze);
resetBtn.addEventListener('click', () => {
  resultCard.classList.add('hidden');
  sourceText.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function analyze() {
  const text = sourceText.value.trim();
  const scores = { work: 0, learning: 0, portfolio: 0, community: 0, sales: 0, exploitation: 0 };
  const evidence = [];

  RULES.forEach(rule => {
    rule.terms.forEach(term => {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        scores[rule.type] += rule.points;
        evidence.push(term);
      }
    });
  });

  document.querySelectorAll('.checks input:checked').forEach(input => {
    const rule = CHECK_RULES[input.value];
    if (!rule) return;
    scores[rule.type] += rule.points;
    evidence.push(rule.evidence);
  });

  // 混合入口の補正
  if (scores.work > 0 && scores.portfolio > 0) scores.portfolio += 1;
  if (scores.community > 0 && scores.portfolio > 0) scores.portfolio += 1;
  if (scores.learning > 0 && scores.sales > 0 && !text.includes('報酬')) scores.learning += 1;
  if (scores.exploitation > 0 && (text.includes('報酬なし') || text.includes('無償'))) scores.exploitation += 2;

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primaryKey = ranked[0][1] === 0 ? 'unknown' : ranked[0][0];
  render(primaryKey, scores, [...new Set(evidence)]);
}

function render(primaryKey, scores, evidence) {
  const config = TYPES[primaryKey];
  primaryType.textContent = config.label;
  primarySummary.textContent = config.summary;
  renderScores(scores);
  renderList(gainList, config.gains);
  renderList(costList, config.costs);
  evidenceTags.innerHTML = evidence.length
    ? evidence.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('')
    : '<span class="tag">判定材料なし</span>';
  nextTitle.textContent = config.nextTitle;
  nextText.textContent = config.nextText;
  renderList(questionList, config.questions);
  handoffText.textContent = config.handoff;
  resultCard.classList.remove('hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderScores(scores) {
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, score]) => score), 1);
  scoreList.innerHTML = entries.map(([key, score]) => {
    const percent = Math.round((score / max) * 100);
    return `<div class="score-row">
      <span>${TYPES[key].label}</span>
      <div class="score-track"><div class="score-fill" style="width:${percent}%"></div></div>
      <span>${score}</span>
    </div>`;
  }).join('');
}

function renderList(element, items) {
  element.innerHTML = items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  })[char]);
}
