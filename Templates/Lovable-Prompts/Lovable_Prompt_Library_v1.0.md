# Lovable.dev Prompt Library — AI Local Website Agency

**v1.0 — Complete Lovable.dev prompt library with 5 niche master prompts + customization variants**

> This library contains tested, copy-paste-ready prompts optimized for Lovable's AI to generate professional local business websites. Each niche includes a master prompt, customization variants, placeholder content, and deployment steps.

---

## TABLE OF CONTENTS

1. **HOME SERVICES** — Plumbers, Electricians, HVAC, Roofers, Cleaners, Handymen
2. **PERSONAL SERVICES** — Barbers, Salons, Spas, Tattoo Shops, Nail Shops
3. **FOOD & DRINK** — Restaurants, Cafes, Food Trucks, Bakeries, Catering
4. **HEALTH & WELLNESS** — Dentists, Chiropractors, Gyms, Yoga, Physical Therapy
5. **AUTO** — Repair, Detailing, Body Shops, Tire Shops, Dealerships
6. **BONUS: Speed Build Prompt** — Universal template for any local business
7. **DEPLOYMENT CHECKLIST** — Steps to go from Lovable to live site

---

---

# 1. HOME SERVICES NICHE

> **Target:** Plumbers, Electricians, HVAC, Roofers, Cleaners, Handymen
> 
> **Design Philosophy:** Trust-focused, emergency-ready, service-area heavy, social-proof-rich. These businesses sell reliability. Colors should signal professionalism and dependability.

## Color Psychology for Home Services
- **Primary:** Navy Blue (#1e3a5f) — Trust, professionalism, stability
- **Secondary:** Bright Orange (#ff6b35) — Energy, urgency, emergency service visibility
- **Accent:** Light Gray (#f5f5f5) — Clean, professional background
- **Text:** Charcoal (#2c3e50) — High contrast, readable, trustworthy

---

## MASTER PROMPT: HOME SERVICES SITE GENERATOR

```
You are an expert web designer specializing in home service businesses. 
Create a professional, trust-focused website for [BUSINESS_NAME], a [SERVICE_TYPE] 
company serving [SERVICE_AREA]. This site must emphasize licensed/insured/bonded status, 
emergency availability, and service quality.

## SITE STRUCTURE:
1. **Hero Section** (above fold):
   - Headline: "[SERVICE_TYPE] You Can Trust in [SERVICE_AREA]"
   - Subheading: "[BUSINESS_NAME] — Licensed • Insured • Bonded • 24/7 Emergency Service"
   - CTA Button 1 (Primary): "Call for Emergency Service: [PHONE]" — bright orange, large, fixed on scroll
   - CTA Button 2 (Secondary): "Get Free Quote" — links to quote form
   - Background: Professional tradesperson image (worker in uniform, confident pose)
   - Add 3-star Google review badge with sample review in corner

2. **Trust/Credentials Section** (3 columns):
   - Column 1: "Licensed & Insured" — checkmark icon, license number [LICENSE_#]
   - Column 2: "[X] Years of Experience" — since [YEAR] 
   - Column 3: "Available 24/7" — emergency icon, response time guarantee
   - All text navy blue on light gray background

3. **Services Grid** (6 service boxes, 3x2):
   Each box contains: [SERVICE_NAME], brief description, icon, estimated price range [PRICE_LOW-HIGH]
   Services to include:
   - [SERVICE_1]: [DESCRIPTION] - $[PRICE_1]
   - [SERVICE_2]: [DESCRIPTION] - $[PRICE_2]
   - [SERVICE_3]: [DESCRIPTION] - $[PRICE_3]
   - [SERVICE_4]: [DESCRIPTION] - $[PRICE_4]
   - [SERVICE_5]: [DESCRIPTION] - $[PRICE_5]
   - [SERVICE_6]: [DESCRIPTION] - $[PRICE_6]
   Design: Hover effect lifts card, icon changes color to orange

4. **Before/After Gallery** (8 photo boxes, 4x2):
   - Label each: "[SERVICE] — Before/After"
   - Use clean placeholder images if needed (home-improvement stock photos)
   - Add light box hover effect
   - Include caption: "[BUSINESS_NAME] transforms homes daily."

5. **Service Area Map Section**:
   - Map showing [SERVICE_AREA] in orange highlight
   - Text: "We proudly serve: [AREA_1], [AREA_2], [AREA_3]..."
   - If service area is large, list neighborhoods instead

6. **Google Reviews Section** (3 testimonial boxes):
   - Star rating: 5 stars (static, gold color)
   - Review text (3-4 sentences): "[REVIEW_TEXT]"
   - Reviewer name: "[FIRST_NAME]"
   - Review date: "[DATE]"
   - Recommendation: "99% would recommend [BUSINESS_NAME]"

7. **Free Quote/Contact Form**:
   - Form layout: 2-column on desktop, 1-column on mobile
   - Fields: Full Name, Phone, Email, Service Needed (dropdown: [SERVICE_1], [SERVICE_2]...), 
     Message (textarea), Preferred Contact Method (Phone/Email/Text)
   - Submit button: "Get Your Free Quote" (orange, large)
   - Success message: "Thank you! We'll call you within 1 hour."

8. **Business Hours / Footer**:
   - Hours: Monday-Friday [HOURS_1], Saturday [HOURS_2], Sunday [HOURS_3]
   - Emergency: "24/7 Emergency Service Available"
   - Contact: Phone [PHONE], Email [EMAIL], Address [ADDRESS]
   - Footer links: Home | Services | Reviews | Gallery | Contact
   - Trust badges: Licensed, Insured, Bonded (in footer)

## DESIGN REQUIREMENTS:
- Mobile-first responsive design — perfect on all devices
- Color scheme: Navy blue primary, orange accents, light gray backgrounds
- Font: Clean sans-serif (system fonts fine: -apple-system, Segoe UI)
- Typography: Hero headline bold, readable on mobile
- Animations: Subtle fade-in on scroll, smooth hover states, no jarring effects
- CTA buttons: Always visible, orange, large touch targets for mobile
- Social proof: Reviews, ratings, trust badges prominent above fold

## CONTENT TO INSERT:
- Business Name: [BUSINESS_NAME]
- Service Type: [SERVICE_TYPE]
- Phone: [PHONE]
- Email: [EMAIL]
- Address: [ADDRESS]
- Service Area: [SERVICE_AREA]
- License #: [LICENSE_#]
- Founded Year: [YEAR]
- Hours: Monday-Friday [HOURS_1], Saturday [HOURS_2], Sunday [HOURS_3]
- 6 Services with descriptions and price ranges (see [SERVICE_1] through [SERVICE_6] above)
- 3 Google reviews (see REVIEW_TEXT examples below)

Build this as a modern, single-page website using HTML5, CSS3, and vanilla JavaScript 
(no framework required). Make it fast, clean, and conversion-focused. Every element should 
serve the goal of getting customers to call or request a quote. Output the complete code 
ready to copy into Lovable.
```

---

## HOME SERVICES: PLACEHOLDER CONTENT

### Common Services (by type):
**Plumbers:**
1. Emergency Leak Repair — Burst pipes, active leaks, water damage. $150-$400
2. Drain Cleaning — Clogged drains, sewer line clearing. $100-$300
3. Water Heater Service — Installation, repair, maintenance. $200-$800
4. Bathroom Remodel — Fixtures, tiles, full bathroom updates. $3,000-$15,000
5. Sump Pump Installation — Basement water control, pump maintenance. $500-$1,500
6. Toilet Repair/Replacement — Running toilets, leaks, replacements. $150-$600

### Sample Google Reviews:
1. "Called [BUSINESS_NAME] at 11 PM with a burst pipe. They came out within 30 minutes and fixed it perfectly. Best service I've ever had. Highly recommend!" — Sarah M. (5 stars, 2 weeks ago)

2. "Fair pricing, professional team, and they cleaned up after themselves. Replaced my water heater in one afternoon. Will definitely use them again." — Michael T. (5 stars, 1 month ago)

3. "Had a small leak that other plumbers wanted to charge $500 for. [BUSINESS_NAME] fixed it for $75 and showed me what the problem was. Honest and fast." — Jennifer R. (5 stars, 3 weeks ago)

### Common Business Hours:
- Monday-Friday: 6:00 AM - 8:00 PM
- Saturday: 8:00 AM - 6:00 PM
- Sunday: 10:00 AM - 4:00 PM (or closed)
- Emergency: 24/7 available for emergency calls

### Common Taglines:
- "[BUSINESS_NAME] — Licensed. Insured. Available 24/7."
- "Emergency Service When You Need It Most."
- "Local, Licensed, and Trustworthy Since [YEAR]."
- "Fair Pricing. Fast Service. Lifetime Support."

---

---

# 2. PERSONAL SERVICES NICHE

> **Target:** Barbers, Salons, Spas, Tattoo Shops, Nail Shops
> 
> **Design Philosophy:** Portfolio/gallery-heavy, visually stunning, booking-centric. Customers come for the aesthetics and the artist. Colors should be stylish and sophisticated.

## Color Psychology for Personal Services
- **Primary:** Deep Purple (#663399) or Rose Gold (#b76e79) — Luxury, creativity, self-care
- **Secondary:** Teal (#008080) or Sage Green (#9caf88) — Calm, wellness, refresh
- **Accent:** Soft Gold (#d4af37) — Premium, elegant, luxury feel
- **Text:** Charcoal (#2c3e50) — Readable, professional

---

## MASTER PROMPT: PERSONAL SERVICES SITE GENERATOR

```
You are an expert web designer specializing in beauty and personal service businesses. 
Create a stunning, gallery-heavy website for [BUSINESS_NAME], a [SERVICE_TYPE] 
in [LOCATION]. This site must showcase the work, team, and online booking system.

## SITE STRUCTURE:

1. **Hero Section** (above fold):
   - Headline: "Meet Your New [SERVICE_TYPE_SINGULAR] at [BUSINESS_NAME]"
   - Subheading: "Award-Winning Team | Luxury Experience | Instant Online Booking"
   - CTA Button 1 (Primary): "Book Your Appointment Now" — gold, large
   - CTA Button 2 (Secondary): "View Our Gallery" — outlined, scrolls to gallery
   - Background: Stunning before/after or luxury interior shot (spa/salon aesthetic)
   - Add 5-star Google badge with quick review preview

2. **Meet the Team Section** (card grid, 2-4 team members):
   Each card contains:
   - Professional headshot (color, styled)
   - Name: [STYLIST/ARTIST_NAME]
   - Title: [SPECIALIZATION] — e.g., "Balayage Specialist", "Tattoo Artist"
   - Bio (2 sentences): [SHORT_BIO]
   - Years experience: [X] years
   - "View [NAME]'s Work" — link to filtered gallery
   - Social link to Instagram/TikTok if available
   Design: Hover shows bio, slight zoom effect

3. **Services & Pricing Menu** (table or card grid):
   Style as elegant menu card.
   Services by category with all prices visible.
   Include estimated duration for each service.

4. **Work Gallery / Portfolio** (12+ images in masonry/grid layout):
   - Each image tagged with: service type, stylist name, date
   - Light box on click (shows full image + details)
   - Filter buttons: "All", "[SERVICE_1]", "[SERVICE_2]", "[SERVICE_3]"
   - Hover text: "Styled by [ARTIST_NAME]" or service name
   - Caption: "[SERVICE] by [ARTIST]" visible on hover

5. **Booking System Section**:
   - Large CTA: "Book Your Experience"
   - Embed booking widget (or link to booking page)
   - Show available times: "Next available: [DAY] at [TIME]"

6. **Google Reviews / Testimonials** (3-5 cards):
   - 5-star rating (gold), customer name, review text
   - Date of review
   - Highlight: "[X]% customers book again"

7. **Hours & Location**:
   - Hours table
   - Location with embedded map
   - Address clickable (Google Maps link)
   - Call button: "[PHONE]" (large, always visible on mobile)

8. **Footer**:
   - Hours summary, phone, address, email
   - Social links: Instagram, Facebook, TikTok (if active)
   - Links: Home | Services | Gallery | About | Contact | Booking

## DESIGN REQUIREMENTS:
- Modern, luxury aesthetic — not trendy, timeless
- High-quality images throughout (portfolio is 80% of conversion)
- Mobile-first, perfect responsive design
- Color scheme: Purple/rose gold primary, teal/sage accent, soft gold highlights
- Font: Modern sans-serif or serif for headlines
- Galleries load fast (image optimization crucial)
- Booking button always visible, hero + sidebar on desktop
- Smooth scroll, subtle animations (fade-in galleries, hover states)

## CONTENT TO INSERT:
- Business Name: [BUSINESS_NAME]
- Service Type(s): [SERVICE_TYPE_1], [SERVICE_TYPE_2]
- Phone: [PHONE]
- Email: [EMAIL]
- Address: [ADDRESS]
- Location: [CITY], [STATE]
- Team members: [NAME_1], [NAME_2], [NAME_3], [NAME_4] (with specializations)
- Hours: [HOURS_TABLE]
- Services: [SERVICE_MENU with prices and durations]
- Gallery images: [12+ PORTFOLIO PHOTOS]
- Reviews: [3-5 CUSTOMER_TESTIMONIALS]

Build as modern, fast single-page site.
```

---

### Sample Google Reviews for Personal Services:
1. "[ARTIST_NAME] is an absolute artist. I walked in with a reference photo and my tattoo turned out better than I imagined. Professional, clean, talented. 10/10 would recommend." — David S. (5 stars, 2 weeks ago)

2. "Best salon experience ever! The team makes you feel pampered from the moment you walk in. My hair looks incredible and I'm already booked for my next appointment." — Lisa M. (5 stars, 1 month ago)

3. "I've been coming to [BUSINESS_NAME] for 3 years and wouldn't go anywhere else. Professional staff, fair pricing, always feels welcoming. Highly recommend!" — Amanda T. (5 stars, 3 weeks ago)

---

---

# 3. FOOD & DRINK NICHE

> **Target:** Restaurants, Cafes, Food Trucks, Bakeries, Catering
> 
> **Design Philosophy:** Food-photography-first, menu-forward, ordering/reservation system prominent. Customers eat with their eyes first. Colors should be warm, appetizing, Instagram-friendly.

## Color Psychology for Food & Drink
- **Primary:** Warm Orange (#ff7f50) or Terracotta (#cc6633) — Appetite, warmth, hospitality
- **Secondary:** Deep Brown (#5c4033) or Sage Green (#9caf88) — Natural, earthy, quality ingredients
- **Accent:** Gold (#d4af37) or Cream (#f5f1de) — Premium, approachable luxury
- **Text:** Dark Brown (#3e2723) — Readable, warm, friendly

---

## MASTER PROMPT: FOOD & DRINK SITE GENERATOR

```
You are an expert web designer specializing in food & beverage businesses. 
Create a mouth-watering, ordering-focused website for [BUSINESS_NAME], a [BUSINESS_TYPE] 
in [LOCATION]. This site must showcase food beautifully, display menus clearly, and 
drive reservations/orders.

## SITE STRUCTURE:

1. **Hero Section** (above fold):
   - Headline: "[TAGLINE]" — e.g., "Handcrafted Coffee & Fresh Pastries"
   - Subheading: "[BUSINESS_NAME] — [HOURS_SUMMARY]"
   - CTA Button 1 (Primary): "Order Online" or "Reserve a Table" — warm orange, large
   - CTA Button 2 (Secondary): "View Menu" — outlined
   - Background: Stunning high-quality food/restaurant photo (best dish or interior)
   - Add location badge and hours

2. **Quick Info Bar** (below hero, sticky on scroll):
   - Hours (highlight if currently open/closed)
   - Call button: "[PHONE]"
   - Address: "[ADDRESS]" with Google Maps link
   - Rating: [X.X] stars ([X] reviews)

3. **Menu Section** (tabs or accordion):
   - Organize by category: Appetizers, Entrees, Desserts, Beverages, etc.
   - Each item: dish name, description, price, dietary tags (V, GF, DF)

4. **Full Menu PDF Link**:
   - "Download Full Menu" button links to PDF

5. **Photo Gallery** (8-12 high-quality food photos):
   - Grid/masonry layout
   - Light box on click

6. **Ordering Section** (prominent, middle of page):
   - Option A: Embedded order system
   - Option B: Link to external (Uber Eats, GrubHub)

7. **Reservations Section** (if restaurant/dine-in):
   - "Reserve Your Table"
   - Calendar + time picker + party size

8. **About/Story Section**:
   - 2-3 sentences about the business, philosophy
   - Owner/chef name

9. **Google Reviews / Testimonials**:
   - 3-5 top reviews from Google, Yelp, or direct

10. **Location & Hours / Footer**:
    - Map showing location
    - Contact: phone, email
    - Links: Menu | Reserve | Order | About | Contact
    - Social: Facebook, Instagram
```

### Sample Google Reviews for Food & Drink:
1. "This is my go-to spot for morning coffee. The barista knows my order, the pastries are fresh, and the atmosphere is so welcoming. Can't recommend enough!" — Emily H. (5 stars, 1 week ago)

2. "Celebrated our anniversary at [BUSINESS_NAME]. Every course was exceptional. The server was attentive, the wine pairings were perfect. Worth every penny. Booking again!" — Robert P. (5 stars, 2 weeks ago)

3. "Best tacos in the city and I've tried them all. Fresh ingredients, generous portions, prices are fair. The owner is always there making sure everything is perfect." — Jessica L. (5 stars, 5 days ago)

---

---

# 4. HEALTH & WELLNESS NICHE

> **Target:** Dentists, Chiropractors, Gyms, Yoga Studios, Physical Therapy
> 
> **Design Philosophy:** Clean, clinical yet warm, patient-first, credentials-prominent. Trust through expertise and clear information. Colors should be calm and health-promoting.

## Color Psychology for Health & Wellness
- **Primary:** Medical Blue (#0066cc) or Teal (#008080) — Trust, health, cleanliness, professionalism
- **Secondary:** Soft Sage Green (#9caf88) or Calming Lavender (#b19cd9) — Wellness, calm, recovery
- **Accent:** Coral (#ff6b6b) or Warm White (#fffef0) — Approachability, energy
- **Text:** Charcoal (#2c3e50) — Readable, clinical, clear

---

## MASTER PROMPT: HEALTH & WELLNESS SITE GENERATOR

```
You are an expert web designer specializing in health & wellness practices. 
Create a professional, trust-focused website for [PRACTICE_NAME], a [PRACTICE_TYPE] 
in [LOCATION]. This site must instill confidence, display credentials, and make 
patient intake/booking easy.

## SITE STRUCTURE:

1. **Hero Section** (above fold):
   - Headline: "Your Health Is Our Priority"
   - Subheading: "[PRACTICE_NAME] — [CREDENTIAL_SUMMARY], Personalized Care"
   - CTA Button 1 (Primary): "Book Appointment Now" — teal, large
   - CTA Button 2 (Secondary): "New Patient Intake" — outlined
   - Background: Clean, professional healthcare/wellness environment photo
   - Add badge: "Accepts [INSURANCE_PROVIDERS]"

2. **Provider Credentials Section** (above-the-fold or early):
   - Provider name: [DOCTOR/PROVIDER_NAME]
   - Title: [CREDENTIALS: MD, DDS, DC, etc.]
   - Education: "[MEDICAL_SCHOOL], [YEAR]"
   - Board Certification: "[CERTIFICATION_NAME]"
   - Years of experience: [X] years
   - Specialties: [SPECIALTY_1], [SPECIALTY_2], [SPECIALTY_3]
   - Professional photo: headshot, white coat or professional attire
   - License number visible: [LICENSE_#]

3. **About the Practice** (warm, informative):
   - 2-3 paragraphs about philosophy, approach, team size

4. **Services List** (organized by category):
   - Each service with description and cost/insurance info

5. **Patient Testimonials / Success Stories** (3-5 stories):
   - Patient first name + last initial (HIPAA-compliant)
   - Review text and rating

6. **Insurance & Payment Section**:
   - Accepted insurance providers
   - Payment options: Credit card, cash, payment plans

7. **New Patient Process / Patient Intake**:
   - Simple step-by-step process
   - Link to: Download intake form PDF
   - Or: Online intake form (embedded)

8. **Office Tour / Facility Photos** (3-4 images)

9. **Contact & Appointment Booking**:
   - Calendar widget showing available times
   - Phone for urgent
   - Hours table
   - Address with accessibility info

10. **Google Reviews / Rating**:
    - Star rating
    - 3-5 featured reviews visible

11. **Footer**:
    - Contact info, hours, links
    - HIPAA/privacy notice
    - Credentials/licenses listed
```

### Sample Google Reviews for Health & Wellness:
1. "Dr. [NAME] and the team are fantastic! I was nervous about getting dental work done, but they made me feel completely comfortable. The procedure was painless and the office is super clean. Highly recommend!" — Michael T. (5 stars, 2 weeks ago)

2. "I've been working with Dr. [NAME] for 3 months and my back pain is finally gone. Professional, knowledgeable, and genuinely cares about your health. Best investment I made this year." — Patricia G. (5 stars, 1 month ago)

3. "This gym changed my life! The trainers are encouraging, the community is welcoming, and the facilities are top-notch. Been a member for 2 years and can't imagine training anywhere else." — James L. (5 stars, 3 weeks ago)

---

---

# 5. AUTO NICHE

> **Target:** Auto Repair, Detailing, Body Shops, Tire Shops, Dealerships
> 
> **Design Philosophy:** Bold, strong, confidence-focused, transparency-heavy. Customers need to trust their car is in expert hands. Colors should be strong and authoritative with trustworthy elements.

## Color Psychology for Auto
- **Primary:** Strong Navy (#1a3a5a) or Deep Red (#cc0000) — Authority, power, strength
- **Secondary:** Metallic Silver (#c0c0c0) or Charcoal (#36454f) — Professional, mechanical, quality
- **Accent:** Bright Red (#ff0000) or Electric Blue (#0066ff) — Action, CTA, urgency
- **Text:** Charcoal (#2c3e50) — Readable, professional, no-nonsense

---

## MASTER PROMPT: AUTO NICHE SITE GENERATOR

```
You are an expert web designer specializing in automotive service businesses. 
Create a bold, professional website for [BUSINESS_NAME], an [BUSINESS_TYPE] 
in [LOCATION]. This site must build confidence through certifications, pricing transparency, 
and expert credibility.

## SITE STRUCTURE:

1. **Hero Section** (above fold):
   - Headline: "[BUSINESS_NAME] — Expert [SERVICE_TYPE] You Can Trust"
   - Subheading: "ASE Certified Technicians | Transparent Pricing | Warranty on All Work"
   - CTA Button 1 (Primary): "Get a Free Quote" — bright red, large
   - CTA Button 2 (Secondary): "Schedule Service" — outlined
   - Background: High-quality image of technicians working or clean shop interior
   - Trust badge: "ASE Certified", "EPA Registered", "BBB Accredited"

2. **Certifications / Credentials Section** (prominent):
   - ASE (Automotive Service Excellence) certification badges
   - EPA/DEP certifications if relevant
   - BBB/Google ratings badge: [X.X] stars, [X] reviews
   - Years in business: "Serving [AREA] for [X] years"
   - Shop manager/owner name and credentials

3. **Services List** (organized grid or accordion, 6-8 services):
   - Service name, description, typical price range
   - Warranty info visible
   - Estimated time

4. **Pricing Transparency Section**:
   - "Fair, Honest Pricing — No Hidden Fees"
   - Labor rates and parts markup explained

5. **Before/After Gallery** (8-12 project photos):
   - Grid layout showing work quality
   - Each photo labeled with service type and "Before/After"

6. **Google Reviews / Customer Testimonials** (3-5 reviews):
   - 5-star rating, customer first name + initial

7. **Service Request / Quote Form**:
   - Vehicle info, service needed, describe issue
   - Name, phone, email
   - Preferred appointment time

8. **Warranty / Guarantees Section**:
   - Parts warranty details
   - Labor warranty details
   - Road hazard guarantee (if tires)
   - 100% satisfaction guarantee

9. **Location & Hours / Contact**:
   - Map showing location
   - Hours, phone for quotes
   - Service area information

10. **FAQ Section** (5-7 common questions)

11. **Footer**:
    - Contact info, hours, links
    - Certifications/licenses
    - Warranty summary
```

### Sample Google Reviews for Auto:
1. "Took my car to [BUSINESS_NAME] for brake service. The quote was fair, the work was done right, and the shop was clean. Called me with a status update halfway through. Highly recommend!" — David M. (5 stars, 2 weeks ago)

2. "Best detailing job I've ever seen. My 10-year-old car looks brand new. Attention to detail is incredible. Worth every penny. Already booked next appointment!" — Lisa R. (5 stars, 1 week ago)

3. "ASE-certified technicians, honest pricing, no pressure. They explained everything clearly and fixed the problem on the first try. This is my shop now." — Marcus T. (5 stars, 3 weeks ago)

---

---

# 6. BONUS: SPEED BUILD PROMPT

Use this when you have a local business that doesn't fit the 5 niches above, or when you need an emergency website fast.

## MASTER PROMPT: Universal Local Business Website Generator

```
You are an expert web designer. Create a professional, conversion-focused website for 
[BUSINESS_NAME], a [BUSINESS_TYPE] in [LOCATION].

QUICK BUILD - FILL IN ALL [PLACEHOLDERS]:

**Business Type:** [DESCRIBE YOUR BUSINESS in 1 sentence]
Example: "We're a pest control company specializing in residential treatments."

**Primary Goal:** [CALL / EMAIL / FORM SUBMISSION / BOOKING / PURCHASE]

**Unique Selling Point:** [What makes you different? 1-2 sentences]

**Hero Headline:** "[HEADLINE]"

**Hero Subheading:** "[SUBHEADING]"

**CTA Button Text:** "[PRIMARY_ACTION]"

**Services (6 main services):**
1. [SERVICE_NAME] — [1-line description] — $[PRICE_RANGE]
2. [SERVICE_NAME] — [1-line description] — $[PRICE_RANGE]
3. [SERVICE_NAME] — [1-line description] — $[PRICE_RANGE]
4. [SERVICE_NAME] — [1-line description] — $[PRICE_RANGE]
5. [SERVICE_NAME] — [1-line description] — $[PRICE_RANGE]
6. [SERVICE_NAME] — [1-line description] — $[PRICE_RANGE]

**Why Choose Us (3 key differentiators):**
1. [DIFFERENTIATOR_1] — [explanation]
2. [DIFFERENTIATOR_2] — [explanation]
3. [DIFFERENTIATOR_3] — [explanation]

**Contact Information:**
- Phone: [PHONE]
- Email: [EMAIL]
- Address: [ADDRESS]
- Hours: [HOURS_TABLE]

**3 Customer Reviews:**
1. "[NAME]" (5 stars) — "[REVIEW_TEXT]"
2. "[NAME]" (5 stars) — "[REVIEW_TEXT]"
3. "[NAME]" (5 stars) — "[REVIEW_TEXT]"

**Color Preference:**
- Primary: [COLOR_NAME or HEX] OR "Let AI choose professional color"
- Accent: [COLOR_NAME or HEX] OR "Let AI choose complementary color"

**Design Style:**
- "Professional & Trustworthy"
- "Bold & Action-Oriented"
- "Warm & Approachable"
- "Modern & Minimal"

BUILD THIS WEBSITE NOW. 

SITE STRUCTURE:
1. **Hero Section** - Headline, subheading, CTA, background image
2. **Services Grid** (6 boxes) - Name, description, price, icons, hover effects
3. **Why Choose Us** (3 columns) - Differentiators with icons
4. **Customer Reviews** (3 testimonial cards) - Name, 5-star rating, review text
5. **Contact Section** - Phone button, contact form, hours, Google Maps embed
6. **Footer** - Contact info, hours, address, social media links, copyright

BUILD REQUIREMENTS:
- Mobile-first responsive design
- Single-page layout, smooth scrolling
- CTA button always visible (top + floating)
- Fast loading (optimize images)
- Professional design matching industry
- Form validation on contact
- Color scheme: [COLOR_PREFERENCE]
- Design style: [DESIGN_STYLE]

Output complete HTML5 + CSS3 + JavaScript code. Use system fonts for speed.
No framework dependencies — vanilla JavaScript only.
Make it production-ready for copy into Lovable.
```

---

---

# 7. DEPLOYMENT CHECKLIST

Go from Lovable-generated website to live, indexed site.

## Phase 1: BUILD IN LOVABLE (15 minutes)
- [ ] Copy the appropriate master prompt for your niche
- [ ] Fill in all [PLACEHOLDERS] with actual business info
- [ ] Paste into Lovable.dev (lovable.dev/chat)
- [ ] Wait for AI to generate the site preview
- [ ] Review design, layout, responsiveness
- [ ] Test on mobile (scroll, buttons, forms)
- [ ] Use customization prompts to refine colors, services, content
- [ ] Test all buttons, links, forms one more time

## Phase 2: EXPORT FROM LOVABLE (5 minutes)
- [ ] In Lovable, click "Export" or "Download Code"
- [ ] Select "HTML + CSS + JS" (all-in-one export)
- [ ] Save to file: `[business_name]_site.html`
- [ ] Move exported files to: `/Website-Agency/Projects/[BUSINESS_NAME]/site-files/`

## Phase 3: PREPARE FOR DEPLOYMENT (10 minutes)
- [ ] Create Netlify project:
  - Go to netlify.com
  - Click "Deploy" → "Deploy manually"
  - Select exported site folder
  - Choose site name: `[business-name-initials]-sitefactory.netlify.app`

## Phase 4: CONFIGURE CUSTOM DOMAIN (if applicable)
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Access DNS settings
3. Add CNAME record:
   - Name: `[subdomain]` (e.g., `client1-site`)
   - Value: `[netlify-site-name].netlify.app`
4. Wait 15-30 minutes for DNS propagation
5. Test: visit `https://[subdomain].[company_domain].com`

## Phase 5: VERIFY MOBILE RESPONSIVENESS (5 minutes)
- [ ] Visit site on iPhone/iPad (Safari)
- [ ] Visit on Android phone (Chrome)
- [ ] Visit on desktop browsers (Chrome, Firefox, Safari)
- [ ] Test functionality on each device
- [ ] Verify: buttons clickable, text readable, images load fast, no horizontal scroll

## Phase 6: SET UP GOOGLE SEARCH INDEXING (10 minutes)
1. Create/claim Google Business Profile:
   - Go to google.com/business
   - Create or claim business listing
   - Verify ownership
   - Fill in all details: hours, photos, services, reviews

2. Submit site to Google Search Console:
   - Go to search.google.com/search-console
   - Add property: `https://[your-site-url]`
   - Verify ownership
   - Request indexing: "Inspect any URL" → submit for indexing
   - Wait 24-48 hours for indexing

3. Add SEO metadata (if needed):
   - Meta title: `[BUSINESS_NAME] | [SERVICE] in [CITY]`
   - Meta description: `Trusted [SERVICE_TYPE] in [CITY]. [UNIQUE_VALUE]. Call [PHONE].`

4. Link to Google Business Profile in footer

## Phase 7: ADD TO LEAD TRACKER (5 minutes)
- [ ] Open `/Website-Agency/Templates/Lead-Tracker_v1.0.xlsx`
- [ ] Add new row:
  - Client Name: [BUSINESS_NAME]
  - Industry: [NICHE]
  - Website URL: [LIVE_SITE_URL]
  - Subdomain: [SUBDOMAIN_USED]
  - Status: "Live ✓"
  - Launch Date: [TODAY]
  - Plan: [PRICING_TIER]

## Phase 8: SEND TO CLIENT (5 minutes)
- [ ] Email client with:
  - Live site URL (clickable link)
  - QR code linking to site (use qr-server.com)
  - Screenshot of site on desktop + mobile
  - Next steps: "We'll monitor your site and contact form leads weekly"

## Phase 9: ONGOING MAINTENANCE & MONITORING

**Weekly:**
- [ ] Check site loads (visit homepage)
- [ ] Verify contact form submissions arrive
- [ ] Quick visual check for issues

**Monthly:**
- [ ] Review Google Search Console for indexing issues
- [ ] Monitor Google Analytics (if GA added)
- [ ] Track lead inquiries

---

## TROUBLESHOOTING

**"Site shows 404 error"**
- Check Netlify deployment status (should say "Published")
- Verify DNS settings if using custom domain
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**"Contact form doesn't send emails"**
- Lovable forms may need backend (Netlify Functions or Formspree)
- Quick fix: Lovable AI can integrate with Formspree (free tier)
- Ask: "Integrate the contact form with Formspree so emails are sent to [EMAIL]"

**"Site not showing in Google search"**
- Verify site in Google Search Console
- Request indexing manually in GSC
- Check: site has no `noindex` meta tag
- Ensure Google Business Profile is claimed and verified

**"Mobile looks broken"**
- Go back to Lovable
- Use customization prompt: "Fix mobile responsiveness issues on [specific section]"
- Test on actual phone, not just browser DevTools

---

## SUCCESS METRICS (Track in Lead-Tracker)

✓ Site live and indexed in Google (1 week)
✓ Receiving contact form inquiries (2-3 weeks)
✓ Averaging [X] visits/month from organic (30 days)
✓ First lead conversion (goal: 2-4 weeks)

---

— Benjamin Rodriguez
