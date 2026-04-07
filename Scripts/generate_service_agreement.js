#!/usr/bin/env node

const { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, BorderStyle, WidthType, UnderlineType, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

// Output path
const outputDir = path.join(__dirname, '../Templates/Contracts');
const outputPath = path.join(outputDir, 'Service_Agreement_v1.0.docx');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper function to create a standard heading
function createHeading(text, level = 1) {
  return new Paragraph({
    text: text,
    heading: level === 1 ? HeadingLevel.Heading1 : level === 2 ? HeadingLevel.Heading2 : HeadingLevel.Heading3,
    spacing: { before: level === 1 ? 240 : 120, after: 120 },
    thematicBreak: false,
  });
}

// Helper function for body text
function createParagraph(text, indent = 0, isBold = false, isItalic = false) {
  return new Paragraph({
    text: text,
    spacing: { line: 360, lineRule: 'auto' },
    indent: { left: indent * 720 },
    run: {
      font: 'Arial',
      size: 22,
      bold: isBold,
      italics: isItalic,
    },
  });
}

// Helper function for numbered items
function createNumberedItem(number, text) {
  return new Paragraph({
    text: `${number}.  ${text}`,
    spacing: { line: 300, lineRule: 'auto' },
    indent: { left: 720 },
    hangingIndent: 720,
  });
}

// Helper function for bulleted items
function createBulletItem(text) {
  return new Paragraph({
    text: text,
    spacing: { line: 300, lineRule: 'auto' },
    indent: { left: 720 },
    hangingIndent: 360,
    bullet: { level: 0 },
  });
}

// Create the service tiers table
function createServiceTiersTable() {
  const tableBorders = {
    top: { style: BorderStyle.Single, size: 6, color: '000000' },
    bottom: { style: BorderStyle.Single, size: 6, color: '000000' },
    left: { style: BorderStyle.Single, size: 6, color: '000000' },
    right: { style: BorderStyle.Single, size: 6, color: '000000' },
    insideHorizontal: { style: BorderStyle.Single, size: 6, color: '000000' },
    insideVertical: { style: BorderStyle.Single, size: 6, color: '000000' },
  };

  const headerCell = (text) => new TableCell({
    children: [
      new Paragraph({
        text: text,
        bold: true,
        alignment: AlignmentType.CENTER,
        spacing: { line: 240 },
      }),
    ],
    shading: { fill: 'D3D3D3' },
    width: { value: 25, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
  });

  const dataCell = (text) => new TableCell({
    children: [
      new Paragraph({
        text: text,
        spacing: { line: 240 },
      }),
    ],
    width: { value: 25, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          headerCell('Feature'),
          headerCell('Quick Start\n($997 + $149/mo)'),
          headerCell('Growth\n($1,997 + $249/mo)'),
          headerCell('Dominate\n($3,497 + $397/mo)'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Professional Website'),
          dataCell('5-page\nsingle-page'),
          dataCell('5-10 page\nmulti-page'),
          dataCell('Unlimited pages'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Mobile Optimization'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Hosting & Maintenance'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('SSL Certificate'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Basic SEO Setup'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Revision Rounds'),
          dataCell('1 round'),
          dataCell('3 rounds'),
          dataCell('Unlimited'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Google Business Profile Opt.'),
          dataCell('—'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Directory Listings'),
          dataCell('—'),
          dataCell('3 listings'),
          dataCell('10+ listings'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Monthly Content Update'),
          dataCell('—'),
          dataCell('✓ Included'),
          dataCell('✓ Included'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Analytics Dashboard'),
          dataCell('—'),
          dataCell('Basic'),
          dataCell('Full'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Review Management'),
          dataCell('—'),
          dataCell('—'),
          dataCell('✓ Automated'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Monthly Performance Report'),
          dataCell('—'),
          dataCell('—'),
          dataCell('✓ Included'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Priority Support'),
          dataCell('—'),
          dataCell('—'),
          dataCell('✓ Included'),
        ],
      }),
    ],
  });
}

// Build the document
const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          margins: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      footers: {
        default: new require('docx').Footer({
          children: [
            new Paragraph({
              text: 'Page ',
              run: {
                break: false,
              },
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  children: ['Page ', require('docx').PageNumber],
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Header/Title
        new Paragraph({
          text: '[AGENCY_NAME] — Website Services Agreement',
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 240 },
          run: {
            font: 'Arial',
            size: 28,
            bold: true,
          },
        }),

        new Paragraph({
          text: '',
          spacing: { after: 120 },
        }),

        // Section 1: Parties
        createHeading('Section 1: Parties to this Agreement', 1),

        createParagraph('This Service Agreement ("Agreement") is entered into as of [DATE] (the "Effective Date") between:'),

        createBulletItem(
          'SERVICE PROVIDER: [AGENCY_NAME], operated by Benjamin Rodriguez, a web design and development agency ("Agency")'
        ),

        createBulletItem(
          'CLIENT: [CLIENT_NAME], operating as [CLIENT_BUSINESS_NAME] ("Client")'
        ),

        new Paragraph({
          text: 'The Agency and Client are collectively referred to herein as "the Parties."',
          spacing: { line: 300, lineRule: 'auto', before: 120, after: 240 },
        }),

        // Section 2: Services
        createHeading('Section 2: Scope of Services', 1),

        createParagraph(
          'The Agency agrees to provide the following website design and development services (the "Services"):'
        ),

        createNumberedItem('2.1', 'Website Design & Development — Professional website design and development using modern, responsive technologies'),

        createNumberedItem('2.2', 'Responsive Mobile Optimization — All websites optimized for mobile devices, tablets, and desktop screens'),

        createNumberedItem('2.3', 'Hosting & Maintenance — Unlimited hosting, security updates, and ongoing maintenance'),

        createNumberedItem('2.4', 'SSL Certificate — Included SSL/TLS encryption for secure data transmission'),

        createNumberedItem('2.5', 'Basic SEO Setup — Initial on-page SEO optimization including meta tags, structured data, and search engine submission'),

        createNumberedItem('2.6', 'Client Revisions — The selected Service Tier includes the specified number of revision rounds'),

        new Paragraph({
          text: 'Additional services, add-ons, and custom development are available at the Agency\'s current rates upon mutual written agreement.',
          spacing: { line: 300, lineRule: 'auto', before: 120, after: 240 },
        }),

        // Section 3: Service Tiers
        createHeading('Section 3: Service Tiers & Pricing', 1),

        createParagraph('The Client shall select one of the following Service Tiers:'),

        new Paragraph({
          text: '',
          spacing: { after: 120 },
        }),

        createServiceTiersTable(),

        new Paragraph({
          text: '',
          spacing: { after: 240 },
        }),

        // Section 4: Payment Terms
        createHeading('Section 4: Payment Terms & Conditions', 1),

        createNumberedItem(
          '4.1',
          'Setup Fee — The applicable Setup Fee (per selected Tier) is due in full upon execution of this Agreement. Work shall not commence until payment is received.'
        ),

        createNumberedItem(
          '4.2',
          'Monthly Service Fee — The Monthly Service Fee (per selected Tier) shall be billed on the [BILLING_DAY]th day of each month. The first month\'s service fee is due within 30 days of invoice.'
        ),

        createNumberedItem('4.3', 'Payment Methods — The Agency accepts payment via: (a) Credit Card (Visa, Mastercard, American Express); (b) ACH Bank Transfer; (c) PayPal; (d) Other agreed methods'),

        createNumberedItem(
          '4.4',
          'Late Payment Penalties — Invoices are due net 15 days. If payment is not received within 15 days of invoice date, a late fee of 1.5% per month (18% annually) shall accrue on the outstanding balance.'
        ),

        createNumberedItem(
          '4.5',
          'Suspension of Services — If payment is 30 days overdue, the Agency reserves the right to suspend all services, including hosting and maintenance, until payment is received in full.'
        ),

        new Paragraph({
          text: 'All fees are exclusive of applicable sales taxes, which shall be added to invoices if required by law.',
          spacing: { line: 300, lineRule: 'auto', before: 120, after: 240 },
        }),

        // Section 5: Timeline & Deliverables
        createHeading('Section 5: Project Timeline & Deliverables', 1),

        createNumberedItem(
          '5.1',
          'Website Draft — The Agency shall deliver an initial website draft within 5 (five) business days of receipt of all required Client information and assets.'
        ),

        createNumberedItem(
          '5.2',
          'Client Review Period — The Client shall have 7 (seven) business days to review the website draft and provide feedback.'
        ),

        createNumberedItem(
          '5.3',
          'Revisions — The Agency shall complete requested revisions within 3 (three) business days of receipt of Client feedback, subject to the revision limits of the selected Tier.'
        ),

        createNumberedItem(
          '5.4',
          'Go-Live — Upon final Client approval, the website shall go live and be accessible at the Client\'s domain within 24 (twenty-four) hours.'
        ),

        new Paragraph({
          text: 'Timelines begin upon Client\'s delivery of all necessary information, content, images, and assets. Client-caused delays extend all timelines accordingly.',
          spacing: { line: 300, lineRule: 'auto', before: 120, after: 240 },
        }),

        // Section 6: Client Responsibilities
        createHeading('Section 6: Client Responsibilities', 1),

        createParagraph('The Client agrees to:'),

        createNumberedItem(
          '6.1',
          'Provide Required Information — Deliver all business information, logos, product/service descriptions, photos, and content within 5 (five) business days of the Effective Date.'
        ),

        createNumberedItem(
          '6.2',
          'Timely Feedback — Respond to revision requests and feedback requests within 7 (seven) business days.'
        ),

        createNumberedItem(
          '6.3',
          'Accurate Information — Confirm that all information, images, and content provided are accurate, original, or properly licensed.'
        ),

        createNumberedItem(
          '6.4',
          'Domain & Hosting Setup — Provide domain access and authorize DNS configuration as required to deploy the website.'
        ),

        new Paragraph({
          text: 'Failure to provide required information or respond to requests shall delay the project timeline proportionately.',
          spacing: { line: 300, lineRule: 'auto', before: 120, after: 240 },
        }),

        // Section 7: Intellectual Property
        createHeading('Section 7: Intellectual Property & Ownership', 1),

        createNumberedItem(
          '7.1',
          'Agency Ownership — During the active Service subscription term, the website design, layout, code, and functionality remain the property of [AGENCY_NAME]. The Agency retains the right to showcase the work in its portfolio and case studies.'
        ),

        createNumberedItem(
          '7.2',
          'Client Content Ownership — All text, images, logos, and content provided by the Client remain the exclusive property of the Client.'
        ),

        createNumberedItem(
          '7.3',
          'Ownership Transfer — Upon Client request and payment of a one-time $497 ownership transfer fee, the Agency shall transfer full ownership of the website code and design to the Client.'
        ),

        createNumberedItem(
          '7.4',
          'License Upon Termination — If the Service Agreement terminates without ownership transfer, the Client receives a non-exclusive license to use the published website during the subscription term only.'
        ),

        new Paragraph({
          text: '',
          spacing: { after: 240 },
        }),

        // Section 8: Term & Termination
        createHeading('Section 8: Term & Termination', 1),

        createNumberedItem(
          '8.1',
          'Initial Term — This Agreement shall commence on the Effective Date and continue for a minimum of 3 (three) months (the "Initial Term").'
        ),

        createNumberedItem(
          '8.2',
          'Month-to-Month — Following the Initial Term, this Agreement shall automatically renew on a month-to-month basis unless either Party provides written notice of termination.'
        ),

        createNumberedItem(
          '8.3',
          'Termination Notice — Either Party may terminate this Agreement with 30 (thirty) days\' written notice. The Client remains responsible for all fees during the notice period.'
        ),

        createNumberedItem(
          '8.4',
          'Refund Policy — Setup fees are non-refundable after work commences. Monthly service fees are non-refundable but can be credited toward future months if the Client provides 30 days\' notice.'
        ),

        createNumberedItem(
          '8.5',
          'Effect of Termination — Upon termination, the Agency shall: (a) cease all services; (b) remove the website from Agency-controlled hosting if ownership was not transferred; (c) provide a copy of the website code if ownership was transferred.'
        ),

        new Paragraph({
          text: '',
          spacing: { after: 240 },
        }),

        // Section 9: Limitation of Liability
        createHeading('Section 9: Limitation of Liability & Indemnification', 1),

        createNumberedItem(
          '9.1',
          'Liability Cap — In no event shall either Party\'s total liability exceed the fees paid by the Client in the 3 (three) months preceding the claim.'
        ),

        createNumberedItem(
          '9.2',
          'Third-Party Services — The Agency is not liable for outages, downtime, or failures of third-party services including but not limited to: domain registrars, DNS providers, hosting providers, payment processors, or email services.'
        ),

        createNumberedItem(
          '9.3',
          'Indemnification — The Client indemnifies the Agency from any claims that Client-provided content infringes third-party intellectual property rights.'
        ),

        createNumberedItem(
          '9.4',
          'No Consequential Damages — Neither Party shall be liable for indirect, incidental, consequential, special, or punitive damages.'
        ),

        new Paragraph({
          text: '',
          spacing: { after: 240 },
        }),

        // Section 10: Miscellaneous
        createHeading('Section 10: Miscellaneous Provisions', 1),

        createNumberedItem(
          '10.1',
          'Governing Law — This Agreement shall be governed by and construed in accordance with the laws of [STATE], without regard to its conflict of law principles.'
        ),

        createNumberedItem(
          '10.2',
          'Entire Agreement — This Agreement constitutes the entire agreement between the Parties and supersedes all prior negotiations, understandings, and agreements, whether written or oral.'
        ),

        createNumberedItem(
          '10.3',
          'Amendments — No amendment, modification, or waiver of any provision of this Agreement shall be effective unless in writing and signed by both Parties.'
        ),

        createNumberedItem(
          '10.4',
          'Severability — If any provision of this Agreement is found to be invalid or unenforceable, such provision shall be modified to the minimum extent necessary to make it enforceable, and the remainder of the Agreement shall remain in effect.'
        ),

        createNumberedItem(
          '10.5',
          'Contact Information — All notices required under this Agreement shall be sent to the addresses provided by each Party in writing.'
        ),

        new Paragraph({
          text: '',
          spacing: { after: 360 },
        }),

        // Signature Block
        createHeading('Signatures & Acceptance', 1),

        new Paragraph({
          text: 'By signing below, both Parties acknowledge that they have read, understood, and agree to be bound by the terms of this Service Agreement.',
          spacing: { before: 120, after: 360 },
        }),

        // Agency Signature
        new Paragraph({
          text: 'SERVICE PROVIDER:',
          spacing: { after: 120 },
          run: { bold: true },
        }),

        new Paragraph({
          text: '',
          spacing: { after: 360 },
        }),

        new Paragraph({
          text: '_________________________________________________',
          spacing: { after: 120 },
        }),

        new Paragraph({
          text: '[AGENCY_NAME]',
          spacing: { after: 120 },
        }),

        new Paragraph({
          text: 'Authorized Representative: Benjamin Rodriguez',
          spacing: { after: 120 },
        }),

        new Paragraph({
          text: 'Date: _____________________',
          spacing: { after: 360 },
        }),

        // Client Signature
        new Paragraph({
          text: 'CLIENT:',
          spacing: { after: 120 },
          run: { bold: true },
        }),

        new Paragraph({
          text: '',
          spacing: { after: 360 },
        }),

        new Paragraph({
          text: '_________________________________________________',
          spacing: { after: 120 },
        }),

        new Paragraph({
          text: 'Client Name (Print): _________________________________',
          spacing: { after: 120 },
        }),

        new Paragraph({
          text: 'Business Name (Print): _______________________________',
          spacing: { after: 120 },
        }),

        new Paragraph({
          text: 'Title/Role: __________________________________________',
          spacing: { after: 120 },
        }),

        new Paragraph({
          text: 'Date: _____________________',
          spacing: { after: 240 },
        }),

        // Footer signature
        new Paragraph({
          text: '',
          spacing: { after: 120 },
        }),

        new Paragraph({
          text: '— Benjamin Rodriguez',
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 0 },
          run: { italics: true, size: 22 },
        }),
      ],
    },
  ],
});

// Generate the document
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Service Agreement contract generated successfully`);
  console.log(`✓ Saved to: ${outputPath}`);
  console.log(`✓ File size: ${(buffer.length / 1024).toFixed(2)} KB`);
  process.exit(0);
});
