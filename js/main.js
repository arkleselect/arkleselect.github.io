document.addEventListener('DOMContentLoaded', function () {
    // 将主题切换功能封装到一个函数中
    function setupThemeToggle() {
        const themeToggle = document.querySelector('.switchTheme');
        const body = document.body;

        // 检查并应用保存的主题
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-theme');
        }

        // 切换主题
        function toggleTheme() {
            body.classList.toggle('dark-theme');
            localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
            console.log('Theme toggled');
        }

        // 确保themeToggle元素存在
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
            console.log('Theme toggle button listener added');
        } else {
            console.error('Theme toggle button not found');
        }
    }

    // 为导航链接添加事件监听器
    function setupNavLinks() {
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');

                if (href === 'https://mastodon.li/@wpprqi') {
                    // 如果是 Mastodon 链接，直接打开新标签页
                    window.open(href, '_blank');
                } else {
                    // 否则，使用 AJAX 加载新内容
                    loadContent(href);
                }
            });
        });
    }

    // AJAX加载内容
    function loadContent(url) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(this.responseText, 'text/html');
                const newContent = doc.querySelector('.main-content');
                if (newContent) {
                    document.querySelector('.main-content').innerHTML = newContent.innerHTML;
                    // 重新设置主题切换和导航链接
                    setupThemeToggle();
                    setupNavLinks(); // 这里重新设置导航链接事件监听器
                    setActiveNavLinks(); // 更新活动状态
                }
                // 更新浏览器历史
                history.pushState(null, '', url);

                // 设置活动链接的颜色
                setActiveNavLinks();
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }

    // 处理浏览器的前进/后退
    window.addEventListener('popstate', function (e) {
        loadContent(location.pathname);
    });

    // 设置活动链接的颜色
    function setActiveNavLinks() {
        const navLinks = document.querySelectorAll('.nav a');
        const currentPath = location.pathname;

        navLinks.forEach(link => {
            const linkPath = link.pathname;
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 初始设置
    setupThemeToggle();
    setupNavLinks();
    setActiveNavLinks();

    // 顶部导航栏动态隐藏
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    const scrollThreshold = 50; // 滚动多少像素才触发隐藏/显示

    window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
            if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                // 向下滚动
                header.classList.add('hidden');
            } else {
                // 向上滚动
                header.classList.remove('hidden');
            }
            lastScrollTop = scrollTop;
        }
    });
});