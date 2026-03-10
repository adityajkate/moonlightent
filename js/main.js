(function () {
    "use strict";

    /* ── Theme ───────────────────────────────────────────── */
    var THEME_KEY = 'me-theme';
    var htmlEl = document.documentElement;

    function applyTheme(theme) {
        htmlEl.classList.toggle('dark', theme === 'dark');
        htmlEl.classList.toggle('light', theme !== 'dark');
        localStorage.setItem(THEME_KEY, theme);
    }

    (function initTheme() {
        var saved = localStorage.getItem(THEME_KEY);
        if (saved) { applyTheme(saved); return; }
        applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    })();

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            applyTheme(htmlEl.classList.contains('dark') ? 'light' : 'dark');
        });
    });

    /* ── Spinner ─────────────────────────────────────────── */
    var spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.classList.remove('show');
        setTimeout(function () { spinner.remove(); }, 600);
    }

    /* ── Sticky Navbar ───────────────────────────────────── */
    var navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 80);
        }, { passive: true });
    }

    /* ── Mobile Menu ─────────────────────────────────────── */
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            var isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', isOpen);
            var icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars', isOpen);
            icon.classList.toggle('fa-times', !isOpen);
        });
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
                var icon = mobileMenuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });
    }

    /* ── Back to Top ─────────────────────────────────────── */
    var backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            backToTop.classList.toggle('hidden', window.scrollY <= 400);
        }, { passive: true });
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── Scroll Reveal (IntersectionObserver) ────────────── */
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
                    setTimeout(function () {
                        entry.target.classList.add('revealed');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ── Counter Up ──────────────────────────────────────── */
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.dataset.count, 10);
                    var duration = 2000;
                    var startTime = null;
                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        var progress = Math.min((timestamp - startTime) / duration, 1);
                        var eased = 1 - Math.pow(1 - progress, 4);
                        el.textContent = Math.floor(eased * target).toLocaleString();
                        if (progress < 1) requestAnimationFrame(step);
                    }
                    requestAnimationFrame(step);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { counterObserver.observe(el); });
    }

    /* ── Custom Cursor ───────────────────────────────────── */
    var cursor = document.querySelector('.custom-cursor');
    var cursorDot = document.querySelector('.custom-cursor-dot');
    if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
        var mouseX = -100, mouseY = -100;
        var ringX = -100, ringY = -100;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = 'translate(' + (mouseX - 3) + 'px, ' + (mouseY - 3) + 'px)';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursor.style.transform = 'translate(' + (ringX - 10) + 'px, ' + (ringY - 10) + 'px)';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        document.querySelectorAll('a, button, .cursor-pointer, .portfolio-item').forEach(function (el) {
            el.addEventListener('mouseenter', function () { document.body.classList.add('hovering'); });
            el.addEventListener('mouseleave', function () { document.body.classList.remove('hovering'); });
        });
    }

    /* ── Testimonial Slider ──────────────────────────────── */
    var track = document.querySelector('.testimonial-track');
    if (track) {
        var slides = track.querySelectorAll('.testimonial-slide');
        var currentSlide = 0;
        var autoTimer = null;

        function getVisible() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        function updateSlider() {
            var visible = getVisible();
            var pct = 100 / visible;
            slides.forEach(function (s) { s.style.minWidth = pct + '%'; });
            var max = slides.length - visible;
            if (currentSlide > max) currentSlide = max;
            track.style.transform = 'translateX(-' + (currentSlide * pct) + '%)';
        }

        function goNext() {
            var visible = getVisible();
            var max = slides.length - visible;
            currentSlide = currentSlide >= max ? 0 : currentSlide + 1;
            updateSlider();
        }

        function goPrev() {
            var visible = getVisible();
            var max = slides.length - visible;
            currentSlide = currentSlide <= 0 ? max : currentSlide - 1;
            updateSlider();
        }

        function startAuto() {
            autoTimer = setInterval(goNext, 5000);
        }

        function resetAuto() {
            clearInterval(autoTimer);
            startAuto();
        }

        var nextBtn = document.querySelector('.testimonial-next');
        var prevBtn = document.querySelector('.testimonial-prev');
        if (nextBtn) nextBtn.addEventListener('click', function () { goNext(); resetAuto(); });
        if (prevBtn) prevBtn.addEventListener('click', function () { goPrev(); resetAuto(); });

        window.addEventListener('resize', updateSlider, { passive: true });
        updateSlider();
        startAuto();
    }

    /* ── Portfolio Filter ────────────────────────────────── */
    var filterBtns = document.querySelectorAll('#portfolio-filters li');
    var portfolioItems = document.querySelectorAll('.portfolio-item');
    if (filterBtns.length && portfolioItems.length) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('filter-active'); });
                btn.classList.add('filter-active');
                var filter = btn.dataset.filter;
                portfolioItems.forEach(function (item) {
                    var show = filter === 'all' || item.classList.contains(filter);
                    if (show) {
                        item.style.display = '';
                        requestAnimationFrame(function () { item.classList.remove('pf-hidden'); });
                    } else {
                        item.classList.add('pf-hidden');
                        setTimeout(function () {
                            if (item.classList.contains('pf-hidden')) item.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }

    /* ── Native Lightbox ─────────────────────────────────── */
    var lbModal = document.getElementById('lightbox-modal');
    var lbImg = document.getElementById('lightbox-img');
    if (lbModal && lbImg) {
        document.querySelectorAll('[data-lightbox]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                lbImg.src = link.href;
                lbModal.showModal();
            });
        });
        document.getElementById('lightbox-close').addEventListener('click', function () {
            lbModal.close();
        });
        lbModal.addEventListener('click', function (e) {
            if (e.target === lbModal) lbModal.close();
        });
    }

})();
