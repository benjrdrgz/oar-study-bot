const {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  PageBreak,
  AlignmentType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  WidthType,
  PageSize,
} = require('docx');
const fs = require('fs');
const path = require('path');

// Brand colors
const DARK_BLUE = '003366';
const BRIGHT_TEAL = '00A8CC';
const DARK_CHARCOAL = '333333';
const SUCCESS_GREEN = '27AE60';
const LIGHT_GRAY = 'ECEFF1';
const WHITE = 'FFFFFF';

// Placeholder variables (can be customized per client)
const AGENCY_NAME = 'AI Local Website Agency';
const CLIENT_NAME = '[CLIENT_NAME]';
const CLIENT_BUSINESS_NAME = '[YOUR_BUSINESS_NAME]';
const CONTACT_NAME = 'Benjamin Rodriguez';
const CONTACT_EMAIL = 'benjamin@ailocalsites.com';
const CONTACT_PHONE = '(555) 123-4567';

// Helper to create heading
function createHeading(text, level = 1, color = DARK_BLUE) {
  const sizes = { 1: 32, 2: 28, 3: 24 };
  const spacing = { 1: { before: 400, after: 200 }, 2: { before: 300, after: 150 }, 3: { before: 200, after: 100 } };
  
  return new Paragraph({
    text: text,
    alignment: AlignmentType.LEFT,
    spacing: spacing[level],
    run: {
      size: sizes[level] * 2,
      color: color,
      bold: true,
      font: 'Arial',
    },
  });
}

// Helper to create body paragraph
function createBodyParagraph(text, opts = {}) {
  const defaults = {
    size: 11,
    color: DARK_CHARCOAL,
    bold: false,
    spacing: { after: 120 },
    align: AlignmentType.LEFT,
  };
  const options = { ...defaults, ...opts };
  
  return new Paragraph({
    text: text,
    alignment: options.align,
    spacing: options.spacing,
    run: {
      size: options.size * 2,
      color: options.color,
      bold: options.bold,
      font: 'Arial',
    },
  });
}

// Helper to create checkbox list items
function createChecklistItem(text) {
  return new Paragraph({
    text: '☐  ' + text,
    level: 0,
    alignment: AlignmentType.LEFT,
    spacing: { after: 100 },
    run: {
      size: 22,
      color: DARK_CHARCOAL,
      font: 'Arial',
    },
  });
}

// Helper to create bullet list
function createBulletItem(text) {
  return new Paragraph({
    text: text,
    level: 0,
    alignment: AlignmentType.LEFT,
    spacing: { after: 100 },
    run: {
      size: 22,
      color: DARK_CHARCOAL,
      font: 'Arial',
    },
    bullet: {
      level: 0,
    },
  });
}

// Helper to create table
function createTableWithBorders(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
      insideVertical: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
    },
  });
}

// Helper to create table cell
function createTableHeaderCell(text) {
  return new TableCell({
    children: [
      new Paragraph({
        text: text,
        alignment: AlignmentType.CENTER,
        run: {
          bold: true,
          size: 22,
          color: WHITE,
          font: 'Arial',
        },
      }),
    ],
    shading: {
      type: ShadingType.CLEAR,
      color: DARK_BLUE,
    },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
  });
}

// Helper to create table data cell
function createTableDataCell(text, align = AlignmentType.LEFT) {
  return new TableCell({
    children: [
      new Paragraph({
        text: text,
        alignment: align,
        run: {
          size: 20,
          color: DARK_CHARCOAL,
          font: 'Arial',
        },
      }),
    ],
    shading: {
      type: ShadingType.CLEAR,
      color: WHITE,
    },
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
  });
}

// PAGE 1: WELCOME
function createWelcomePage() {
  return [
    // Spacer
    new Paragraph({ text: '', spacing: { after: 400 } }),
    
    // Main heading
    new Paragraph({
      text: `Welcome to ${AGENCY_NAME}!`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      run: {
        size: 36 * 2,
        color: DARK_BLUE,
        bold: true,
        font: 'Arial',
      },
    }),
    
    // Congratulations line
    new Paragraph({
      text: `Congratulations, ${CLIENT_NAME}! Your website journey starts now.`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      run: {
        size: 24 * 2,
        color: BRIGHT_TEAL,
        bold: true,
        font: 'Arial',
      },
    }),
    
    // Thank you paragraph
    new Paragraph({
      text: 'Thank you for choosing us to build your online presence. We're excited to partner with you and get your website live. You've made a smart investment in your business—one that will start bringing you customers right away.',
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    // Timeline section
    createHeading("Here's what happens next — we'll have you live in 24-48 hours.", 2),
    
    new Paragraph({
      text: 'Below, you'll find your onboarding checklist, timeline, and everything you need to know. We've made this as simple as possible because we know you're busy running your business.',
      alignment: AlignmentType.LEFT,
      spacing: { after: 300 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    // Contact section
    createHeading('Your dedicated contact:', 3),
    
    new Paragraph({
      text: `${CONTACT_NAME}`,
      spacing: { after: 80 },
      run: {
        size: 22,
        color: DARK_BLUE,
        bold: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: `Email: ${CONTACT_EMAIL}`,
      spacing: { after: 80 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: `Phone: ${CONTACT_PHONE}`,
      spacing: { after: 200 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: 'Reply to this email or call/text anytime. We're here to help.',
      spacing: { after: 400 },
      run: {
        size: 20,
        color: BRIGHT_TEAL,
        bold: true,
        font: 'Arial',
        italics: true,
      },
    }),
  ];
}

// PAGE 2: ONBOARDING CHECKLIST
function createChecklistPage() {
  return [
    createHeading('Your Onboarding Checklist', 1),
    
    new Paragraph({
      text: 'What we need from you:',
      spacing: { after: 200 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        bold: true,
        font: 'Arial',
      },
    }),
    
    createChecklistItem('Business name (exactly as you want it displayed)'),
    createChecklistItem('Phone number for the website'),
    createChecklistItem('Business address'),
    createChecklistItem('Business hours (Mon–Sun)'),
    createChecklistItem('Email address for contact form'),
    createChecklistItem('Logo file (PNG or SVG preferred, optional)'),
    createChecklistItem('3–5 photos of your business/work (optional — we can use professional stock)'),
    createChecklistItem('List of services you offer (with brief descriptions)'),
    createChecklistItem('Any specific colors or style preferences'),
    createChecklistItem('Preferred domain name (e.g., www.yourbusiness.com)'),
    createChecklistItem('Social media links (if any)'),
    
    new Paragraph({
      text: '',
      spacing: { after: 200 },
    }),
    
    new Paragraph({
      text: "Don't have all of this? No problem!",
      spacing: { after: 100 },
      run: {
        size: 22,
        color: DARK_BLUE,
        bold: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: 'Send us what you have and we'll work with it. We can always add more later. The goal is to get your site live fast—perfection can wait until next week.',
      spacing: { after: 300 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: 'How to submit:',
      spacing: { after: 80 },
      run: {
        size: 22,
        color: DARK_BLUE,
        bold: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: 'Reply to this email with your business information. Attach files directly or paste text. We'll take it from there.',
      spacing: { after: 200 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
  ];
}

// PAGE 3: TIMELINE
function createTimelinePage() {
  return [
    createHeading('Your Timeline', 1),
    
    new Paragraph({
      text: 'Here's exactly what happens and when:',
      spacing: { after: 300 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    // Timeline table
    createTableWithBorders([
      new TableRow({
        children: [
          createTableHeaderCell('Day'),
          createTableHeaderCell('What Happens'),
          createTableHeaderCell('Your Action'),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('Day 1', AlignmentType.CENTER),
          createTableDataCell('We begin customizing your website'),
          createTableDataCell('Send us your business info'),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('Day 2–3', AlignmentType.CENTER),
          createTableDataCell('Your site is built and tested'),
          createTableDataCell('Nothing — we're working!'),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('Day 4', AlignmentType.CENTER),
          createTableDataCell('Preview link sent for your review'),
          createTableDataCell('Review and send feedback'),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('Day 5', AlignmentType.CENTER),
          createTableDataCell('We make any revisions'),
          createTableDataCell('Approve final version'),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('Day 6', AlignmentType.CENTER),
          createTableDataCell('YOUR SITE IS LIVE!', AlignmentType.CENTER),
          createTableDataCell('Celebrate!', AlignmentType.CENTER),
        ],
      }),
    ]),
    
    new Paragraph({
      text: '',
      spacing: { after: 300 },
    }),
    
    new Paragraph({
      text: 'That's it. Six days from submission to go-live. Most of the time it's even faster.',
      spacing: { after: 200 },
      run: {
        size: 22,
        color: BRIGHT_TEAL,
        bold: true,
        font: 'Arial',
      },
    }),
  ];
}

// PAGE 4: WHAT'S INCLUDED
function createIncludedPage() {
  return [
    createHeading("What's Included in Your Plan", 1),
    
    new Paragraph({
      text: 'Your website comes with everything you need to succeed:',
      spacing: { after: 300 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    createBulletItem('Website hosting and maintenance (always online)'),
    createBulletItem('SSL security certificate (always protected)'),
    createBulletItem('Content updates per month (included in your plan)'),
    createBulletItem('Performance monitoring'),
    createBulletItem('Priority email support'),
    createBulletItem('Mobile-friendly design (works on all devices)'),
    createBulletItem('Google-optimized setup'),
    createBulletItem('You own the website forever'),
    
    new Paragraph({
      text: '',
      spacing: { after: 300 },
    }),
    
    new Paragraph({
      text: "What you won't get:",
      spacing: { after: 100 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        bold: true,
        font: 'Arial',
      },
    }),
    
    createBulletItem('Monthly fees or surprise charges'),
    createBulletItem('Long-term contracts or lock-in'),
    createBulletItem('Hidden costs'),
    createBulletItem('Pressure to "upgrade" or add unnecessary features'),
    
    new Paragraph({
      text: '',
      spacing: { after: 300 },
    }),
    
    new Paragraph({
      text: 'What happens after launch?',
      spacing: { after: 100 },
      run: {
        size: 22,
        color: DARK_BLUE,
        bold: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: 'Your website will be yours to keep. You can make updates yourself, ask us to update it for you, or even transfer it to another provider. No contracts. No lock-in. Just your website, forever.',
      spacing: { after: 200 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
  ];
}

// PAGE 5: FAQ
function createFAQPage() {
  return [
    createHeading('Frequently Asked Questions', 1),
    
    createHeading('How do I request changes to my site?', 3),
    new Paragraph({
      text: 'Simply email us or call. Send screenshots, descriptions, or notes about what you'd like changed. We'll update it and send you a preview. Most updates take 1–2 business days.',
      spacing: { after: 250 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    createHeading('What happens if my site goes down?', 3),
    new Paragraph({
      text: 'We monitor your site 24/7. If there's ever an issue, we'll fix it immediately. You'll never have to worry about it—that's our job.',
      spacing: { after: 250 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    createHeading('Can I add more pages later?', 3),
    new Paragraph({
      text: 'Absolutely. You can expand your site whenever you want. Just let us know what you need, and we'll add it.',
      spacing: { after: 250 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    createHeading('How do I cancel?', 3),
    new Paragraph({
      text: 'You can cancel anytime. No questions asked. The website is yours—you keep it forever. If you want us to stop providing updates, just let us know.',
      spacing: { after: 250 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    createHeading('What if I want to move my site?', 3),
    new Paragraph({
      text: 'You own the website. You can move it, redesign it, or hand it off to another provider anytime. We'll provide all files and access you need.',
      spacing: { after: 250 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    createHeading('Do you help with Google Business Profile?', 3),
    new Paragraph({
      text: 'We'll set up your profile and optimize it to work with your website. We'll also help you manage it going forward so customers can find you on Google Maps and Google Search.',
      spacing: { after: 200 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
  ];
}

// PAGE 6: GET STARTED
function createGetStartedPage() {
  return [
    new Paragraph({ text: '', spacing: { after: 400 } }),
    
    createHeading("Let's Get Started", 1),
    
    new Paragraph({
      text: 'Here's all you need to do right now:',
      spacing: { after: 200 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: '1. Look at the Onboarding Checklist on page 2',
      spacing: { after: 100 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        bold: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: '2. Reply to this email with your business information',
      spacing: { after: 100 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        bold: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: '3. We'll confirm receipt and start building immediately',
      spacing: { after: 300 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        bold: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: 'Questions right now?',
      spacing: { after: 100 },
      run: {
        size: 22,
        color: DARK_BLUE,
        bold: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: `Call or text Benjamin at ${CONTACT_PHONE}. We're here to help.`,
      spacing: { after: 400 },
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: `We can't wait to help ${CLIENT_BUSINESS_NAME} grow online!`,
      spacing: { after: 300 },
      run: {
        size: 24,
        color: BRIGHT_TEAL,
        bold: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: '— Benjamin Rodriguez',
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.LEFT,
      run: {
        size: 22,
        color: DARK_CHARCOAL,
        italics: true,
        font: 'Arial',
      },
    }),
    
    new Paragraph({
      text: 'AI Local Website Agency',
      spacing: { after: 0 },
      alignment: AlignmentType.LEFT,
      run: {
        size: 20,
        color: DARK_BLUE,
        bold: true,
        font: 'Arial',
      },
    }),
  ];
}

// Main document generation
function generateDocument() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margins: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          ...createWelcomePage(),
          new PageBreak(),
          ...createChecklistPage(),
          new PageBreak(),
          ...createTimelinePage(),
          new PageBreak(),
          ...createIncludedPage(),
          new PageBreak(),
          ...createFAQPage(),
          new PageBreak(),
          ...createGetStartedPage(),
        ],
      },
    ],
  });

  return doc;
}

// Generate and save the document
async function main() {
  try {
    const doc = generateDocument();
    const outputPath = path.join(
      __dirname,
      '../..',
      'Client-Onboarding',
      'Welcome_Packet_v1.0.docx'
    );

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);

    console.log(`✓ Welcome packet generated successfully!`);
    console.log(`✓ Saved to: ${outputPath}`);
    console.log(`✓ File size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log(`✓ Pages: 6`);
    console.log(`✓ Ready for customization with client details`);
  } catch (error) {
    console.error('Error generating document:', error);
    process.exit(1);
  }
}

main();
