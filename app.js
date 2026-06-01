// State Management
let currentQ = 0;
let answers = [];
let quizData = null;

// Initialize Particles
function initParticles() {
    const container = document.getElementById('bg-particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.opacity = Math.random() * 0.5;

        // Random drift animation
        const duration = 10 + Math.random() * 20;
        p.style.animation = `float ${duration}s infinite linear`;
        container.appendChild(p);
    }
}

// Screen Switcher
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + screenId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Start Quiz
function startQuiz() {
    document.getElementById('intro-bg').classList.add('hidden');
    showScreen('quiz');
    renderQuestion(0);
}

// Render Question
function renderQuestion(idx) {
    if (!quizData) return;
    currentQ = idx;
    
    const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || quizData.questions;
    const qText = _qs[idx];
    const qMeta = quizData.questions[idx];

    // Update Progress
    const total = quizData.questions.length;
    const _ui = window.__i18n && window.__i18n.ui[window.__lang];
    document.getElementById('q-count').textContent = _ui ? _ui.q_count(idx + 1, total) : `第 ${idx + 1} 題 / 共 ${total} 題`;
    
    const pct = Math.round(((idx) / total) * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('q-pct').textContent = pct + '%';

    // Update Text
    document.getElementById('q-text').textContent = qText.text;
    document.getElementById('q-hint').textContent = qText.hint || '';

    // Update Image
    const qImg = document.getElementById('q-illust');
    qImg.src = qMeta.image || `https://source.unsplash.com/featured/?story,mystery&sig=${idx}`;

    // Render Options
    const wrap = document.getElementById('options-wrap');
    wrap.innerHTML = '';
    const labels = ['A', 'B', 'C', 'D'];

    qMeta.options.forEach((optMeta, oi) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        if (answers[idx] === oi) btn.classList.add('selected');

        const optLabel = qText.options && qText.options[oi] ? qText.options[oi].label : optMeta.label;
        btn.innerHTML = `
            <span class="opt-label">${labels[oi]}</span>
            <span>${optLabel}</span>
        `;
        btn.onclick = () => selectOption(oi);
        wrap.appendChild(btn);
    });

    // Prev Button
    document.getElementById('btn-prev').disabled = idx === 0;
}

// Select Option
function selectOption(oi) {
    answers[currentQ] = oi;

    // Visual feedback
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach((b, i) => b.classList.toggle('selected', i === oi));

    // Auto advance
    setTimeout(() => {
        if (currentQ < quizData.questions.length - 1) {
            renderQuestion(currentQ + 1);
        } else {
            // Update progress to 100%
            document.getElementById('progress-fill').style.width = '100%';
            document.getElementById('q-pct').textContent = '100%';
            setTimeout(showResult, 400);
        }
    }, 400);
}

// Prev Question
function prevQ() {
    if (currentQ > 0) renderQuestion(currentQ - 1);
}

// Calculate Result
function showResult(skipAnimation = false) {
    // Basic scoring logic (sum of scores)
    let totalScore = 0;
    const dimensionScores = {}; // For radar chart if applicable

    answers.forEach((ansIndex, qIndex) => {
        const opt = quizData.questions[qIndex].options[ansIndex];
        totalScore += opt.score || 0;

        // Dimensions
        if (opt.dimensions) {
            for (let d in opt.dimensions) {
                dimensionScores[d] = (dimensionScores[d] || 0) + opt.dimensions[d];
            }
        }
    });

    // Find matching result
    let resultIndex = quizData.results.findIndex(r => totalScore >= r.min && totalScore <= r.max);
    if (resultIndex === -1) resultIndex = 0;
    
    window.__pendingResultIndex = resultIndex; // Store for language switching
    
    const meta = quizData.results[resultIndex];
    let result = meta;
    if (window.__getResult) {
        result = window.__getResult(resultIndex);
    }

    // Populate UI
    document.getElementById('res-title').textContent = result.title;
    document.getElementById('res-desc').textContent = result.desc;
    document.getElementById('res-score').textContent = Math.min(100, Math.round((totalScore / (quizData.questions.length * 3)) * 100));
    document.getElementById('res-hero-img').src = meta.image || 'https://source.unsplash.com/featured/?achievement';

    // Keywords
    const keywordWrap = document.getElementById('res-keywords');
    keywordWrap.innerHTML = '';
    if (result.keywords) {
        result.keywords.forEach(k => {
            const span = document.createElement('span');
            span.className = 'keyword-tag';
            span.textContent = k;
            keywordWrap.appendChild(span);
        });
    }

    // Detailed Stats Bars
    const statsWrap = document.getElementById('res-stats-bars');
    statsWrap.innerHTML = '';
    
    const radarDataToUse = result.radarData || meta.radarData;
    if (radarDataToUse) {
        Object.entries(radarDataToUse).forEach(([label, value]) => {
            const item = document.createElement('div');
            item.className = 'stat-bar-item';
            item.innerHTML = `
                <div class="stat-bar-label">
                    <span>${label}</span>
                    <span>${value}%</span>
                </div>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${skipAnimation ? value : 0}%"></div>
                </div>
            `;
            statsWrap.appendChild(item);

            if (!skipAnimation) {
                setTimeout(() => {
                    item.querySelector('.stat-bar-fill').style.width = value + '%';
                }, 100);
            }
        });
    }

    if (!skipAnimation) {
        showScreen('result');

        // Effects
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#a78bfa', '#3b82f6', '#ffffff']
        });

        // Draw Radar
        if (radarDataToUse) {
            setTimeout(() => drawRadarChart(radarDataToUse), 300);
        }

        // Trigger Interstitial Ad after 3 seconds
        setTimeout(() => {
            if (typeof showAdInterstitial === 'function') {
                showAdInterstitial();
            }
        }, 3000);
    } else {
        if (radarDataToUse) {
            drawRadarChart(radarDataToUse);
        }
    }
}

// Radar Chart (Simple Canvas implementation)
function drawRadarChart(data) {
    const canvas = document.getElementById('radar-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 300;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 100;
    const keys = Object.keys(data);
    const numAxes = keys.length;

    ctx.clearRect(0, 0, width, height);

    // Draw background circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    for (let i = 1; i <= 4; i++) {
        ctx.arc(centerX, centerY, radius * (i / 4), 0, Math.PI * 2);
    }
    ctx.stroke();

    // Draw axes
    ctx.beginPath();
    keys.forEach((key, i) => {
        const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));

        // Labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px Outfit';
        const labelX = centerX + (radius + 20) * Math.cos(angle);
        const labelY = centerY + (radius + 20) * Math.sin(angle);
        ctx.textAlign = 'center';
        ctx.fillText(key, labelX, labelY);
    });
    ctx.stroke();

    // Draw data polygon
    ctx.fillStyle = 'rgba(167, 139, 250, 0.4)';
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    keys.forEach((key, i) => {
        const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
        const val = data[key] / 100; // Assuming 0-100
        const x = centerX + radius * val * Math.cos(angle);
        const y = centerY + radius * val * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// Reset Quiz
function resetQuiz() {
    currentQ = 0;
    answers = [];
    document.getElementById('intro-bg').classList.remove('hidden');
    showScreen('intro');
}

// ── 偵測 LINE 內建瀏覽器 ──
function isLineIAB() {
  return /Line/i.test(navigator.userAgent);
}

// ── 偵測手機裝置 ──
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// ── 跨瀏覽器複製文字（含 LINE IAB fallback）──
function copyTextFallback(str) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(str).catch(() => execCopyFallback(str));
  }
  return execCopyFallback(str);
}
function execCopyFallback(str) {
  return new Promise((resolve) => {
    const ta = document.createElement('textarea');
    ta.value = str;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
    resolve();
  });
}

// ── 跨瀏覽器開啟連結 ──
function openUrl(url) {
  window.open(url, '_blank');
}

// ── 分享功能 ──
function shareTo(platform) {
  const url = window.location.href;
  const resTitle = document.getElementById('res-title').textContent;
  
  const _ui = window.__i18n && window.__i18n.ui[window.__lang];
  const text = _ui ? _ui.share_text(resTitle) : `我的靈魂角色是【${resTitle}】！👻 \n快來挑戰《幽靈古堡心理測驗》測出你潛意識中的真實人格！`;
  
  const fullText = encodeURIComponent(text + '\n' + url);

  if (platform === 'copy') {
    copyTextFallback(text + '\n' + url).then(() => {
      showShareToast('✅ 已複製到剪貼簿！');
    });
    return;
  }

  if (platform === 'ig') {
    copyTextFallback(text + '\n' + url).then(() => {
      showShareToast('📸 文字已複製！請到 IG 限動或貼文手動貼上');
      setTimeout(() => {
        if (isMobile()) { window.location.href = 'instagram://app'; }
        else { openUrl('https://www.instagram.com/'); }
      }, 600);
    });
    return;
  }

  let shareUrl = '';
  switch (platform) {
    case 'line':
      if (isMobile()) {
        shareUrl = `line://msg/text/${encodeURIComponent(text + '\n' + url)}`;
      } else if (isLineIAB()) {
        shareUrl = `https://line.me/R/share?text=${fullText}`;
      } else {
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      }
      break;
    case 'threads':
      shareUrl = `https://www.threads.net/intent/post?text=${fullText}`;
      break;
    case 'fb':
      if (isMobile()) {
        window.location.href = `fb://share/?link=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        setTimeout(() => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        }, 1500);
        return;
      }
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      break;
  }
  if (shareUrl) {
    if (platform === 'line' && isMobile()) {
      window.location.href = shareUrl;
    } else {
      openUrl(shareUrl);
    }
  }
}

// ── Toast 提示 ──
function showShareToast(msg) {
  let toast = document.getElementById('share-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'share-toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(13,13,26,0.95);border:1px solid rgba(167,139,250,0.3);color:#fff;padding:14px 24px;border-radius:16px;font-size:14px;z-index:9999;opacity:0;transition:all 0.3s;backdrop-filter:blur(12px);text-align:center;max-width:320px;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 4000);
}

// ── 圖片下載（一般瀏覽器） ──
function downloadCanvasImage(canvas, filename) {
  try {
    canvas.toBlob(function(blob) {
      if (!blob) { fallbackDataURLDownload(canvas, filename); return; }
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(blobUrl); }, 500);
    }, 'image/png');
  } catch(e) {
    fallbackDataURLDownload(canvas, filename);
  }
}

function fallbackDataURLDownload(canvas, filename) {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); }, 500);
}

// ── LINE IAB 圖片 Overlay ──
function showImageOverlay(dataUrl) {
  const old = document.getElementById('img-overlay');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'img-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
  overlay.innerHTML = `
    <img src="${dataUrl}" alt="結果圖" style="max-width:92%;max-height:70vh;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.5);">
    <p style="color:#ccc;margin-top:20px;font-size:15px;">📸 請長按圖片儲存</p>
    <button onclick="document.getElementById('img-overlay').remove()" style="margin-top:16px;color:#a78bfa;font-size:14px;background:none;border:1px solid rgba(167,139,250,0.4);border-radius:999px;padding:12px 24px;cursor:pointer;">← 返回</button>
  `;
  document.body.appendChild(overlay);
}

async function captureResultCard() {
    const area = document.getElementById('result-capture-area');
    return html2canvas(area, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true
    });
}

let _saving = false;
async function saveResultImage() {
  if (_saving) return;
  _saving = true;
  const btn = document.querySelector('.share-save');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '產生中...';
  btn.disabled = true;

  try {
    const canvas = await captureResultCard();

    if (isLineIAB() || isMobile()) {
      const dataUrl = canvas.toDataURL('image/png');
      showImageOverlay(dataUrl);
      btn.innerHTML = origHTML;
      btn.disabled = false;
    } else {
      downloadCanvasImage(canvas, `quiz-result-${Date.now()}.png`);
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
      btn.style.borderColor = '#06C755';
      setTimeout(() => { btn.innerHTML = origHTML; btn.style.borderColor = ''; btn.disabled = false; }, 2000);
    }
  } catch (e) {
    console.error(e);
    btn.innerHTML = origHTML;
    btn.disabled = false;
    showShareToast('⚠️ 自動下載失敗，請手動截圖分享');
  } finally {
    _saving = false;
  }
}

// Load Data
window.onload = () => {
    initParticles();

    // Check if quizData is defined (from quiz-data.js)
    if (typeof storyQuizData !== 'undefined') {
        quizData = storyQuizData;
        
        // Setup i18n fallback map
        if (window.__i18n) {
            window.__i18n.questions['zh-TW'] = storyQuizData.questions;
            window.__i18n.resultText['zh-TW'] = storyQuizData.results;
            
            window.__getResult = function(index) {
                const meta = storyQuizData.results[index];
                const text = (window.__i18n.resultText[window.__lang] || window.__i18n.resultText['zh-TW'])[index];
                return Object.assign({}, meta, text);
            };
        }
        
        applyData();
    } else {
        console.error('Quiz data not found!');
    }

    // Mock view count
    document.getElementById('view-count').textContent = Math.floor(Math.random() * 5000 + 1000).toLocaleString();
};

function applyData() {
    document.title = quizData.title;

    if (quizData.introImage) {
        document.getElementById('intro-bg').style.backgroundImage = `url(${quizData.introImage})`;
    }
    
    if (typeof setLanguage === 'function') {
        setLanguage(window.__lang || 'zh-TW');
    }
}



// ====================
// 插頁廣告邏輯
// ====================
function showAdInterstitial() {
  const el = document.getElementById('ad-interstitial');
  if (!el) return;
  el.style.display = 'flex';
  const closeBtn = el.querySelector('.ad-inter-close');
  closeBtn.disabled = true;
  closeBtn.textContent = '5';
  closeBtn.style.cursor = 'not-allowed';
  closeBtn.style.opacity = '0.5';
  let count = 5;
  const timer = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(timer);
      closeBtn.textContent = '✕';
      closeBtn.disabled = false;
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.opacity = '1';
    } else {
      closeBtn.textContent = count;
    }
  }, 1000);
}

function closeAdInterstitial() {
  const el = document.getElementById('ad-interstitial');
  if (!el) return;
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.3s';
  setTimeout(() => {
    el.style.display = 'none';
    el.style.opacity = '1';
    el.style.transition = '';
  }, 300);
}
