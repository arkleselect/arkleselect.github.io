document.addEventListener('DOMContentLoaded', function() {
  // 查找所有的代码块并为其添加复制功能
  document.querySelectorAll('.highlight').forEach(function(block) {
    // 创建复制按钮
    let button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerText = 'Copy';
    block.appendChild(button);

    // 点击按钮复制内容
    button.addEventListener('click', function() {
      let code = block.querySelector('code').innerText;
      navigator.clipboard.writeText(code).then(() => {
        button.innerText = 'Copied'; // 复制成功后显示 "Copied"
        setTimeout(() => {
          button.innerText = 'Copy'; // 2秒后恢复为 "Copy"
        }, 2000);
      }).catch(err => {
        console.error('复制失败:', err);
      });
    });
  });
});
