(() => {
  const ACTIONS = {
    1: '今やること：募集文を確認して次へ進む',
    2: '今やること：必要な技術を選んで次へ進む',
    3: '今やること：現在の装備状態を確認する',
    4: '今やること：作業指示4項目を確認・修正する',
    5: '今やること：案件カードを生成してコピーする'
  };

  const analyzeTab = document.querySelector('#analyzeTab');
  const stepLocation = document.querySelector('.step-location');
  const requiredSkills = document.querySelector('#requiredSkills');
  const suggestButton = document.querySelector('#suggestBtn');
  const source = document.querySelector('#sourceText');

  if (!analyzeTab || !stepLocation || !requiredSkills) return;

  const actionGuide = document.createElement('p');
  actionGuide.id = 'stepActionGuide';
  actionGuide.className = 'step-action-guide';
  stepLocation.insertBefore(actionGuide, stepLocation.querySelector('.step-progress'));

  const selectedPanel = document.createElement('section');
  selectedPanel.className = 'selected-skills-panel';
  selectedPanel.setAttribute('aria-live', 'polite');
  selectedPanel.innerHTML = '<p class="selected-skills-title">選択中</p><div id="selectedSkillChips" class="selected-skill-chips"></div>';

  const candidatePanel = document.createElement('section');
  candidatePanel.className = 'skill-section candidate-skill-section';
  candidatePanel.innerHTML = '<p class="skill-section-title">文章から候補になった技術</p><div id="candidateSkills" class="skill-grid compact-skill-grid"></div>';

  const moreButton = document.createElement('button');
  moreButton.id = 'moreSkillsBtn';
  moreButton.className = 'sub-btn wide more-skills-btn';
  moreButton.type = 'button';
  moreButton.setAttribute('aria-expanded', 'false');
  moreButton.textContent = 'ほかの技術を見る';

  const allPanel = document.createElement('section');
  allPanel.id = 'allSkillsPanel';
  allPanel.className = 'skill-section all-skill-section hidden';
  allPanel.innerHTML = '<p class="skill-section-title">ほかの技術</p><div id="otherSkills" class="skill-grid compact-skill-grid"></div>';

  requiredSkills.parentNode.insertBefore(selectedPanel, requiredSkills);
  requiredSkills.parentNode.insertBefore(candidatePanel, requiredSkills);
  requiredSkills.parentNode.insertBefore(moreButton, requiredSkills);
  requiredSkills.parentNode.insertBefore(allPanel, requiredSkills);
  requiredSkills.classList.add('skill-source-box');

  const candidateSkills = candidatePanel.querySelector('#candidateSkills');
  const otherSkills = allPanel.querySelector('#otherSkills');
  const selectedSkillChips = selectedPanel.querySelector('#selectedSkillChips');

  function skillIdFromLabel(label) {
    return label.querySelector('input[name="required"]')?.value || '';
  }

  function candidateIds() {
    const text = String(source?.value || '').toLowerCase();
    if (!text.trim() || typeof SKILLS === 'undefined') return [];
    return SKILLS
      .filter(skill => skill.keywords.some(keyword => text.includes(String(keyword).toLowerCase())))
      .map(skill => skill.id);
  }

  function updateSelected() {
    const checked = [...document.querySelectorAll('input[name="required"]:checked')];
    if (!checked.length) {
      selectedSkillChips.innerHTML = '<span class="selected-empty">まだありません</span>';
      return;
    }
    selectedSkillChips.innerHTML = checked.map(input => {
      const label = input.closest('.skill-chip');
      const name = label?.querySelector('span')?.textContent?.trim() || input.value;
      return `<span class="selected-skill-chip">${name}</span>`;
    }).join('');
  }

  function arrangeSkills() {
    const ids = candidateIds();
    const labels = [...requiredSkills.querySelectorAll('.skill-chip'), ...candidateSkills.querySelectorAll('.skill-chip'), ...otherSkills.querySelectorAll('.skill-chip')];
    labels.forEach(label => {
      const target = ids.includes(skillIdFromLabel(label)) ? candidateSkills : otherSkills;
      target.appendChild(label);
    });

    const hasCandidates = ids.length > 0;
    candidatePanel.classList.toggle('hidden', !hasCandidates);
    moreButton.classList.toggle('hidden', !hasCandidates);
    if (!hasCandidates) {
      allPanel.classList.remove('hidden');
      moreButton.setAttribute('aria-expanded', 'true');
    }
    updateSelected();
  }

  function currentStep() {
    const visible = analyzeTab.querySelector('.wizard-step:not(.hidden)');
    return Number(visible?.dataset.wizardStep || 1);
  }

  function updateStepUI() {
    const step = currentStep();
    actionGuide.textContent = ACTIONS[step] || '';
    document.body.dataset.wizardStep = String(step);
    document.body.classList.toggle('has-fixed-step-nav', step >= 2 && step <= 5 && !analyzeTab.classList.contains('hidden'));
    if (step === 2) arrangeSkills();
  }

  function updateTabMode() {
    const analyzeOpen = !analyzeTab.classList.contains('hidden');
    document.body.classList.toggle('analyze-mode', analyzeOpen);
    document.body.classList.toggle('has-fixed-step-nav', analyzeOpen && currentStep() >= 2);
  }

  moreButton.addEventListener('click', () => {
    const opening = allPanel.classList.contains('hidden');
    allPanel.classList.toggle('hidden', !opening);
    moreButton.setAttribute('aria-expanded', String(opening));
    moreButton.textContent = opening ? 'ほかの技術を閉じる' : 'ほかの技術を見る';
  });

  requiredSkills.addEventListener('change', updateSelected);
  candidatePanel.addEventListener('change', updateSelected);
  allPanel.addEventListener('change', updateSelected);
  source?.addEventListener('input', () => {
    if (currentStep() === 2) arrangeSkills();
  });
  suggestButton?.addEventListener('click', () => setTimeout(arrangeSkills, 0));

  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => setTimeout(() => {
      updateTabMode();
      updateStepUI();
    }, 0));
  });

  const observer = new MutationObserver(() => {
    updateTabMode();
    updateStepUI();
  });
  observer.observe(analyzeTab, { attributes: true, attributeFilter: ['class'], subtree: true });

  if (window.visualViewport) {
    const updateKeyboardState = () => {
      const keyboardOpen = window.innerHeight - window.visualViewport.height > 140;
      document.body.classList.toggle('keyboard-open', keyboardOpen);
    };
    window.visualViewport.addEventListener('resize', updateKeyboardState);
    window.visualViewport.addEventListener('scroll', updateKeyboardState);
    updateKeyboardState();
  }

  arrangeSkills();
  updateTabMode();
  updateStepUI();
})();