// Embedded footer HTML - no CORS issues
(function() {
    const footerHTML = `<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h4>Ainvnt</h4>
                <p>Your trusted partner in digital transformation</p>
            </div>
            <div class="footer-section">
                <h4>Services</h4>
                <ul>
                    <li><a href="web-applications.html">Web Applications</a></li>
                    <li><a href="mobile-apps.html">Mobile Apps</a></li>
                    <li><a href="cloud-solutions.html">Cloud Solutions</a></li>
                    <li><a href="bi-tools.html">BI & Analytics</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Company</h4>
                <ul>
                    <li><a href="about-us.html">About Us</a></li>
                    <li><a href="portfolio.html">Portfolio</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="careers.html">Careers</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Follow Us</h4>
                <div class="social-links">
                    <a href="https://www.linkedin.com/company/ainvnt" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-github"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Ainvnt. All rights reserved.</p>
        </div>
    </div>
</footer>
<button class="scroll-top" aria-label="Scroll to top" type="button">
    <i class="fas fa-arrow-up"></i>
</button>`;

    // Inject footer into the container
    document.addEventListener('DOMContentLoaded', function() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
        }
    });
})();
