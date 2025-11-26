// 导航栏功能
// 注释掉此函数,因为导航激活状态由 Hugo 模板控制
// function initNavigation() {
//   const menuButtons = document.querySelectorAll('.menu-button');
//   menuButtons.forEach(button => {
//     button.addEventListener('click', function () {
//       menuButtons.forEach(btn => btn.classList.remove('menu-button-active'));
//       this.classList.add('menu-button-active');
//     });
//   });
// }

// 新增部分
function initMenuSticky() {
  const menu = document.querySelector('.menu');
  const sentinel = document.querySelector('.menu-sentinel');
  if (!menu || !sentinel) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        menu.classList.add('sticky');
      } else {
        menu.classList.remove('sticky');
      }
    },
    { threshold: [0], rootMargin: '0px 0px 0px 0px' }
  );
  observer.observe(sentinel);
}

// 平滑滚动到锚点
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
  // initNavigation(); // 已注释,由 Hugo 模板控制激活状态
  initMenuSticky();

  // 绑定文章卡片点击跳转
  document.querySelectorAll('.article-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      // 如果点击的是 a 标签，不处理
      if (e.target.tagName.toLowerCase() === 'a') return;
      var url = item.getAttribute('data-url');
      if (url) {
        window.location.href = url;
      }
    });
  });
});

window.addEventListener('load', function () {
  document.body.classList.add('loaded');
});

document.querySelectorAll('.highlight pre, .chroma pre, pre').forEach(pre => {
  // 避免重复添加
  if (pre.parentElement.querySelector('.code-copy-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'code-copy-btn';
  btn.textContent = '复制';
  btn.title = '复制到剪贴板';
  btn.addEventListener('click', () => {
    const code = pre.innerText;
    navigator.clipboard.writeText(code);
    btn.textContent = '已复制!';
    setTimeout(() => btn.textContent = '复制', 1200);
  });
  pre.parentElement.style.position = 'relative';
  pre.parentElement.appendChild(btn);
});