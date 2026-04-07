#!/usr/bin/env python3
"""
Website Audit Scorer v1.0
Automatically checks a website against key audit criteria and generates a score.

Usage: python website_auditor_v1.0.py https://example.com

Requirements:
  - pip install requests beautifulsoup4

— Benjamin Rodriguez
"""

import sys
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import re
import time
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# Color codes for output
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
END = '\033[0m'
BOLD = '\033[1m'


class WebsiteAuditor:
    def __init__(self, url):
        self.url = self._normalize_url(url)
        self.domain = urlparse(self.url).netloc
        self.session = self._create_session()
        self.response = None
        self.soup = None
        self.scores = {}
        
    def _normalize_url(self, url):
        """Ensure URL has protocol"""
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        return url
    
    def _create_session(self):
        """Create a requests session with retries"""
        session = requests.Session()
        retry = Retry(connect=3, backoff_factor=0.5)
        adapter = HTTPAdapter(max_retries=retry)
        session.mount('http://', adapter)
        session.mount('https://', adapter)
        return session
    
    def fetch_page(self):
        """Fetch the website and parse HTML"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            self.response = self.session.get(self.url, headers=headers, timeout=10)
            self.response.raise_for_status()
            self.soup = BeautifulSoup(self.response.content, 'html.parser')
            return True
        except requests.exceptions.RequestException as e:
            print(f"{RED}✗ Failed to fetch {self.url}: {e}{END}")
            return False
    
    def check_ssl(self):
        """Check if site uses HTTPS (SSL)"""
        has_ssl = self.url.startswith('https://')
        score = 5 if has_ssl else 0
        status = f"{GREEN}✓ Uses HTTPS{END}" if has_ssl else f"{RED}✗ No HTTPS (HTTP only){END}"
        return score, status
    
    def check_load_time(self):
        """Check page load time"""
        if not self.response:
            return 0, f"{RED}✗ Could not measure{END}"
        
        load_time = self.response.elapsed.total_seconds()
        if load_time < 3:
            score = 10
            status = f"{GREEN}✓ Loads in {load_time:.2f}s (under 3s){END}"
        elif load_time < 5:
            score = 5
            status = f"{YELLOW}⚠ Loads in {load_time:.2f}s (3-5s){END}"
        else:
            score = 0
            status = f"{RED}✗ Loads in {load_time:.2f}s (over 5s){END}"
        return score, status
    
    def check_mobile_viewport(self):
        """Check if mobile viewport meta tag exists"""
        if not self.soup:
            return 0, f"{RED}✗ Could not check{END}"
        
        viewport = self.soup.find('meta', attrs={'name': 'viewport'})
        score = 5 if viewport else 0
        status = f"{GREEN}✓ Has mobile viewport{END}" if viewport else f"{RED}✗ Missing mobile viewport{END}"
        return score, status
    
    def check_title_meta(self):
        """Check for title tag and meta description"""
        if not self.soup:
            return 0, f"{RED}✗ Could not check{END}"
        
        title = self.soup.find('title')
        meta_desc = self.soup.find('meta', attrs={'name': 'description'})
        
        score = 0
        details = []
        
        if title and len(title.string or '') > 0:
            score += 2
            details.append(f"{GREEN}✓ Title tag present{END}")
        else:
            details.append(f"{RED}✗ Missing title tag{END}")
        
        if meta_desc:
            score += 3
            details.append(f"{GREEN}✓ Meta description present{END}")
        else:
            details.append(f"{RED}✗ Missing meta description{END}")
        
        status = " | ".join(details)
        return score, status
    
    def check_phone_number(self):
        """Check if phone number is on page"""
        if not self.soup:
            return 0, f"{RED}✗ Could not check{END}"
        
        page_text = self.soup.get_text()
        # Match common phone patterns (US, with or without formatting)
        phone_pattern = r'(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}'
        phones = re.findall(phone_pattern, page_text)
        
        if phones:
            score = 5
            status = f"{GREEN}✓ Phone number found ({phones[0]}){END}"
        else:
            score = 0
            status = f"{RED}✗ No phone number detected{END}"
        
        return score, status
    
    def check_cta_button(self):
        """Check for call-to-action buttons"""
        if not self.soup:
            return 0, f"{RED}✗ Could not check{END}"
        
        cta_keywords = ['contact', 'call', 'book', 'schedule', 'get started', 'sign up', 'buy', 'order', 'request', 'quote']
        buttons = self.soup.find_all(['a', 'button'])
        
        found_ctas = []
        for btn in buttons:
            text = (btn.get_text() or '').lower().strip()
            if any(keyword in text for keyword in cta_keywords):
                found_ctas.append(text)
        
        if found_ctas:
            score = 5
            status = f"{GREEN}✓ CTA button found ({found_ctas[0][:30]}){END}"
        else:
            score = 0
            status = f"{RED}✗ No clear CTA button{END}"
        
        return score, status
    
    def check_reviews_testimonials(self):
        """Check for reviews or testimonials"""
        if not self.soup:
            return 0, f"{RED}✗ Could not check{END}"
        
        page_text = self.soup.get_text().lower()
        review_keywords = ['review', 'testimonial', 'star', 'rating', 'client', 'feedback', 'quote', 'says']
        
        found = any(keyword in page_text for keyword in review_keywords)
        
        if found:
            score = 5
            status = f"{GREEN}✓ Reviews/testimonials detected{END}"
        else:
            score = 0
            status = f"{RED}✗ No reviews or testimonials{END}"
        
        return score, status
    
    def check_broken_images(self):
        """Check for broken image tags (alt text missing = bad practice)"""
        if not self.soup:
            return 0, f"{RED}✗ Could not check{END}"
        
        images = self.soup.find_all('img')
        if not images:
            return 5, f"{GREEN}✓ No images (or optimized){END}"
        
        broken = sum(1 for img in images if not img.get('alt'))
        total = len(images)
        
        if broken == 0:
            score = 5
            status = f"{GREEN}✓ All images have alt text ({total} images){END}"
        elif broken < total * 0.3:
            score = 3
            status = f"{YELLOW}⚠ {broken}/{total} images missing alt text{END}"
        else:
            score = 0
            status = f"{RED}✗ Many images missing alt text ({broken}/{total}){END}"
        
        return score, status
    
    def check_http_status(self):
        """Check HTTP status code"""
        if not self.response:
            return 0, f"{RED}✗ Could not connect{END}"
        
        status_code = self.response.status_code
        if status_code == 200:
            score = 5
            status = f"{GREEN}✓ HTTP 200 (OK){END}"
        elif status_code < 400:
            score = 3
            status = f"{YELLOW}⚠ HTTP {status_code}{END}"
        else:
            score = 0
            status = f"{RED}✗ HTTP {status_code} (Error){END}"
        
        return score, status
    
    def check_cms_platform(self):
        """Detect CMS platform (WordPress, Wix, Squarespace, etc.)"""
        if not self.response or not self.soup:
            return "Unknown"
        
        html = self.response.text.lower()
        
        if 'wp-content' in html or 'wp-includes' in html:
            return "WordPress"
        elif 'wix.com' in html or 'wixstatic' in html:
            return "Wix"
        elif 'squarespace' in html:
            return "Squarespace"
        elif 'shopify' in html:
            return "Shopify"
        elif 'webflow' in html:
            return "Webflow"
        elif 'wistia' in html or 'tumblr' in html:
            return "Tumblr/Custom"
        else:
            return "Custom/Unknown"
    
    def run_full_audit(self):
        """Run complete audit and calculate scores"""
        if not self.fetch_page():
            return False
        
        print(f"\n{BOLD}{BLUE}Auditing: {self.url}{END}\n")
        
        # Mobile Experience (25 points)
        print(f"{BOLD}Mobile Experience (25 points){END}")
        mobile_ssl, status = self.check_ssl()
        print(f"  {status}")
        mobile_viewport, status = self.check_mobile_viewport()
        print(f"  {status}")
        mobile_score = mobile_ssl + mobile_viewport + 10  # Plus estimated points for layout
        print(f"  Estimated: {mobile_score}/25\n")
        self.scores['mobile'] = min(mobile_score, 25)
        
        # Speed & Performance (20 points)
        print(f"{BOLD}Speed & Performance (20 points){END}")
        load_time, status = self.check_load_time()
        print(f"  {status}")
        images, status = self.check_broken_images()
        print(f"  {status}")
        perf_score = load_time + images
        print(f"  Estimated: {perf_score}/20\n")
        self.scores['performance'] = min(perf_score, 20)
        
        # Search Visibility (20 points)
        print(f"{BOLD}Search Visibility (20 points){END}")
        title, status = self.check_title_meta()
        print(f"  {status}")
        http_status, status = self.check_http_status()
        print(f"  {status}")
        seo_score = title + 5  # 5 for manual Google Business check
        print(f"  Estimated: {seo_score}/20 (manual: check Google Business Profile)\n")
        self.scores['seo'] = min(seo_score, 20)
        
        # Trust & Credibility (20 points)
        print(f"{BOLD}Trust & Credibility (20 points){END}")
        ssl, status = self.check_ssl()
        print(f"  {status}")
        reviews, status = self.check_reviews_testimonials()
        print(f"  {status}")
        phone, status = self.check_phone_number()
        print(f"  {status}")
        cta, status = self.check_cta_button()
        print(f"  {status}")
        trust_score = ssl + reviews + phone + cta
        print(f"  Estimated: {trust_score}/20\n")
        self.scores['trust'] = min(trust_score, 20)
        
        # Design & Content (15 points)
        print(f"{BOLD}Design & Content (15 points){END}")
        cms = self.check_cms_platform()
        print(f"  Platform: {BLUE}{cms}{END}")
        design_score = 7  # Requires manual review; 7 points baseline
        print(f"  Manual review needed: modernness, accuracy, originality")
        print(f"  Baseline: {design_score}/15\n")
        self.scores['design'] = design_score
        
        return True
    
    def print_summary(self):
        """Print final score summary"""
        total = sum(self.scores.values())
        max_score = 100
        percentage = (total / max_score) * 100
        
        # Determine grade
        if total >= 80:
            grade = f"{GREEN}GOOD{END}"
            interpretation = "Rare — probably don't need your help"
        elif total >= 60:
            grade = f"{YELLOW}NEEDS IMPROVEMENT{END}"
            interpretation = "Strong upsell opportunity"
        elif total >= 40:
            grade = f"{RED}POOR{END}"
            interpretation = "Sales pitch territory"
        else:
            grade = f"{RED}CRITICAL{END}"
            interpretation = "Their site is actively hurting them"
        
        print(f"\n{BOLD}{'='*60}")
        print(f"FINAL AUDIT SCORE: {total}/100 ({percentage:.0f}%)")
        print(f"{'='*60}{END}")
        print(f"Grade: {grade}")
        print(f"Interpretation: {interpretation}\n")
        
        print(f"{BOLD}Score Breakdown:{END}")
        print(f"  Mobile Experience:     {self.scores['mobile']}/25")
        print(f"  Speed & Performance:   {self.scores['performance']}/20")
        print(f"  Search Visibility:     {self.scores['seo']}/20")
        print(f"  Trust & Credibility:   {self.scores['trust']}/20")
        print(f"  Design & Content:      {self.scores['design']}/15")
        print()
        
        print(f"{BOLD}Next Steps:{END}")
        if total < 80:
            print(f"  1. Build demo site showing improvements")
            print(f"  2. Send outreach email sequence (Email 1 with demo)")
            print(f"  3. Follow up with competitive comparison")
            print(f"  4. Prepare pricing proposal")
        else:
            print(f"  → This prospect probably already has a good site")
            print(f"  → Consider looking for other opportunities")


def main():
    if len(sys.argv) < 2:
        print(f"{BOLD}Website Auditor v1.0{END}")
        print(f"Automatically scores a website against key audit criteria\n")
        print(f"Usage: python website_auditor_v1.0.py <URL>\n")
        print(f"Example: python website_auditor_v1.0.py example.com\n")
        print(f"Requirements:")
        print(f"  pip install requests beautifulsoup4\n")
        sys.exit(1)
    
    url = sys.argv[1]
    auditor = WebsiteAuditor(url)
    
    if auditor.run_full_audit():
        auditor.print_summary()
    else:
        print(f"{RED}Audit failed. Check the URL and try again.{END}")
        sys.exit(1)


if __name__ == '__main__':
    main()
