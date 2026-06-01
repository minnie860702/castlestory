// 讀取語言偏好，預設 zh-TW
window.__lang = (function() {
  try { return localStorage.getItem('quiz-lang') || 'zh-TW'; } catch(e) { return 'zh-TW'; }
})();

// UI 文字對照表
window.__i18n = {
  ui: {
    'zh-TW': {
      intro_badge:       '🔮 心理測驗',
      intro_title:       '🏰古堡試煉：測出你的靈魂原型',
      intro_desc:        '一個關於選擇、勇氣與自我發現的故事。只需 3 分鐘，揭開你潛意識中的真實人格。',
      btn_start:         '開始探索',
      view_count_suffix: ' 人已測過',
      q_count:           function(n, total) { return `第 ${n} 題 / 共 ${total} 題`; },
      btn_prev:          '上一題',
      result_badge:      '分析結果',
      score_label:       '共鳴指數',
      box_title_1:       '人格特質',
      box_title_2:       '詳細數值',
      btn_retry:         '再測一次',
      share_text: function(resTitle) {
        return `我的靈魂角色是【${resTitle}】！👻 \n快來挑戰《🏰 古堡試煉：測出你的靈魂原型》測出你潛意識中的真實人格！`;
      }
    },
    'en': {
      intro_badge:       '🔮 Personality Quiz',
      intro_title:       '🏰 Castle Trial: Discover Your Soul Archetype',
      intro_desc:        'A tale of choice, courage, and self-discovery. Unveil your true persona in just 3 minutes.',
      btn_start:         'Start Journey',
      view_count_suffix: ' people tested',
      q_count:           function(n, total) { return `Q${n} / ${total}`; },
      btn_prev:          'Back',
      result_badge:      'Analysis',
      score_label:       'Resonance',
      box_title_1:       'Traits',
      box_title_2:       'Stats',
      btn_retry:         'Retry',
      share_text: function(resTitle) {
        return `My soul character is [${resTitle}]! 👻 \nTake the "🏰 Castle Trial: Discover Your Soul Archetype" to reveal your true dark persona!`;
      }
    }
  },
  questions: {
    'zh-TW': null, // 將在 app.js 中回退到 storyQuizData.questions
    'en': [
      {
        text: "You stand before the rusted iron gate. The castle looms in the moonlight. How do you enter?",
        hint: "The first step of your adventure",
        options: [
          { label: "Knock loudly, announcing your arrival" },
          { label: "Climb the low wall and detour through the garden" },
          { label: "Scatter salt at the entrance to ward off evil" },
          { label: "Inspect the reliefs for hidden mechanisms" }
        ]
      },
      {
        text: "The portraits in the hallway seem to stare at you. One frame is missing. You...",
        hint: "The empty space waits for something",
        options: [
          { label: "Hang your coat on it as a joke" },
          { label: "Feel the empty wall for secret passages" },
          { label: "Walk fast, keeping your head down" },
          { label: "Bow elegantly to the empty space" }
        ]
      },
      {
        text: "A smoky feast sits on the dining table, but the hall is empty. Candles flicker.",
        hint: "Temptation meets unease",
        options: [
          { label: "Take a bite, you're hungry anyway" },
          { label: "Check the food for rot or poison" },
          { label: "Shout 'Is anyone here?'" },
          { label: "Leave this creepy hall immediately" }
        ]
      },
      {
        text: "A blurred figure appears behind you in the mirror. You turn around, but nothing is there.",
        hint: "The border between illusion and reality",
        options: [
          { label: "Ask the mirror: 'Who are you?'" },
          { label: "Punch the mirror to shatter the illusion" },
          { label: "Close your eyes and chant a banishing spell" },
          { label: "Run away to find the light" }
        ]
      },
      {
        text: "Books float silently in a dark library. One falls open right before you.",
        hint: "Knowledge can be more dangerous than shadows",
        options: [
          { label: "Read it to understand the castle's history" },
          { label: "Cover the pages, too afraid to look" },
          { label: "Put the book back on the shelf" },
          { label: "Tear out a page as a souvenir" }
        ]
      },
      {
        text: "Eerie glowing flowers bloom in the night garden, whispering in human voices.",
        hint: "Nature has its own ominous side",
        options: [
          { label: "Lean in to hear their whispers" },
          { label: "Pluck a flower and keep it" },
          { label: "Use a spray to wither the flowers" },
          { label: "Walk through silently without stopping" }
        ]
      },
      {
        text: "Hundreds of glass eyes stare at you in the doll room. One moves behind you.",
        hint: "The malice of lifeless objects",
        options: [
          { label: "Turn and kick the moving doll" },
          { label: "Pick up the cutest looking doll" },
          { label: "Shout 'I am not afraid of you'" },
          { label: "Hold your breath and slowly back away" }
        ]
      },
      {
        text: "The massive pendulum in the clock tower swings backwards, slowing your heartbeat.",
        hint: "The curse of time is spreading",
        options: [
          { label: "Try to move the gears to fix the clock" },
          { label: "Close eyes and count your pulse to resist" },
          { label: "Carve today's date on the wall" },
          { label: "Sing loudly to drown out the pendulum" }
        ]
      },
      {
        text: "A glowing chest sits in the deep basement, surrounded by black slime.",
        hint: "The final wealth and trap",
        options: [
          { label: "Ignore the slime and open the chest" },
          { label: "Burn the slime with a torch" },
          { label: "Bypass the chest and find the exit" },
          { label: "Talk to the chest, attempting a conversation" }
        ]
      },
      {
        text: "A whisper at the final heavy door: 'Leave something behind, and you may pass.'",
        hint: "The final chapter of price and release",
        options: [
          { label: "Give up a piece of jewelry" },
          { label: "Cut your finger and drop a tear of blood" },
          { label: "Close your eyes and surrender a deep memory" },
          { label: "Try to ram the door open with your shoulder" }
        ]
      }
    ]
  },
  resultText: {
    'zh-TW': null, // 將在 app.js 中回退到 storyQuizData.results
    'en': [
      {
        title: "Lone Exorcist",
        desc: "You rely on logic and power. No shadow can stop you. You are the sole destroyer in the dark.",
        keywords: ["Bold", "Logical", "Guardian", "Fearless"],
        radarData: { "Courage": 98, "Calmness": 85, "Insight": 60, "Ghostly": 12, "Psychic": 30 }
      },
      {
        title: "Holy Guardian",
        desc: "You guard your inner light against deep fears. A beacon of order and human will in the castle.",
        keywords: ["Just", "Resolute", "Radiant", "Disciplined"],
        radarData: { "Courage": 88, "Calmness": 92, "Insight": 55, "Ghostly": 20, "Psychic": 45 }
      },
      {
        title: "Agile Hunter",
        desc: "The castle is just a maze of loot to you. You skillfully dodge traps and claim your prize.",
        keywords: ["Nimble", "Wealth", "Agile", "Practical"],
        radarData: { "Courage": 70, "Calmness": 65, "Insight": 82, "Ghostly": 30, "Psychic": 50 }
      },
      {
        title: "Secret Heir",
        desc: "You share a mysterious bond with this place. You face the paranormal with dark elegance.",
        keywords: ["Elegant", "Curious", "Mystic", "Compatible"],
        radarData: { "Courage": 75, "Calmness": 90, "Insight": 92, "Ghostly": 35, "Psychic": 70 }
      },
      {
        title: "Abyss Astrologer",
        desc: "Obsessed with knowledge and fate. You find truth in chaotic stars, merging with the dark.",
        keywords: ["Wise", "Loner", "Stellar", "Oracle"],
        radarData: { "Courage": 60, "Calmness": 78, "Insight": 95, "Ghostly": 55, "Psychic": 85 }
      },
      {
        title: "Ghost Bard",
        desc: "You turn fear into music. Walking the edge of death, you soothe souls with epic dark tales.",
        keywords: ["Artistic", "Sensitive", "Melodic", "Wanderer"],
        radarData: { "Courage": 55, "Calmness": 60, "Insight": 80, "Ghostly": 65, "Psychic": 90 }
      },
      {
        title: "Chosen Sacrifice",
        desc: "Highly empathetic to the dead. Your pure sacrifice makes you the perfect offering here.",
        keywords: ["Empath", "Sacrifice", "Psychic", "Pure"],
        radarData: { "Courage": 40, "Calmness": 50, "Insight": 88, "Ghostly": 90, "Psychic": 95 }
      },
      {
        title: "The New Master",
        desc: "You mastered the castle's dark power. No longer a guest—you are the new sovereign.",
        keywords: ["Sovereign", "Abyssal", "Powerful", "Eternal"],
        radarData: { "Courage": 85, "Calmness": 98, "Insight": 99, "Ghostly": 100, "Psychic": 100 }
      }
    ]
  }
};

window.setLanguage = function(lang) {
  if (!window.__i18n.ui[lang]) return;
  window.__lang = lang;
  try { localStorage.setItem('quiz-lang', lang); } catch(e) {}

  // 更新按鈕 active 狀態
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  var ui = window.__i18n.ui[lang];

  // 更新所有帶有 data-i18n 屬性的元素 (使用 textContent)
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    const key = el.getAttribute('data-i18n');
    if (ui[key] !== undefined) {
      el.textContent = ui[key];
    } else if (key === 'box_title_1') {
      el.innerHTML = '<i class="fa-solid fa-scroll"></i> ' + ui[key];
    } else if (key === 'box_title_2') {
      el.innerHTML = '<i class="fa-solid fa-chart-simple"></i> ' + ui[key];
    }
  });

  // 進度保留：重新渲染畫面
  var quizActive = document.getElementById('screen-quiz')?.classList.contains('active');
  var resultActive = document.getElementById('screen-result')?.classList.contains('active');

  if (quizActive && typeof renderQuestion === 'function') {
    renderQuestion(currentQ);
  }
  if (resultActive && window.__pendingResultIndex !== undefined && typeof showResult === 'function') {
    showResult(true); // 傳入 true 表示不重啟動畫，純文字更新
  }
};
