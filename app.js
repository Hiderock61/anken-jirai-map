const $ = (selector) => document.querySelector(selector);

const SEARCH_GROUPS = [
  { title:'今できる案件', cards:[
    ['静的Web・LP修正','HTML CSS 修正','既存ページの修正、表示崩れ、文言変更などを探します。'],
    ['スマホ対応・レスポンシブ','LP スマホ対応','スマホ表示の調整やレスポンシブ修正案件を探します。'],
    ['CSS表示崩れ','CSS 表示崩れ 解決','小さな表示崩れ修正やレイアウト調整案件を探します。'],
    ['JavaScript動き追加','JavaScript 修正','アコーディオン、メニュー、ボタン操作など小型JS案件を探します。'],
    ['コーディング軽微','コーディング 軽微','短時間で終わる可能性のある軽微な修正案件を探します。']
  ]},
  { title:'一つ学べば届く案件', cards:[
    ['お問い合わせフォーム','お問い合わせフォーム 設置','フォーム設置案件を探します。Formspreeなど外部サービス学習候補につなげます。'],
    ['Formspree','Formspree お問い合わせフォーム','静的サイトでも使えるフォーム送信サービス関連の案件や学習材料を探します。'],
    ['localStorage小型アプリ','JavaScript localStorage 小規模 アプリ','ブラウザ内保存を使う小型アプリ案件や学習材料を探します。'],
    ['API表示','JavaScript API 取得 表示','外部APIからデータを取得して表示する練習・案件候補を探します。'],
    ['JSON表示','JavaScript JSON 表示','JSONデータを読み取り、画面に表示する案件・練習材料を探します。']
  ]},
  { title:'実績作り', cards:[
    ['静的LP制作','静的 LP 制作','1ページの静的LP制作案件を探します。'],
    ['GitHub Pages納品','GitHub Pages 納品','公開URLで納品できる制作案件や参考例を探します。'],
    ['1ページWeb制作','1ページ Web制作 HTML CSS','小規模なWeb制作案件を探します。'],
    ['ポートフォリオ掲載可','ポートフォリオ掲載可 Web制作','実績公開しやすい案件候補を探します。']
  ]},
  { title:'AI文章整理', cards:[
    ['ChatGPT文章校正','ChatGPT 文章校正','AI出力や文章の校正・整形案件を探します。'],
    ['AIリライト','AI リライト','文章の書き換え、読みやすくする仕事を探します。'],
    ['議事録整理','議事録 整理','議事録や文字起こしを整理する案件を探します。'],
    ['マニュアル整理','マニュアル 整理','散らかった手順書や資料を整理する案件を探します。'],
    ['テキスト構造化','テキスト 構造化','文章を見出しや箇条書きで構造化する案件を探します。']
  ]},
  { title:'Canva軽作業', cards:[
    ['Canvaバナー','Canva バナー','Canvaを使ったバナー制作案件を探します。'],
    ['Canvaアイキャッチ','Canva アイキャッチ','ブログ、note、SNS向けのアイキャッチ制作案件を探します。'],
    ['SNS画像作成','SNS 画像作成','SNS投稿用画像の作成案件を探します。'],
    ['YouTubeサムネイル','YouTube サムネイル','YouTube向けサムネイル制作案件を探します。'],
    ['画像サイズ変更','画像サイズ 変更','リサイズ、切り抜きなど軽作業案件を探します。']
  ]},
  { title:'GitHub Issue練習', engine:'github', cards:[
    ['Good First Issue JS','is:issue is:open label:"good first issue" language:javascript','JavaScriptの初心者向けIssueをGitHubで探します。'],
    ['ドキュメント修正','is:issue is:open label:"documentation" language:html','HTMLやドキュメント修正系のIssueをGitHubで探します。'],
    ['HTML/CSSヘルプ','is:issue is:open label:"help wanted" html css','HTML/CSS関連のhelp wanted IssueをGitHubで探します。']
  ]}
];

const SKILLS = [
  {id:'html',name:'HTML',keywords:['html','マークアップ','構造']},{id:'css',name:'CSS',keywords:['css','デザイン','レイアウト','装飾','表示崩れ']},
  {id:'js',name:'JavaScript基礎',keywords:['javascript','js','動作','ボタン','クリック','アコーディオン']},{id:'responsive',name:'レスポンシブ',keywords:['レスポンシブ','スマホ','スマートフォン','モバイル','375px']},
  {id:'spa',name:'静的SPA',keywords:['spa','画面遷移','タブ','切り替え']},{id:'github',name:'GitHub Pages公開',keywords:['github','pages','公開url','url納品','公開']},
  {id:'localStorage',name:'localStorage保存',keywords:['localstorage','保存','端末内','再読込','履歴','台帳']},{id:'api',name:'API取得',keywords:['api','fetch','外部データ','取得']},
  {id:'json',name:'JSON処理',keywords:['json','データ','配列','オブジェクト']},{id:'form',name:'フォーム入力',keywords:['フォーム','入力欄','予約','問い合わせ','formspree','バリデーション','未入力']},
  {id:'wordpress',name:'WordPress',keywords:['wordpress','ワードプレス','wp']},{id:'figma',name:'Figma確認',keywords:['figma','デザインカンプ']},
  {id:'canva',name:'Canva軽作業',keywords:['canva','サムネ','アイキャッチ','画像作成','バナー']},{id:'docs',name:'Googleドキュメント',keywords:['googleドキュメント','docs','ドキュメント']},
  {id:'writing',name:'文章整理',keywords:['文章','ライティング','説明文','コピー','校正','リライト','議事録','マニュアル','テキスト','構造化']},
  {id:'screenshot',name:'スクリーンショット納品',keywords:['スクショ','スクリーンショット','画像確認']},{id:'deliveryLetter',name:'納品文作成',keywords:['納品文','提出文','初回提出','修正提出','途中共有']},
  {id:'client',name:'依頼主対応',keywords:['依頼主','クライアント','確認','修正','ヒアリング']}
];

const DEFAULT_GEAR = {html:'deliverable',css:'deliverable',js:'prototype',responsive:'prototype',spa:'prototype',github:'deliverable',writing:'deliverable',screenshot:'deliverable',deliveryLetter:'deliverable',client:'prototype',docs:'prototype',canva:'prototype'};
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
const SAMPLES = ['HTML/CSS/JavaScriptでスマホ向け予約フォームを作ってください。入力内容を保存し、GitHub Pagesで公開URLを納品。納期は来週金曜、報酬は5,000円です。','WordPressで店舗サイトを作れる方募集。トップページ、問い合わせフォーム、スマホ対応が必要です。デザインはCanvaで共有します。','AI副業コミュニティ参加者募集。Discordで勉強会、GitHubで共同制作。報酬なしですがポートフォリオ公開可能です。','既存LPのスマホ表示崩れを直してください。HTML/CSS修正、スクリーンショット提出、修正2回まで。'];
let sampleIndex = 0;

const sourceText=$('#sourceText'),requiredSkillsBox=$('#requiredSkills'),currentSkillsBox=$('#currentSkills'),resultCard=$('#resultCard'),jobMemoForm=$('#jobMemoForm'),memoStatus=$('#memoStatus');
const entryType=$('#entryType'),entrySummary=$('#entrySummary'),matchedList=$('#matchedList'),missingList=$('#missingList'),missionTitle=$('#missionTitle'),missionWhy=$('#missionWhy'),missionBuild=$('#missionBuild'),missionDone=$('#missionDone'),missionGear=$('#missionGear'),nextAction=$('#nextAction'),caseCard=$('#caseCard'),copyStatus=$('#copyStatus');
const workContent=$('#workContent'),deliverables=$('#deliverables'),clientQuestions=$('#clientQuestions'),checkCriteria=$('#checkCriteria'),cardStatus=$('#cardStatus'),cardValidation=$('#cardValidation');
let latestAnalysis=null;
let currentWizardStep=1;
const WIZARD_LABELS=['','募集文を貼る','必要技術を選ぶ','現在の装備を確認する','作業指示を確認する','正式案件カードを生成する'];

function escapeHtml(value){return String(value).replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function showTab(name,scroll=true){
  document.querySelectorAll('.tab-panel').forEach(panel=>panel.classList.toggle('hidden',panel.id!==`${name}Tab`));
  document.querySelectorAll('.tab-btn').forEach(button=>{const active=button.dataset.tab===name;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});
  if(scroll) window.scrollTo({top:0,behavior:'smooth'});
}
function showWizardStep(step,scroll=true){
  currentWizardStep=step;
  document.querySelectorAll('.wizard-step').forEach(panel=>panel.classList.toggle('hidden',Number(panel.dataset.wizardStep)!==step));
  $('#stepLocation').textContent=`現在地：STEP ${step} / 5 ${WIZARD_LABELS[step]}`;
  document.querySelectorAll('.step-progress span').forEach((dot,index)=>{dot.classList.toggle('active',index<step);dot.classList.toggle('current',index===step-1);});
  if(scroll) $('#stepLocation').scrollIntoView({behavior:'smooth',block:'start'});
}
function renderSearchCards(){
  $('#searchSections').innerHTML=SEARCH_GROUPS.map((group,index)=>`<section class="category-block" aria-labelledby="category-${index}">
    <div class="category-title"><p class="step">検索カテゴリ ${index+1}</p><h2 id="category-${index}">${escapeHtml(group.title)}</h2></div>
    <div class="search-grid">${group.cards.map(([name,query,description])=>`<article class="search-card">
      <h3>${escapeHtml(name)}</h3><p>${escapeHtml(description)}</p><code class="search-query">${escapeHtml(query)}</code>
      <div class="search-actions"><button class="search-btn" type="button" data-engine="${group.engine||'google'}" data-query="${escapeHtml(query)}">${group.engine==='github'?'GitHub':'Google'}で探す</button><button class="copy-query-btn" type="button" data-query="${escapeHtml(query)}">コピー</button></div>
    </article>`).join('')}</div></section>`).join('');
}
function openSearch(engine,query){
  const base=engine==='github'?'https://github.com/search?q=':'https://www.google.com/search?q=';
  const suffix=engine==='github'?'&type=issues':'';
  const url=`${base}${encodeURIComponent(query)}${suffix}`;
  const opened=window.open(url,'_blank','noopener,noreferrer');
  if(opened) opened.opener=null; else window.location.href=url;
}
async function copyQuery(query){
  try{await navigator.clipboard.writeText(query);}
  catch(error){$('#fallbackText').value=query;$('#copyFallback').classList.remove('hidden');$('#fallbackText').focus();$('#fallbackText').select();}
}
function memoData(){return Object.fromEntries(new FormData(jobMemoForm).entries());}
function saveMemo(){
  try{localStorage.setItem('freelance-entry-v04-memo',JSON.stringify(memoData()));memoStatus.textContent='この端末にメモを保存しました。';}
  catch(error){memoStatus.textContent='端末保存は使えません。入力中のメモはそのまま利用できます。';}
}
function loadMemo(){
  try{const data=JSON.parse(localStorage.getItem('freelance-entry-v04-memo')||'null');if(!data)return;Object.entries(data).forEach(([key,value])=>{if(jobMemoForm.elements[key])jobMemoForm.elements[key].value=value;});}
  catch(error){memoStatus.textContent='保存済みメモは読めませんでした。新しく入力できます。';}
}
function buildMemoText(data){
  return [['掲載場所',data.platform],['募集タイトル',data.title],['報酬',data.reward],['納期',data.deadline],['必要そうな技術',data.skills],['本文メモ',data.body],['URL',data.url]].filter(([,value])=>String(value||'').trim()).map(([label,value])=>`【${label}】\n${String(value).trim()}`).join('\n\n');
}
function renderSkillChecks(){requiredSkillsBox.innerHTML=SKILLS.map(skill=>`<label class="skill-chip"><input type="checkbox" name="required" value="${skill.id}"><span>${skill.name}</span></label>`).join('');}
function renderGear(){currentSkillsBox.innerHTML=SKILLS.map(skill=>{const value=DEFAULT_GEAR[skill.id]||'none';return `<div class="gear-row"><div class="gear-name">${skill.name}</div><div class="gear-controls">${[['none','未習得'],['prototype','試作済み'],['deliverable','納品可能'],['real','実案件済み']].map(([id,label])=>`<label><input type="radio" name="gear-${skill.id}" value="${id}" ${value===id?'checked':''}>${label}</label>`).join('')}</div></div>`;}).join('');}
function checkedRequired(){return [...document.querySelectorAll('input[name="required"]:checked')].map(input=>input.value);}
function gearStatus(id){return document.querySelector(`input[name="gear-${id}"]:checked`)?.value||'none';}
function skillName(id){return SKILLS.find(skill=>skill.id===id)?.name||id;}
function statusLabel(status){return {none:'未習得',prototype:'試作済み',deliverable:'納品可能',real:'実案件済み'}[status]||status;}
function setRequired(ids){document.querySelectorAll('input[name="required"]').forEach(input=>input.checked=ids.includes(input.value));}
function suggestSkills(){const text=sourceText.value.toLowerCase();setRequired([...new Set(SKILLS.filter(skill=>skill.keywords.some(keyword=>text.includes(keyword.toLowerCase()))).map(skill=>skill.id))]);}
function classify(text,required,missing){const value=text.toLowerCase();if(['講座','スクール','受講料','教材'].some(word=>value.includes(word)))return['学習入口','仕事ではなく、学ぶ・買う・参加する入口が強い。成果物が残るか確認。'];if(['報酬なし','無償'].some(word=>value.includes(word))&&['github','ポートフォリオ','共同制作'].some(word=>value.includes(word)))return['実績作り入口','即報酬より、公開できる成果物や経験を作る入口。'];if(['報酬','納期','納品','修正'].some(word=>value.includes(word))||required.includes('github'))return['仕事入口','作業・納品・報酬の形が見える。足りない技術を埋めれば案件化しやすい。'];if(['discord','コミュニティ','勉強会','メンバー'].some(word=>value.includes(word)))return['コミュニティ入口','人や現場へ接続する入口。仕事化するには成果物を固定する。'];if(!required.length&&!missing.length)return['情報不足','必要技術がまだ選ばれていない。募集文を読み、作業に必要なものを選ぶ段階。'];return['入口混合','仕事・学習・実績作りが混ざっている可能性がある。得るものと消費するものを分ける。'];}
function pickMission(missing){if(!missing.length)return{key:'deliveryLetter',...MISSIONS.deliveryLetter};const priority=['form','localStorage','responsive','api','json','wordpress','figma','client','deliveryLetter'];const key=priority.find(id=>missing.includes(id))||missing[0];return{key,...(MISSIONS[key]||MISSIONS.default)};}
function renderList(list,items,empty){list.innerHTML=items.length?items.map(item=>`<li>${escapeHtml(item)}</li>`).join(''):`<li class="empty">${escapeHtml(empty)}</li>`;}
function sourceValue(label,text){const match=text.match(new RegExp(`【${label}】\\n([\\s\\S]*?)(?=\\n\\n【|$)`));return match?.[1]?.trim()||'';}
function valueOrFallback(value,fallback='記載なし'){return String(value||'').trim()||fallback;}
function prepareInstructionFields(text,required){
  const body=sourceValue('本文メモ',text);
  workContent.value=body||'募集文を確認し、担当する作業範囲を記入する。';
  deliverables.value='依頼主へ渡す成果物と納品形式を確認して記入する。';
  clientQuestions.value=['担当する作業範囲はどこまでですか。','納品形式と納品方法は何ですか。','素材は支給されますか。','修正回数と修正範囲はどこまでですか。'].join('\n');
  checkCriteria.value=required.length?required.map(id=>`${skillName(id)}に関する募集要件を満たしていること。`).join('\n'):'募集要件と納品形式を満たしていること。';
}
function invalidateCaseCard(){caseCard.value='';cardValidation.classList.add('hidden');copyStatus.textContent='';}
function generateCaseCard(){
  if(!latestAnalysis){cardStatus.textContent='先に技能差分を出してください。';return;}
  const requiredFields=[['作業内容',workContent.value],['納品物',deliverables.value],['相手へ聞く質問',clientQuestions.value],['チェック基準',checkCriteria.value]];
  const missingFields=requiredFields.filter(([,value])=>!String(value).trim()).map(([label])=>label);
  if(missingFields.length){cardStatus.textContent=`未入力：${missingFields.join('、')}`;caseCard.value='';return;}
  const a=latestAnalysis;
  caseCard.value=[
    '【案件カード】','',
    '【案件名】',valueOrFallback(a.title,'募集タイトル未記入'),'',
    '【入口タイプ】',a.type,'',
    '【作業内容】',workContent.value.trim(),'',
    '【納品物】',deliverables.value.trim(),'',
    '【必要技術】',a.required.length?a.required.map(skillName).join('、'):'未選択','',
    '【不足技術】',a.missing.length?a.missing.map(skillName).join('、'):'なし','',
    '【次の学習ミッション】',a.mission.title,'',
    '【相手へ聞く質問】',clientQuestions.value.trim(),'',
    '【チェック基準】',checkCriteria.value.trim(),'',
    '【到達判定】',a.distance,'',
    '【掲載場所】',valueOrFallback(a.platform),'',
    '【募集URL】',valueOrFallback(a.url),'',
    '【報酬】',valueOrFallback(a.reward),'',
    '【納期】',valueOrFallback(a.deadline),'',
    '【今使える装備】',a.matched.length?a.matched.join('、'):'なし','',
    '【学習ミッションの完成条件】',a.mission.done.map(item=>`・${item}`).join('\n'),'',
    '【次の行動】',nextAction.textContent
  ].join('\n');
  cardStatus.textContent='正式案件カードを生成しました。内容を確認してコピーできます。';
  cardValidation.classList.remove('hidden');
  copyStatus.textContent='';
  caseCard.scrollIntoView({behavior:'smooth',block:'center'});
}
function analyze(){
  const text=sourceText.value.trim(),required=checkedRequired(),matched=[],missing=[];
  required.forEach(id=>{const status=gearStatus(id);if(status==='none')missing.push(id);else matched.push(`${skillName(id)}｜${statusLabel(status)}`);});
  const [type,summary]=classify(text,required,missing),mission=pickMission(missing);
  let distance='今できる';if(missing.length===1)distance='一つ学べばできる';if(missing.length>=2&&matched.length)distance='一部だけできる';if(missing.length>=4)distance='現在は距離がある';
  entryType.textContent=`${type}｜${distance}`;entrySummary.textContent=summary;
  renderList(matchedList,matched,'必要技術が未選択、または一致する装備なし');renderList(missingList,missing.map(skillName),'足りない技術なし。装備庫で作業開始へ');
  missionTitle.textContent=mission.title;missionWhy.textContent=mission.why;missionBuild.textContent=mission.build;renderList(missionDone,mission.done,'完成条件なし');missionGear.textContent=mission.gear;
  nextAction.textContent=!missing.length?'装備庫で案件カードを貼り、今日やる作業と納品情報を整理する。':missing.length===1?`先に「${skillName(missing[0])}」の小型ミッションを一つ作る。完成したら装備庫へ試作済みとして登録し、案件へ戻る。`:'全部を受ける前に、できる範囲だけを切り出す。足りない技術は一つだけ選んで学習ミッションへ回す。';
  const memo=memoData();
  latestAnalysis={text,required,matched,missing,type,distance,mission,title:sourceValue('募集タイトル',text)||memo.title,platform:sourceValue('掲載場所',text)||memo.platform,reward:sourceValue('報酬',text)||memo.reward,deadline:sourceValue('納期',text)||memo.deadline,url:sourceValue('URL',text)||memo.url};
  prepareInstructionFields(text,required);invalidateCaseCard();cardStatus.textContent='4項目を確認・修正して、正式案件カードを生成してください。';
  resultCard.classList.remove('hidden');showWizardStep(4);
}

document.querySelectorAll('.tab-btn').forEach(button=>button.addEventListener('click',()=>showTab(button.dataset.tab)));
$('#searchSections').addEventListener('click',(event)=>{const search=event.target.closest('.search-btn'),copy=event.target.closest('.copy-query-btn');if(search)openSearch(search.dataset.engine,search.dataset.query);if(copy)copyQuery(copy.dataset.query);});
$('#closeFallbackBtn').addEventListener('click',()=>$('#copyFallback').classList.add('hidden'));
jobMemoForm.addEventListener('input',saveMemo);
jobMemoForm.addEventListener('submit',(event)=>{event.preventDefault();const text=buildMemoText(memoData());if(!text){memoStatus.textContent='分解する募集を一つ以上入力してください。';return;}sourceText.value=text;suggestSkills();resultCard.classList.add('hidden');showTab('analyze');showWizardStep(1,false);sourceText.scrollIntoView({behavior:'smooth',block:'center'});});
$('#sampleBtn').addEventListener('click',()=>{sourceText.value=SAMPLES[sampleIndex%SAMPLES.length];sampleIndex++;suggestSkills();});
$('#suggestBtn').addEventListener('click',suggestSkills);$('#resetGearBtn').addEventListener('click',renderGear);$('#analyzeBtn').addEventListener('click',analyze);
$('#generateCardBtn').addEventListener('click',generateCaseCard);
document.querySelectorAll('[data-next-step]').forEach(button=>button.addEventListener('click',()=>{
  const next=Number(button.dataset.nextStep);
  if(currentWizardStep===1&&!sourceText.value.trim()){sourceText.focus();return;}
  if(next===5){const fields=[workContent,deliverables,clientQuestions,checkCriteria];if(fields.some(field=>!field.value.trim())){cardStatus.textContent='4項目をすべて確認・入力してください。';fields.find(field=>!field.value.trim())?.focus();return;}}
  showWizardStep(next);
}));
document.querySelectorAll('[data-back-step]').forEach(button=>button.addEventListener('click',()=>showWizardStep(Number(button.dataset.backStep))));
[workContent,deliverables,clientQuestions,checkCriteria].forEach(field=>field.addEventListener('input',invalidateCaseCard));
$('#resetBtn').addEventListener('click',()=>{resultCard.classList.add('hidden');sourceText.value='';setRequired([]);caseCard.value='';latestAnalysis=null;cardStatus.textContent='';copyStatus.textContent='';cardValidation.classList.add('hidden');showWizardStep(1,false);showTab('search');});
$('#copyCardBtn').addEventListener('click',async()=>{
  if(!caseCard.value.trim()){copyStatus.textContent='先に正式案件カードを作ってください。';return;}
  const equipmentWindow=window.open('about:blank','_blank');
  let copied=false;
  try{await navigator.clipboard.writeText(caseCard.value);copied=true;}
  catch(error){caseCard.focus();caseCard.select();try{copied=document.execCommand('copy');}catch(copyError){copied=false;}}
  if(!copied){if(equipmentWindow)equipmentWindow.close();copyStatus.textContent='案件カード欄を長押しして手動コピーしてください。';return;}
  copyStatus.textContent='コピーしました。装備庫を開きます。';
  if(equipmentWindow){equipmentWindow.opener=null;equipmentWindow.location.href=$('#equipmentLink').href;}else{window.location.href=$('#equipmentLink').href;}
});

renderSearchCards();renderSkillChecks();renderGear();loadMemo();showWizardStep(1,false);showTab('search',false);
