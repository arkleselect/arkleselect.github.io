// 确保在全局作用域定义 toggleTopIndexContent 函数
function toggleTopIndexContent(isDayTheme) {
    // 实现你的函数逻辑
    console.log("Toggle top index content, isDayTheme:", isDayTheme);
}

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

    // 处理回到顶部按钮
    const scrollTopButton = document.getElementById("scrollTopButton");

    function updateScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        if (scrollTopButton) {
            scrollTopButton.style.display = scrollTop > 100 ? "block" : "none";
        }
    }

    window.addEventListener('scroll', updateScroll);
    updateScroll(); // 初始更新

    // 处理回到顶部按钮点击事件
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

    // 侧边栏按钮涟漪效果
    const themeSwitcherRipple = document.getElementById('theme-switcher');
    if (themeSwitcherRipple) {
        themeSwitcherRipple.addEventListener('click', function (e) {
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

                articleContainer.innerHTML = newContent;
                articleContainer.classList.remove('fade-out');
                articleContainer.classList.add('fade-in');

                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                window.scrollTo(0, 0);
                rebindEvents();
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
    document.body.style.overflow = "hidden";

    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10);
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.opacity = "0";
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }, 300);
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
