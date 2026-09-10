const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream('../Project_Updates_Report.pdf'));

// Title
doc.fontSize(24).font('Helvetica-Bold').text('Project Updates & Bug Fixes Report', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(14).font('Helvetica').text('Police Reporting System - Macro Project', { align: 'center' });
doc.moveDown(2);

// Introduction
doc.fontSize(12).text('The following is a comprehensive summary of the recent feature additions, UI enhancements, and bug fixes integrated into the system:', { align: 'left' });
doc.moveDown(1.5);

const features = [
  {
    title: '1. Missing Persons & Public Bulletins Board',
    details: [
      'Built a fully functional public Bulletins board for citizens to view alerts.',
      'Designed a modern Cyberpunk/Bento grid UI for the display.',
      'Created the ManageBulletins interface for Admins to add, edit, and delete bulletins, with proper JWT authorization headers.'
    ]
  },
  {
    title: '2. Backend File Upload Fixes',
    details: [
      'Overhauled the Multer middleware to remove strict 5MB file size limits and file extension restrictions.',
      'Resolved a critical issue where the server silently threw 500 Errors when users uploaded high-res smartphone photos (like .HEIC or .webp) as evidence.'
    ]
  },
  {
    title: '3. Data Seeding & Database Integrity',
    details: [
      'Safely injected mock data (12 police officers and specific citizen records) directly into the SQLite database.',
      'Utilized custom backend scripts to bypass ORM syncs, preventing the accidental dropping of existing tables.'
    ]
  },
  {
    title: '4. Advanced Form Validation & Constraints',
    details: [
      'Added strict validation to the Log Incident form to prevent users from selecting futuristic dates.',
      'Implemented dynamic time blocking that restricts future time selection if the current day is selected.'
    ]
  },
  {
    title: '5. Complaint Details & Tracking Improvements',
    details: [
      'Fixed UI logic to properly display the selected Police Station and Assigned Officer details.',
      'Added missing Email and Address inputs for Victims, and Contact Information inputs for Suspects.',
      'Updated styles to ensure vital information is rendered in high-contrast bold black text for better readability.'
    ]
  },
  {
    title: '6. UI & Aesthetic Upgrades',
    details: [
      'Added a massive, blurred "POLICE" watermark behind the landing page for an enhanced cyberpunk aesthetic.',
      'Fixed invisible text issues on the Admin Dashboard quick links by enforcing high contrast text classes.'
    ]
  },
  {
    title: '7. System Logic Fixes',
    details: [
      'Fixed the "Download PDF" button by migrating the useReactToPrint hook to its v3 syntax.',
      'Fixed a backend bug in adminController where Admins assigning an officer did not properly generate a StatusHistory log, effectively fixing the citizen tracking timeline.'
    ]
  }
];

features.forEach(feature => {
  doc.fontSize(14).font('Helvetica-Bold').text(feature.title);
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica');
  
  feature.details.forEach(detail => {
    doc.text(`• ${detail}`, { indent: 20 });
  });
  
  doc.moveDown(1);
});

// Footer
doc.moveDown(2);
doc.fontSize(10).font('Helvetica-Oblique').text('Generated for Semester Project Submission', { align: 'center', color: 'gray' });

doc.end();
console.log('PDF Generated Successfully!');
