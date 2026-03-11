// Embedded footer HTML - no CORS issues
(function() {
    const footerHTML = `<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h4>Ainvnt</h4>
                <p>Your trusted partner in digital transformation</p>
                <p><a href="tel:+919490364940">+91 9490364940</a></p>
                <p><a href="mailto:ainvnt@outlook.com">ainvnt@outlook.com</a></p>
                <p>D&amp;B D-U-N-S Number: 737931348</p>
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
                    <li><a href="privacy-policy.html">Privacy Policy</a></li>
                    <li><a href="terms-of-use.html">Terms of Use</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Follow Us</h4>
                <div class="social-links">
                    <a href="https://www.linkedin.com/company/ainvnt" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>
                    <a href="https://twitter.com/ainvnt" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>
                    <a href="https://www.facebook.com/ainvnt" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a>
                    <a href="https://instagram.com/ainvnt" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Ainvnt. All rights reserved.</p>
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
