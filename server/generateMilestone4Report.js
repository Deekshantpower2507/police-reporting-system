const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream('../Milestone_4_Report.pdf'));

// Title
doc.fontSize(24).font('Helvetica-Bold').text('Milestone 4 Report', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(14).font('Helvetica').text('Police Reporting System - Advanced Features', { align: 'center' });
doc.moveDown(2);

// Introduction
doc.fontSize(12).text('This report outlines the technical implementation and features completed for Milestone 4, focusing heavily on real-time data visualization and interactive systems.', { align: 'left' });
doc.moveDown(1.5);

const features = [
  {
    title: '1. Live Geographical Tracking System',
    details: [
      'Successfully engineered an interactive, open-source mapping system directly into the Citizen Tracking portal.',
      'Integrated Leaflet and react-leaflet to render high-performance geographical tiles using OpenStreetMap data.',
      'Configured custom map markers, including a bespoke Police unit icon and Incident Location pins.'
    ]
  },
  {
    title: '2. Real-Time Movement Simulation Engine',
    details: [
      'Developed a React useEffect-based interval engine that visually simulates a police patrol car moving toward an active incident.',
      'Implemented a mathematical interpolation algorithm that smoothly updates the police coordinates every 3 seconds, mimicking real driving approaches.',
      'Added dynamic rendering logic so the police car only appears if the investigation status is actively "Assigned" or "Under Investigation".'
    ]
  },
  {
    title: '3. Deterministic Coordinate Hashing',
    details: [
      'Created an algorithmic string-hashing function that converts the alphanumeric Complaint Tracking ID into a deterministic set of latitude and longitude coordinates.',
      'Ensures that tracking the same complaint repeatedly will always yield the exact same physical map location without requiring external geocoding API keys.'
    ]
  },
  {
    title: '4. Live ETA & UI Enhancements',
    details: [
      'Built a live pulsing Estimated Time of Arrival (ETA) countdown that decreases alongside the physical movement of the police unit on the map.',
      'Wrapped the entire tracking interface in a responsive, modern container that seamlessly integrates with the project\'s existing Cyberpunk/Bento grid aesthetic.'
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
doc.fontSize(10).font('Helvetica-Oblique').text('Generated for Milestone 4 Academic Submission', { align: 'center', color: 'gray' });

doc.end();
console.log('Milestone 4 PDF Generated Successfully!');
