document.addEventListener('DOMContentLoaded', function () {
    // 设置 scrollRestoration 为 manual
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // 在页面卸载前保存滚动位置
    window.addEventListener('beforeunload', function () {
        localStorage.setItem('scrollPosition', window.scrollY);
    });

    // 在页面加载时恢复滚动位置
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    if (savedScrollPosition !== null) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        localStorage.removeItem('scrollPosition');
    }

    // 处理导航栏进度条
    window.addEventListener('scroll', function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        var clientHeight = document.documentElement.clientHeight || window.innerHeight;
        var scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
        var progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // 处理回到顶部按钮
    window.onscroll = function () {
        const scrollTopButton = document.getElementById("scrollTopButton");
        const chargingImage = document.getElementById("chargingImage");
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        if (scrollTopButton) {
            if (scrollTop > 100) {
                scrollTopButton.style.display = "block";
            } else {
                scrollTopButton.style.display = "none";
            }
        }

        if (chargingImage) {
            chargingImage.style.opacity = scrollPercent / 100;
        }
    };

    // 处理回到顶部按钮点击事件
    const scrollTopButton = document.getElementById("scrollTopButton");
    if (scrollTopButton) {
        scrollTopButton.onclick = function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    // 切换主题
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', function () {
            document.body.classList.toggle('day-theme');
            const isDayTheme = document.body.classList.contains('day-theme');
            localStorage.setItem('theme', isDayTheme ? 'day' : 'night');
            if (typeof toggleTopIndexContent === 'function') {
                toggleTopIndexContent(isDayTheme);
            } else {
                console.error('toggleTopIndexContent function is not defined');
            }
        });
    }

    // 页面加载时读取主题状态
    const savedTheme = localStorage.getItem('theme');
    const isDayTheme = savedTheme === 'day';
    if (isDayTheme) {
        document.body.classList.add('day-theme');
    } else {
        document.body.classList.remove('day-theme');
    }
    if (typeof toggleTopIndexContent === 'function') {
        toggleTopIndexContent(isDayTheme);
    } else {
        console.error('toggleTopIndexContent function is not defined');
    }

    // 侧边栏按钮
    const themeSwitcherBtn = document.getElementById('theme-switcher');
    if (themeSwitcherBtn) {
        themeSwitcherBtn.addEventListener('click', function (e) {
            const button = e.currentTarget;
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    }

    // 使用AJAX只刷新文章部分
    const tabs = document.querySelectorAll('.tabs a[data-page]');
    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });

    function loadPage(page) {
        const articleContainer = document.getElementById('article-container');
        const loadingIndicator = document.getElementById('loading-indicator');

        // 显示加载指示器并添加淡出效果
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        articleContainer.classList.add('fade-out');

        const xhr = new XMLHttpRequest();
        xhr.open('GET', page, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xhr.responseText, 'text/html');
                const newContent = doc.querySelector('.article-container').innerHTML;

                // 替换内容并添加淡入效果
                articleContainer.innerHTML = newContent;
                articleContainer.classList.remove('fade-out');
                articleContainer.classList.add('fade-in');

                // 隐藏加载指示器
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                window.scrollTo(0, 0); // 切换页面后滚动到顶部
                rebindEvents(); // 重新绑定事件
            } else {
                console.error('Error loading page');
            }
        };
        xhr.onerror = function () {
            console.error('Request failed');
        };
        xhr.send();
    }

    function rebindEvents() {
        // 重新绑定需要的事件处理程序
        const tabs = document.querySelectorAll('.tabs a[data-page]');
        tabs.forEach(tab => {
            tab.addEventListener('click', function (event) {
                event.preventDefault();
                const page = this.getAttribute('data-page');
                loadPage(page);
            });
        });
    }
});

// 主页图片
function openModal(imgSrc) {
    var modal = document.getElementById("modal");
    var modalImg = document.getElementById("modal-content");
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modalImg.src = imgSrc;
    document.body.style.overflow = "hidden"; // 防止背景滚动

    // 添加淡入效果
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10);
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.opacity = "0";
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // 恢复背景滚动
    }, 300); // 等待淡出动画完成
}

// 关闭模态框
var modal = document.getElementById("modal");
var span = document.getElementById("modal-close");
if (span) {
    span.onclick = closeModal;
}

// 点击模态框外部关闭
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}
