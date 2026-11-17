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
  if (/mac/.test(platform) || /macintosh|mac os x/.test(ua)) {
    // Chrome/Edge 高熵架构提示为 x86 时推荐 Intel 版，否则默认 Apple Silicon
    return arch === 'x86' || /intel/.test(platform) ? 'macOSIntel' : 'macOS';
  }
  return 'Windows'; // 移动端/未知系统 → 通用的 Windows 绿色版
}

function applyOSRecommendation(platform) {
  const labels = {
    'Windows': 'Windows 绿色版',
    'macOS': 'macOS Apple Silicon 版',
    'macOSIntel': 'macOS Intel 版',
  };
  document.querySelectorAll('.dl-card').forEach(card => {
    const isRecommended = card.dataset.platform === platform;
    card.classList.toggle('featured', isRecommended);
    const btn = card.querySelector('.btn');
    if (btn) {
      btn.classList.toggle('btn-primary', isRecommended);
      btn.classList.toggle('btn-outline', !isRecommended);
    }
    const ribbon = card.querySelector('.dl-ribbon');
    if (ribbon) ribbon.style.display = isRecommended ? '' : 'none';
  });
  const hint = document.getElementById('os-hint');
  if (hint) {
    const label = labels[platform] || platform;
    hint.textContent = platform === 'Windows'
      ? `已为你推荐通用版本：${label}（如使用 Mac，请选对应架构）`
      : `已检测到你的系统，为你推荐 ${label}`;
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
