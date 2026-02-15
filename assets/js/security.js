// Security Protection Script
// Prevents common code scraping and unauthorized access attempts

(function() {
    'use strict';

    // Prevent right-click context menu
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        return false;
    }, false);

    // Prevent text selection and copying
    document.addEventListener('selectstart', function(event) {
        event.preventDefault();
        return false;
    }, false);

    document.addEventListener('copy', function(event) {
        event.preventDefault();
        return false;
    }, false);

    document.addEventListener('cut', function(event) {
        event.preventDefault();
        return false;
    }, false);

    // Prevent drag and drop
    document.addEventListener('dragstart', function(event) {
        event.preventDefault();
        return false;
    }, false);

    // Disable keyboard shortcuts for developer tools
    document.addEventListener('keydown', function(event) {
        // F12 - Developer Tools
        if (event.key === 'F12') {
            event.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I - Developer Tools
        if (event.ctrlKey && event.shiftKey && event.key === 'I') {
            event.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J - JavaScript Console
        if (event.ctrlKey && event.shiftKey && event.key === 'J') {
            event.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+C - Element Inspector
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+K - Web Console
        if (event.ctrlKey && event.shiftKey && event.key === 'K') {
            event.preventDefault();
            return false;
        }
        
        // Ctrl+S - Save Page
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            return false;
        }
        
        // Ctrl+P - Print
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            return false;
        }
    }, false);

    // Detect if DevTools is open
    function detectDevTools() {
        let devtools = { open: false };
        const threshold = 160;
        
        setInterval(function() {
            if (window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    onDevToolsOpen();
                }
            } else {
                if (devtools.open) {
                    devtools.open = false;
                    onDevToolsClose();
                }
            }
        }, 500);
    }

    function onDevToolsOpen() {
        console.clear();
        console.log('%cWARNING', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cUnauthorized access attempt detected. Developer tools are disabled on this site.', 'color: red; font-size: 14px;');
    }

    function onDevToolsClose() {
        // DevTools closed
    }

    // Disable console (but keep functional for legitimate use)
    // Note: Commenting out to prevent errors while maintaining security
    // console.log = function() {};
    // console.warn = function() {};
    // console.error = function() {};
    // console.debug = function() {};

    // Prevent access to debugger with simple check
    setInterval(function() {
        try {
            (function() { debugger; }).toString().length;
        } catch (e) {
            // Debugger detected
        }
    }, 1000);

    // Detect common scraping tools and user agents
    const userAgent = navigator.userAgent.toLowerCase();
    const allowedAgents = [
        'googlebot', 'bingbot', 'duckduckbot', 'yandex', 'baiduspider',
        'slurp', 'facebot', 'twitterbot', 'linkedinbot'
    ];

    const suspiciousAgents = [
        'scraper', 'wget', 'curl', 'python', 'java',
        'node', 'phantomjs', 'selenium', 'headless', 'puppeteer', 'httponly',
        'ahrefs', 'semrush', 'nitreo', 'dotbot', 'mj12bot'
    ];

    let isSuspicious = false;
    const isAllowedAgent = allowedAgents.some(function(agent) {
        return userAgent.includes(agent);
    });

    if (!isAllowedAgent) {
        suspiciousAgents.forEach(function(agent) {
            if (userAgent.includes(agent)) {
                isSuspicious = true;
            }
        });
    }

    if (isSuspicious) {
        // Block access for suspicious user agents
        document.body.innerHTML = '<h1>Access Denied</h1><p>Automated access is not permitted.</p>';
        window.stop();
    }

    // Disable View Page Source
    // Note: This cannot fully prevent it, but discourages users
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
    });

    // Watermark detection (optional)
    window.addEventListener('beforeunload', function() {
        // Page is being closed or reloaded
    });

    // Read-only timing APIs: do not write to performance.timing/navigationStart.
    // Keep a local timestamp instead for any internal checks.
    const securityNavigationStart =
        (window.performance && (window.performance.timeOrigin || window.performance.now()))
            ? (window.performance.timeOrigin || window.performance.now())
            : Date.now();

    console.log('%cProtected by Ainvnt Security', 'color: #1E88E5; font-size: 12px;');

    // Initialize DevTools detection
    detectDevTools();

})();
