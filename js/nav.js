document.addEventListener('DOMContentLoaded', function () {
  const themeToggleButton = document.getElementById('theme-toggle');
  
  // 移除之前绑定的点击事件，防止重复
  themeToggleButton.removeEventListener('click', themeToggleHandler);
  themeToggleButton.addEventListener('click', themeToggleHandler);
});

function themeToggleHandler() {
  console.log("Theme toggle button clicked");

  document.body.classList.toggle('dark-theme');

  if (document.body.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark-theme');
  } else {
    localStorage.setItem('theme', 'light-theme');
  }
}
