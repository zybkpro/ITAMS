/* ============================================================
   IT-AMS 官网交互脚本

   下载按钮指向 GitHub Releases 资源 URL，
   大体积安装包不进 git，由 Releases 托管。
   本脚本只负责：移动端菜单、按访客系统高亮推荐版本、滚动动画。
   ============================================================ */

/* ===== 移动端菜单 ===== */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ===== 根据访客系统自动推荐下载 ===== */
function detectOS() {
  const uad = navigator.userAgentData || {};
  const platform = (uad.platform || navigator.platform || '').toLowerCase();
  const arch = (uad.architecture || '').toLowerCase();
  const ua = (navigator.userAgent || '').toLowerCase();

  if (/windows|win32|win64/.test(platform + ' ' + ua)) return 'Windows';
  if (/mac/.test(platform) || /macintosh|mac os x/.test(ua)) return 'macOS';
  return 'Windows';
}

function applyOSRecommendation(platform) {
  const labels = {
    'Windows': 'Windows（V1.3 需激活 / V1.2 免费）',
    'macOS': 'macOS V1.2 免费版',
  };
  document.querySelectorAll('.dl-card').forEach(card => {
    const key = card.dataset.platform || '';
    const isRecommended = key === platform || (platform === 'Windows' && key === 'WindowsFree');
    card.classList.toggle('os-match', isRecommended);
  });
  const hint = document.getElementById('os-hint');
  if (hint) {
    hint.textContent = `已检测到你的系统：${labels[platform] || platform}。V1.2 免费使用，V1.3 需激活码。`;
    hint.classList.add('show');
  }
}
applyOSRecommendation(detectOS());

/* ===== 滚动进入动画 ===== */
const revealEls = document.querySelectorAll(
  '.pain-card, .feature-card, .sync-step, .tech-wrap, .road-card, .dl-card, .faq-item, .section-head'
);
if ('IntersectionObserver' in window) {
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        }, i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}
