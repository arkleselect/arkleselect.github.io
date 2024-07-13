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

    // 处理回到顶部按钮下方百分比进度
    document.addEventListener("scroll", function () {
        const scrollProgress = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = Math.round((scrollProgress / scrollHeight) * 100);
        const progressElement = document.getElementById("progress");
        if (progressElement) {
            progressElement.innerText = `${scrollPercentage}%`;
        }
    });

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 切换主题
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', function () {
            document.body.classList.toggle('day-theme');
            const isDayTheme = document.body.classList.contains('day-theme');
            localStorage.setItem('theme', isDayTheme ? 'day' : 'night');
            toggleTopIndexContent(isDayTheme);
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
    toggleTopIndexContent(isDayTheme);

    // 侧边栏按钮
    document.getElementById('theme-switcher').addEventListener('click', function (e) {
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

// 时间线目录
// document.addEventListener("DOMContentLoaded", function () {
//     // 获取所有标题元素
//     const headings = document.querySelectorAll(".articletruly h2");
//     const timelineMarker = document.getElementById('timeline-marker');
//     const timeline = document.querySelector('.timeline');
//     const markerHeight = 20; // 请根据实际需要调整
//     const timelineHeight = timeline.offsetHeight;
//     const markerStep = 30; 

//     // 设置 Intersection Observer 的阈值
//     const observerThreshold = 0.5;
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 updateTimeline(entry.target);
//             }
//         });
//     }, { threshold: observerThreshold });

//     // 为每个标题创建时间线内容并设置观察者
//     headings.forEach((heading, index) => {
//         observer.observe(heading);
        
//         const content = document.createElement('div');
//         content.classList.add('timeline-content');
//         content.setAttribute('data-index', index);
//         content.innerHTML = `<h2>${heading.textContent}</h2>`;
//         content.style.top = `${index * markerStep}px`;
//         timeline.appendChild(content);

//         // 点击时间线内容滚动到对应标题
//         content.addEventListener('click', () => {
//             heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         });
//     });

//     // 更新时间线标记位置和激活状态
//     function updateTimeline(visibleHeading) {
//         const index = Array.from(headings).indexOf(visibleHeading);
//         timelineMarker.style.top = `${index * markerStep}px`;
//         document.querySelectorAll('.timeline-content').forEach(content => {
//             content.classList.toggle('active', content.getAttribute('data-index') == index);
//         });
//     }

//     // 初始化第一个时间线内容为激活状态
//     document.querySelector('.timeline-content[data-index="0"]').classList.add('active');

//     // 更新时间线位置的函数
//     function updateTimelinePosition() {
//         // 计算滚动百分比，并放大其影响以加快时间线移动速度
//         const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
//         const acceleratedScrollPercentage = Math.min(scrollPercentage * 3, 1); // 加快2倍

//         // 设置起始位置（页面底部）和结束位置（页面垂直中心）
//         const startPosition = window.innerHeight;
//         const endPosition = window.innerHeight / 2 - timelineHeight / 2;
//         // 计算当前位置
//         const currentPosition = startPosition - (startPosition - endPosition) * acceleratedScrollPercentage;
//         // 更新时间线位置
//         timeline.style.top = `${currentPosition}px`;
//     }

//     // 设置初始位置（页面底部）
//     timeline.style.top = `${window.innerHeight}px`;

//     // 监听滚动和窗口大小变化事件，更新时间线位置
//     window.addEventListener('scroll', updateTimelinePosition);
//     window.addEventListener('resize', updateTimelinePosition);

//     // 调整时间线内容的位置，使其与新的CSS代码匹配
//     function adjustTimelineContentPosition() {
//         const contents = document.querySelectorAll('.timeline-content');
//         contents.forEach((content, index) => {
//             content.style.top = `${index * markerStep + (markerHeight / 2)}px`;
//         });
//     }

//     // 初始化调整位置
//     adjustTimelineContentPosition();
// });

document.addEventListener("DOMContentLoaded", function () {
    const headings = document.querySelectorAll(".articletruly h2");
    const timeline = document.querySelector('.timeline');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateTimeline(entry.target);
        }
      });
    }, { threshold: 0.5 });

    headings.forEach((heading, index) => {
      observer.observe(heading);

      const item = document.createElement('div');
      item.classList.add('timeline-item');
      item.setAttribute('data-index', index);
      timeline.appendChild(item);

      const content = document.createElement('div');
      content.classList.add('timeline-content');
      content.setAttribute('data-index', index);
      content.innerHTML = `
        <h2>${heading.textContent}</h2>
      `;
      timeline.appendChild(content);

      content.addEventListener('click', () => {
        heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    function updateTimeline(visibleHeading) {
      const index = Array.from(headings).indexOf(visibleHeading);
      document.querySelectorAll('.timeline-content').forEach(content => {
        content.classList.toggle('active', content.getAttribute('data-index') == index);
      });

      document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-index') == index);
      });
    }

    document.querySelector('.timeline-content[data-index="0"]').classList.add('active');
    document.querySelector('.timeline-item[data-index="0"]').classList.add('active');
  });