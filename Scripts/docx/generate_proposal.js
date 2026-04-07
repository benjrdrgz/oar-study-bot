const {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  UnorderedList,
  ListItem,
  TextRun,
  PageBreak,
  AlignmentType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  WidthType,
  convertInchesToTwip,
  PageSize,
} = require('docx');
const fs = require('fs');
const path = require('path');

// Color constants
const DARK_BLUE = '1F4788';
const LIGHT_GRAY = 'F5F5F5';
const ACCENT_BLUE = '4A90E2';

// Helper function to create heading
function createHeading(text, level = 1) {
  const sizes = { 1: 28, 2: 24, 3: 20 };
  const colors = { 1: DARK_BLUE, 2: DARK_BLUE, 3: DARK_BLUE };
  return new Paragraph({
    text: text,
    style: `Heading${level}`,
    alignment: AlignmentType.LEFT,
    spacing: { before: level === 1 ? 200 : 300, after: 200 },
    run: {
      size: sizes[level] * 2,
      color: colors[level],
      bold: true,
      font: 'Arial',
    },
  });
}

// Helper to create body paragraph
function createBodyParagraph(text, opts = {}) {
  const defaults = {
    size: 22,
    color: '333333',
    bold: false,
    spacing: { after: 120 },
  };
  const options = { ...defaults, ...opts };
  return new Paragraph({
    text: text,
    alignment: options.align || AlignmentType.LEFT,
    spacing: options.spacing || defaults.spacing,
    run: {
      size: options.size * 2,
      color: options.color,
      bold: options.bold,
      font: 'Arial',
    },
  });
}

// Helper to create bullet list
function createBulletList(items) {
  return items.map(
    (item) =>
      new Paragraph({
        text: item,
        level: 0,
        alignment: AlignmentType.LEFT,
        spacing: { after: 80 },
        run: {
          size: 22,
          color: '333333',
          font: 'Arial',
        },
        bullet: {
          level: 0,
        },
      })
  );
}

// Helper for footer
function createFooter(pageNumber) {
  return new Paragraph({
    text: `Your AI Local Website Agency | (888) 555-0123 | hello@ailocal.com | Page ${pageNumber}`,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    border: {
      top: {
        color: 'CCCCCC',
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    run: {
      size: 18,
      color: '666666',
      font: 'Arial',
      italic: true,
    },
  });
}

// PAGE 1: COVER / INTRO
const page1 = [
  new Paragraph({
    text: '',
    spacing: { before: 400 },
  }),
  new Paragraph({
    text: 'Your New Website is Ready',
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    run: {
      size: 48,
      bold: true,
      color: DARK_BLUE,
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: '— Here's What's Next',
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    run: {
      size: 48,
      bold: true,
      color: DARK_BLUE,
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'A Custom Website Proposal for [BUSINESS_NAME]',
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    run: {
      size: 24,
      color: ACCENT_BLUE,
      font: 'Arial',
      italic: true,
    },
  }),
  new Paragraph({
    text: '',
    spacing: { before: 200 },
  }),
  new Paragraph({
    text: 'Prepared by: Your AI Local Website Agency',
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    run: {
      size: 20,
      color: '666666',
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'Date: March 25, 2026',
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    run: {
      size: 20,
      color: '666666',
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'View Your Preview Site',
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    run: {
      size: 22,
      bold: true,
      color: ACCENT_BLUE,
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: '[DEMO_SITE_URL]',
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    run: {
      size: 20,
      color: ACCENT_BLUE,
      font: 'Arial',
      underline: true,
    },
  }),
  new Paragraph({
    text: '',
    spacing: { before: 200 },
  }),
  new Paragraph({
    text: "We noticed [BUSINESS_NAME] doesn't have a professional online presence. In today's digital-first world, that's leaving money on the table.",
    alignment: AlignmentType.LEFT,
    spacing: { after: 120 },
    run: {
      size: 22,
      color: '333333',
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: "We built a professional, custom website tailored to your business and uploaded it to the web. You can see it by clicking the preview link above. It's fully functional, mobile-friendly, and optimized for Google.",
    alignment: AlignmentType.LEFT,
    spacing: { after: 120 },
    run: {
      size: 22,
      color: '333333',
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'Here's what it takes to go live:',
    alignment: AlignmentType.LEFT,
    spacing: { after: 200 },
    run: {
      size: 22,
      color: '333333',
      font: 'Arial',
      bold: true,
    },
  }),
  ...createBulletList([
    'Choose your service plan (see inside for options)',
    'Sign the simple one-page agreement',
    'We activate your website within 24 hours',
    'Customers start finding you on Google',
  ]),
  new Paragraph({
    text: 'No long-term contracts. No setup hassles. No surprises.',
    alignment: AlignmentType.LEFT,
    spacing: { before: 200, after: 300 },
    run: {
      size: 22,
      color: ACCENT_BLUE,
      bold: true,
      font: 'Arial',
    },
  }),
  createFooter(1),
];

// PAGE 2: WHAT YOU GET
const page2 = [
  new Paragraph({
    text: 'What You Get',
    alignment: AlignmentType.LEFT,
    spacing: { before: 200, after: 300 },
    run: {
      size: 32,
      bold: true,
      color: DARK_BLUE,
      font: 'Arial',
    },
  }),
  ...createBulletList([
    'Professional, custom website — built for your industry',
    'Mobile-responsive design — works perfect on phones & tablets',
    'Fast loading speed — optimized for Google ranking',
    'SSL security certificate — the lock icon customers trust',
    'Professional email setup — [yourname@yourbusiness.com]',
    'Hosting and maintenance — we handle all the technical stuff',
    'Monthly updates as needed — keep your site fresh',
    'Google optimization — customers can find you when they search',
  ]),
  new Paragraph({
    text: 'Why This Matters',
    alignment: AlignmentType.LEFT,
    spacing: { before: 300, after: 200 },
    run: {
      size: 24,
      bold: true,
      color: DARK_BLUE,
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'The numbers tell the story:',
    alignment: AlignmentType.LEFT,
    spacing: { after: 200 },
    run: {
      size: 22,
      color: '333333',
      font: 'Arial',
    },
  }),
  // Stats with icons (represented with check marks)
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        cells: [
          new TableCell({
            children: [
              new Paragraph({
                text: '97%',
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                run: {
                  size: 28,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
              new Paragraph({
                text: 'of consumers search online for local businesses before visiting',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  color: '333333',
                  font: 'Arial',
                },
              }),
            ],
            shading: {
              type: ShadingType.CLEAR,
              color: LIGHT_GRAY,
            },
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
          }),
        ],
      }),
      new TableRow({
        cells: [
          new TableCell({
            children: [
              new Paragraph({
                text: '75%',
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                run: {
                  size: 28,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
              new Paragraph({
                text: 'judge a business's credibility by its website design & professionalism',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  color: '333333',
                  font: 'Arial',
                },
              }),
            ],
            shading: {
              type: ShadingType.CLEAR,
              color: 'FFFFFF',
            },
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
          }),
        ],
      }),
      new TableRow({
        cells: [
          new TableCell({
            children: [
              new Paragraph({
                text: '2-3x',
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                run: {
                  size: 28,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
              new Paragraph({
                text: 'more customer inquiries from businesses with professional websites',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  color: '333333',
                  font: 'Arial',
                },
              }),
            ],
            shading: {
              type: ShadingType.CLEAR,
              color: LIGHT_GRAY,
            },
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
          }),
        ],
      }),
    ],
  }),
  new Paragraph({
    text: 'Your website is not a luxury. It's table stakes.',
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 100 },
    run: {
      size: 22,
      bold: true,
      color: ACCENT_BLUE,
      font: 'Arial',
    },
  }),
  createFooter(2),
];

// PAGE 3: PRICING OPTIONS
const page3 = [
  new Paragraph({
    text: 'Simple Pricing. No Surprises.',
    alignment: AlignmentType.LEFT,
    spacing: { before: 200, after: 300 },
    run: {
      size: 32,
      bold: true,
      color: DARK_BLUE,
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'Choose the plan that fits your business. All include hosting, maintenance, and 24-hour activation.',
    alignment: AlignmentType.LEFT,
    spacing: { after: 300 },
    run: {
      size: 22,
      color: '666666',
      font: 'Arial',
    },
  }),
  // Pricing table
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Header row
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Feature',
                alignment: AlignmentType.LEFT,
                run: {
                  size: 20,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: DARK_BLUE },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'Quick Start',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: DARK_BLUE },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            width: { size: 23, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'Growth',
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                run: {
                  size: 20,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
              new Paragraph({
                text: '★ Most Popular ★',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 16,
                  bold: true,
                  color: 'FFD700',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            width: { size: 23, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'Dominate',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: DARK_BLUE },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            width: { size: 24, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      // Setup fee
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Setup Fee',
                alignment: AlignmentType.LEFT,
                run: {
                  size: 20,
                  bold: true,
                  color: '333333',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '$997',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: '333333',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '$1,997',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '$3,497',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: '333333',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // Monthly
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Monthly Fee',
                alignment: AlignmentType.LEFT,
                run: {
                  size: 20,
                  bold: true,
                  color: '333333',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '$149/mo',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: '333333',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '$249/mo',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '$397/mo',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: '333333',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // Professional website
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Professional Website',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // Mobile optimized
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Mobile Optimized',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // SSL Certificate
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'SSL Certificate (Secure)',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // Hosting & maintenance
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Hosting & Maintenance',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // Monthly updates
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Monthly Updates',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '1',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '3',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'Unlimited',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // Google business setup
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Google Business Setup',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '—',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'CCCCCC',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // Directory listings
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Directory Listings',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '—',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'CCCCCC',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '3',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '10+',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // SEO package
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'SEO Package',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'Basic',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'Standard',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'Premium',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 20,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // Review management
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Review Management',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '—',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'CCCCCC',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '—',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'CCCCCC',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
      // Priority support
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'Priority Support',
                alignment: AlignmentType.LEFT,
                run: { size: 20, color: '333333', font: 'Arial' },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '—',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'CCCCCC',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '—',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: 'CCCCCC',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '✓',
                alignment: AlignmentType.CENTER,
                run: {
                  size: 24,
                  bold: true,
                  color: ACCENT_BLUE,
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
          }),
        ],
      }),
    ],
  }),
  new Paragraph({
    text: 'All plans include your own custom domain name and professional email.',
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    run: {
      size: 20,
      color: '666666',
      font: 'Arial',
      italic: true,
    },
  }),
  createFooter(3),
];

// PAGE 4: NEXT STEPS & GUARANTEE
const page4 = [
  new Paragraph({
    text: 'Getting Started is Simple',
    alignment: AlignmentType.LEFT,
    spacing: { before: 200, after: 300 },
    run: {
      size: 32,
      bold: true,
      color: DARK_BLUE,
      font: 'Arial',
    },
  }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: '1',
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                run: {
                  size: 32,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            width: { size: 15, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'Choose Your Plan',
                alignment: AlignmentType.LEFT,
                spacing: { after: 60 },
                run: {
                  size: 22,
                  bold: true,
                  color: DARK_BLUE,
                  font: 'Arial',
                },
              }),
              new Paragraph({
                text: 'Pick the tier that fits your business and budget.',
                alignment: AlignmentType.LEFT,
                run: {
                  size: 20,
                  color: '666666',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            width: { size: 85, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: '2',
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                run: {
                  size: 32,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            width: { size: 15, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'We Go Live in 24 Hours',
                alignment: AlignmentType.LEFT,
                spacing: { after: 60 },
                run: {
                  size: 22,
                  bold: true,
                  color: DARK_BLUE,
                  font: 'Arial',
                },
              }),
              new Paragraph({
                text: 'Sign the agreement and we activate your site immediately.',
                alignment: AlignmentType.LEFT,
                run: {
                  size: 20,
                  color: '666666',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: 'FFFFFF' },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            width: { size: 85, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: '3',
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                run: {
                  size: 32,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: ACCENT_BLUE },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            width: { size: 15, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: 'Start Getting Found on Google',
                alignment: AlignmentType.LEFT,
                spacing: { after: 60 },
                run: {
                  size: 22,
                  bold: true,
                  color: DARK_BLUE,
                  font: 'Arial',
                },
              }),
              new Paragraph({
                text: 'Customers find you when they search. Inquiries start coming in.',
                alignment: AlignmentType.LEFT,
                run: {
                  size: 20,
                  color: '666666',
                  font: 'Arial',
                },
              }),
            ],
            shading: { type: ShadingType.CLEAR, color: LIGHT_GRAY },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            width: { size: 85, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
    ],
  }),
  new Paragraph({
    text: 'Our Guarantee',
    alignment: AlignmentType.LEFT,
    spacing: { before: 300, after: 200 },
    run: {
      size: 24,
      bold: true,
      color: DARK_BLUE,
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'If you're not thrilled with your website within 30 days, we'll rebuild it from scratch at no additional cost. No questions asked.',
    alignment: AlignmentType.LEFT,
    spacing: {
      before: 100,
      after: 100,
      line: 360,
    },
    border: {
      left: {
        color: ACCENT_BLUE,
        space: 24,
        style: BorderStyle.SINGLE,
        size: 12,
      },
    },
    indent: {
      left: 400,
    },
    run: {
      size: 22,
      color: DARK_BLUE,
      bold: true,
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'Ready to go live?',
    alignment: AlignmentType.LEFT,
    spacing: { before: 300, after: 150 },
    run: {
      size: 24,
      bold: true,
      color: '333333',
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'Reply to this email or call us at (888) 555-0123 to get started.',
    alignment: AlignmentType.LEFT,
    spacing: { after: 300 },
    run: {
      size: 22,
      color: '333333',
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'Looking forward to building your web presence.',
    alignment: AlignmentType.LEFT,
    spacing: { before: 200, after: 100 },
    run: {
      size: 22,
      color: '666666',
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: '— Benjamin Rodriguez',
    alignment: AlignmentType.LEFT,
    spacing: { after: 100 },
    run: {
      size: 22,
      bold: true,
      color: DARK_BLUE,
      font: 'Arial',
    },
  }),
  new Paragraph({
    text: 'Chief, Your AI Local Website Agency',
    alignment: AlignmentType.LEFT,
    spacing: { after: 400 },
    run: {
      size: 20,
      color: '666666',
      font: 'Arial',
      italic: true,
    },
  }),
  createFooter(4),
];

// Create document
const doc = new Document({
  sections: [
    {
      properties: {},
      children: [...page1, new PageBreak(), ...page2, new PageBreak(), ...page3, new PageBreak(), ...page4],
    },
  ],
});

// Output path
const outputPath = '/sessions/peaceful-jolly-ritchie/mnt/Website Agency/Templates/Proposals/Client_Proposal_v1.0.docx';

// Ensure directory exists
const dir = require('path').dirname(outputPath);
if (!require('fs').existsSync(dir)) {
  require('fs').mkdirSync(dir, { recursive: true });
}

// Generate file
Packer.toFile(doc, outputPath).then(() => {
  console.log(`✓ Document created successfully: ${outputPath}`);
  console.log(`✓ File size: ${require('fs').statSync(outputPath).size} bytes`);
});
