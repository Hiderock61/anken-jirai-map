const $ = (s) => document.querySelector(s);
const sourceText = $('#sourceText');
const sampleBtn = $('#sampleBtn');
const suggestBtn = $('#suggestBtn');
const requiredSkillsBox = $('#requiredSkills');
const currentSkillsBox = $('#currentSkills');
const resetGearBtn = $('#resetGearBtn');
const analyzeBtn = $('#analyzeBtn');
const resultCard = $('#resultCard');
const entryType = $('#entryType');
const entrySummary = $('#entrySummary');
const matchedList = $('#matchedList');
const missingList = $('#missingList');
const missionTitle = $('#missionTitle');
const missionWhy = $('#missionWhy');
const missionBuild = $('#missionBuild');
const missionDone = $('#missionDone');
const missionGear = $('#missionGear');
const nextAction = $('#nextAction');
const caseCard = $('#caseCard');
const copyCardBtn = $('#copyCardBtn');
const copyStatus = $('#copyStatus');
const resetBtn = $('#resetBtn');

const SKILLS = [
  {id:'html', name:'HTML', keywords:['html','マークアップ','構造']},
  {id:'css', name:'CSS', keywords:['css','デザイン','レイアウト','装飾']},
  {id:'js', name:'JavaScript基礎', keywords:['javascript','js','動作','ボタン','クリック']},
  {id:'responsive', name:'レスポンシブ', keywords:['レスポンシブ','スマホ','スマートフォン','モバイル','375px']},
  {id:'spa', name:'静的SPA', keywords:['spa','画面遷移','タブ','切り替え']},
  {id:'github', name:'GitHub Pages公開', keywords:['github','pages','公開url','url納品','公開']},
  {id:'localStorage', name:'localStorage保存', keywords:['localstorage','保存','端末内','再読込','履歴','台帳']},
  {id:'api', name:'API取得', keywords:['api','fetch','外部データ','取得']},
  {id:'json', name:'JSON処理', keywords:['json','データ','配列','オブジェクト']},
  {id:'form', name:'フォーム入力', keywords:['フォーム','入力欄','予約','問い合わせ','バリデーション','未入力']},
  {id:'wordpress', name:'WordPress', keywords:['wordpress','ワードプレス','wp']},
  {id:'figma', name:'Figma確認', keywords:['figma','デザインカンプ']},
  {id:'canva', name:'Canva軽作業', keywords:['canva','サムネ','画像作成']},
  {id:'docs', name:'Googleドキュメント', keywords:['googleドキュメント','docs','ドキュメント']},
  {id:'writing', name:'文章整理', keywords:['文章','ライティング','説明文','コピー']},
  {id:'screenshot', name:'スクリーンショット納品', keywords:['スクショ','スクリーンショット','画像確認']},
  {id:'deliveryLetter', name:'納品文作成', keywords:['納品文','提出文','初回提出','修正提出','途中共有']},
  {id:'client', name:'依頼主対応', keywords:['依頼主','クライアント','確認','修正','ヒアリング']}
];

const DEFAULT_GEAR = {
  html:'deliverable', css:'deliverable', js:'prototype', responsive:'prototype', spa:'prototype', github:'deliverable',
  writing:'deliverable', screenshot:'deliverable', deliveryLetter:'deliverable', client:'prototype', docs:'prototype', canva:'prototype'
};

const MISSIONS = {
  localStorage:{title:'localStorageで案件メモを保存する',why:'案件カードや入力内容を、再読込後も端末内に残すため。',build:'案件名・納期・状態を保存できる小型メモアプリ',done:['入力できる','保存できる','再読込しても残る','削除できる'],gear:'localStorage保存｜試作済み'},
  api:{title:'fetchで外部APIから1件表示する',why:'外部データを使う案件に入る入口を作るため。',build:'APIからタイトルを1件取得して表示する小型表示アプリ',done:['ボタンで取得できる','取得中表示がある','エラー時に止まらない','結果を画面へ表示できる'],gear:'API取得｜試作済み'},
  json:{title:'JSONから必要な項目だけ取り出す',why:'APIや保存データを画面表示へ変換するため。',build:'JSON一覧からタイトルとURLだけをカード表示する練習',done:['配列を読める','必要項目を取り出せる','複数件を表示できる','空データ時の表示がある'],gear:'JSON処理｜試作済み'},
  form:{title:'フォーム入力と未入力チェックを作る',why:'問い合わせ・予約・応募フォーム系の案件で必要になるため。',build:'名前・メール・内容を入力し、未入力なら警告するフォーム',done:['入力欄がある','未入力を検出できる','送信前に確認できる','完了メッセージが出る'],gear:'フォーム入力｜試作済み'},
  responsive:{title:'375px幅で横はみ出しを直す',why:'スマホ納品で画面が崩れないようにするため。',build:'スマホ幅でカード・ボタン・文章が収まる確認ページ',done:['横スクロールしない','ボタンが押せる','文字が読める','下部余白がある'],gear:'レスポンシブ｜納品可能'},
  wordpress:{title:'WordPress案件を静的試作へ分解する',why:'WordPress本実装が未習得でも、画面案・HTML試作なら担当範囲にできるため。',build:'WordPress化前の静的HTMLトップページ試作',done:['静的ページで見せられる','担当範囲を説明できる','本実装の未対応を明記できる','URLで共有できる'],gear:'WordPress前段の静的試作｜試作済み'},
  figma:{title:'Figmaデザインを実装項目へ分ける',why:'デザインカンプからHTML/CSSへ落とし込む案件で迷子にならないため。',build:'Figma画面を「文字・画像・ボタン・余白」に分解した実装メモ',done:['画面要素を列挙できる','必要画像を確認できる','CSSで再現する範囲を決める','不明点を質問にできる'],gear:'Figma確認｜試作済み'},
  client:{title:'依頼主への確認質問を5つに絞る',why:'作る前に、納品物・期限・修正範囲を固定するため。',build:'案件ごとの確認質問テンプレ',done:['納品物を聞ける','期限を聞ける','報酬を聞ける','修正回数を聞ける','素材提供を聞ける'],gear:'依頼主対応｜試作済み'},
  deliveryLetter:{title:'初回提出文をテンプレで作る',why:'完成物を仕事として閉じるため。',build:'URL・作った内容・確認場所を入れた提出文テンプレ',done:['URLを入れられる','作った内容を書ける','確認場所を書ける','コピーできる'],gear:'納品文作成｜納品可能'},
  default:{title:'一番小さい試作品を作る',why:'不足技術を頭の理解で終わらせず、手元の物体にするため。',build:'不足技術を一つだけ使った小型ページ',done:['1画面で動く','URLまたはスクショで見せられる','何を学んだか説明できる'],gear:'新しい技能｜試作済み'}
};

const SAMPLES = [
  'HTML/CSS/JavaScriptでスマホ向け予約フォームを作ってください。入力内容を保存し、GitHub Pagesで公開URLを納品。納期は来週金曜、報酬は5,000円です。',
  'WordPressで店舗サイトを作れる方募集。トップページ、問い合わせフォーム、スマホ対応が必要です。デザインはCanvaで共有します。',
  'AI副業コミュニティ参加者募集。Discordで勉強会、GitHubで共同制作。報酬なしですがポートフォリオ公開可能です。',
  '既存LPのスマホ表示崩れを直してください。HTML/CSS修正、スクリーンショット提出、修正2回まで。'
];
let sampleIndex = 0;

function renderSkillChecks(){
  requiredSkillsBox.innerHTML = SKILLS.map(s => `<label class="skill-chip"><input type="checkbox" name="required" value="${s.id}"><span>${s.name}</span></label>`).join('');
}
function renderGear(){
  currentSkillsBox.innerHTML = SKILLS.map(s => {
    const val = DEFAULT_GEAR[s.id] || 'none';
    return `<div class="gear-row" data-skill="${s.id}"><div class="gear-name">${s.name}</div><div class="gear-controls">
      <label><input type="radio" name="gear-${s.id}" value="none" ${val==='none'?'checked':''}>未習得</label>
      <label><input type="radio" name="gear-${s.id}" value="prototype" ${val==='prototype'?'checked':''}>試作済み</label>
      <label><input type="radio" name="gear-${s.id}" value="deliverable" ${val==='deliverable'?'checked':''}>納品可能</label>
      <label><input type="radio" name="gear-${s.id}" value="real" ${val==='real'?'checked':''}>実案件済み</label>
    </div></div>`;
  }).join('');
}
function checkedRequired(){return [...document.querySelectorAll('input[name="required"]:checked')].map(i=>i.value)}
function gearStatus(id){return document.querySelector(`input[name="gear-${id}"]:checked`)?.value || 'none'}
function skillName(id){return SKILLS.find(s=>s.id===id)?.name || id}
function statusLabel(s){return {none:'未習得',prototype:'試作済み',deliverable:'納品可能',real:'実案件済み'}[s] || s}
function setRequired(ids){
  document.querySelectorAll('input[name="required"]').forEach(i => i.checked = ids.includes(i.value));
}
function suggestSkills(){
  const text = sourceText.value.toLowerCase();
  const ids = SKILLS.filter(s => s.keywords.some(k => text.includes(k.toLowerCase()))).map(s => s.id);
  setRequired([...new Set(ids)]);
}
function classify(text, required, missing){
  const t = text.toLowerCase();
  if(['講座','スクール','受講料','教材'].some(w=>t.includes(w))) return ['学習入口','仕事ではなく、学ぶ・買う・参加する入口が強い。成果物が残るか確認。'];
  if(['報酬なし','無償'].some(w=>t.includes(w)) && ['github','ポートフォリオ','共同制作'].some(w=>t.includes(w))) return ['実績作り入口','即報酬より、公開できる成果物や経験を作る入口。'];
  if(['報酬','納期','納品','修正'].some(w=>t.includes(w)) || required.includes('github')) return ['仕事入口','作業・納品・報酬の形が見える。足りない技術を埋めれば案件化しやすい。'];
  if(['discord','コミュニティ','勉強会','メンバー'].some(w=>t.includes(w))) return ['コミュニティ入口','人や現場へ接続する入口。仕事化するには成果物を固定する。'];
  if(required.length===0 && missing.length===0) return ['情報不足','必要技術がまだ選ばれていない。募集文を読み、作業に必要なものを選ぶ段階。'];
  return ['入口混合','仕事・学習・実績作りが混ざっている可能性がある。得るものと消費するものを分ける。'];
}
function pickMission(missing){
  if(missing.length===0) return {key:'deliveryLetter',...MISSIONS.deliveryLetter};
  const priority = ['form','localStorage','responsive','api','json','wordpress','figma','client','deliveryLetter'];
  const key = priority.find(p => missing.includes(p)) || missing[0];
  return {key, ...(MISSIONS[key] || MISSIONS.default)};
}
function li(list, items, empty){
  list.innerHTML = items.length ? items.map(x=>`<li>${x}</li>`).join('') : `<li class="empty">${empty}</li>`;
}
function analyze(){
  const text = sourceText.value.trim();
  const required = checkedRequired();
  const matched = [];
  const missing = [];
  required.forEach(id => {
    const st = gearStatus(id);
    if(st === 'none') missing.push(id); else matched.push(`${skillName(id)}｜${statusLabel(st)}`);
  });
  const [type, summary] = classify(text, required, missing);
  const mission = pickMission(missing);
  let distance = '今できる';
  if(missing.length === 1) distance = '一つ学べばできる';
  if(missing.length >= 2 && matched.length > 0) distance = '一部だけできる';
  if(missing.length >= 4) distance = '現在は距離がある';

  entryType.textContent = `${type}｜${distance}`;
  entrySummary.textContent = summary;
  li(matchedList, matched, '必要技術が未選択、または一致する装備なし');
  li(missingList, missing.map(skillName), '足りない技術なし。装備庫で作業開始へ');
  missionTitle.textContent = mission.title;
  missionWhy.textContent = mission.why;
  missionBuild.textContent = mission.build;
  li(missionDone, mission.done, '完成条件なし');
  missionGear.textContent = mission.gear;

  if(missing.length === 0){
    nextAction.textContent = '装備庫で案件カードを貼り、今日やる作業と納品情報を整理する。';
  } else if(missing.length === 1){
    nextAction.textContent = `先に「${skillName(missing[0])}」の小型ミッションを一つ作る。完成したら装備庫へ試作済みとして登録し、案件へ戻る。`;
  } else {
    nextAction.textContent = '全部を受ける前に、できる範囲だけを切り出す。足りない技術は一つだけ選んで学習ミッションへ回す。';
  }

  const card = [
    '【入口アプリ｜案件カード】',
    `入口タイプ：${type}`,
    `到達判定：${distance}`,
    '',
    '【募集文メモ】',
    text || '記載なし',
    '',
    '【必要技術】',
    required.length ? required.map(skillName).join('、') : '未選択',
    '',
    '【今使える装備】',
    matched.length ? matched.join('、') : 'なし',
    '',
    '【足りない技術】',
    missing.length ? missing.map(skillName).join('、') : 'なし',
    '',
    '【次の学習ミッション】',
    mission.title,
    `作るもの：${mission.build}`,
    `装備登録：${mission.gear}`,
    '',
    '【次の行動】',
    nextAction.textContent
  ].join('\n');
  caseCard.value = card;
  resultCard.classList.remove('hidden');
  resultCard.scrollIntoView({behavior:'smooth', block:'start'});
}

sampleBtn.addEventListener('click',()=>{sourceText.value = SAMPLES[sampleIndex % SAMPLES.length]; sampleIndex++; suggestSkills();});
suggestBtn.addEventListener('click',suggestSkills);
resetGearBtn.addEventListener('click',renderGear);
analyzeBtn.addEventListener('click',analyze);
resetBtn.addEventListener('click',()=>{resultCard.classList.add('hidden'); sourceText.value=''; setRequired([]); copyStatus.textContent=''; window.scrollTo({top:0,behavior:'smooth'});});
copyCardBtn.addEventListener('click', async()=>{
  try{ await navigator.clipboard.writeText(caseCard.value); copyStatus.textContent='案件カードをコピーしました。装備庫へ貼れます。'; }
  catch(e){ caseCard.select(); document.execCommand('copy'); copyStatus.textContent='案件カードをコピーしました。'; }
});
renderSkillChecks();
renderGear();
