const PDFDocument = require('pdfkit');

function buildPDFReport(analysis, result, evidenceList, res) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Stream directly to response
  doc.pipe(res);

  // Header / Branding
  doc.rect(0, 0, doc.page.width, 60).fill('#0f172a');
  doc.fillColor('#38bdf8').fontSize(20).font('Helvetica-Bold').text('RCA AGENT', 40, 20);
  doc.fillColor('#94a3b8').fontSize(10).font('Helvetica').text('Root Cause Analysis Report', 165, 27);

  doc.moveDown(3);
  doc.fillColor('#0f172a');

  // Title
  doc.fontSize(16).font('Helvetica-Bold').text(analysis.title, 40, 80);
  doc.fontSize(9).font('Helvetica').fillColor('#64748b')
    .text(`Generated on: ${new Date().toLocaleString()} | Category: ${analysis.category} | Severity: ${analysis.severity} | Status: ${analysis.status}`, 40, 102);

  let currentY = 125;

  // Horizontal divider
  doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(40, currentY).lineTo(doc.page.width - 40, currentY).stroke();
  currentY += 15;

  // 1. Executive Problem Summary
  doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('1. Incident & Problem Summary', 40, currentY);
  currentY += 16;
  doc.fillColor('#334155').fontSize(10).font('Helvetica').text(result.problemSummary || analysis.description, 40, currentY, { width: 515 });
  currentY = doc.y + 15;

  // 2. Identified Symptoms
  if (result.identifiedSymptoms && result.identifiedSymptoms.length > 0) {
    doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('2. Identified Symptoms & Evidence', 40, currentY);
    currentY += 16;
    result.identifiedSymptoms.forEach(sym => {
      doc.fillColor('#475569').fontSize(9).font('Helvetica').text(`•  ${sym}`, 50, currentY, { width: 505 });
      currentY = doc.y + 4;
    });
    currentY += 10;
  }

  // Check page height
  if (currentY > 680) {
    doc.addPage();
    currentY = 40;
  }

  // 3. Ranked Possible Causes
  doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('3. Ranked Possible Root Causes', 40, currentY);
  currentY += 16;

  (result.possibleCauses || []).forEach((c, idx) => {
    if (currentY > 700) {
      doc.addPage();
      currentY = 40;
    }
    doc.rect(40, currentY, 515, 45).fillAndStroke('#f8fafc', '#cbd5e1');
    doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold').text(`${idx + 1}. ${c.cause}`, 48, currentY + 6);
    doc.fillColor('#2563eb').fontSize(10).font('Helvetica-Bold').text(`${c.confidence}% Confidence`, 460, currentY + 6);
    doc.fillColor('#475569').fontSize(9).font('Helvetica').text(c.description || '', 48, currentY + 22, { width: 495 });
    currentY += 52;
  });
  currentY += 10;

  // Check page height
  if (currentY > 620) {
    doc.addPage();
    currentY = 40;
  }

  // 4. Five Whys Analysis
  doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('4. Five Whys Methodology Chain', 40, currentY);
  currentY += 16;

  (result.fiveWhys || []).forEach(w => {
    if (currentY > 700) {
      doc.addPage();
      currentY = 40;
    }
    doc.fillColor('#0284c7').fontSize(9).font('Helvetica-Bold').text(`Why ${w.step}: ${w.question}`, 45, currentY, { width: 510 });
    currentY = doc.y + 2;
    doc.fillColor('#1e293b').fontSize(9).font('Helvetica').text(`Answer: ${w.answer}`, 55, currentY, { width: 500 });
    currentY = doc.y + 6;
  });
  currentY += 10;

  if (currentY > 640) {
    doc.addPage();
    currentY = 40;
  }

  // 5. Final Assessment & Root Cause
  doc.rect(40, currentY, 515, 40).fillAndStroke('#ecfdf5', '#a7f3d0');
  doc.fillColor('#065f46').fontSize(10).font('Helvetica-Bold').text('Confirmed Root Cause Assessment:', 48, currentY + 8);
  doc.fillColor('#047857').fontSize(9).font('Helvetica').text(result.finalRootCause || result.mostLikelyCause, 48, currentY + 22, { width: 495 });
  currentY += 50;

  // 6. Recommendations
  if (currentY > 650) {
    doc.addPage();
    currentY = 40;
  }

  doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('5. Corrective & Preventive Action Plan', 40, currentY);
  currentY += 16;

  const recs = result.recommendations || {};

  doc.fillColor('#b91c1c').fontSize(10).font('Helvetica-Bold').text('Immediate Mitigation (0 - 2 Hours):', 45, currentY);
  currentY += 14;
  (recs.immediate || ['Inspect live server logs']).forEach(item => {
    doc.fillColor('#334155').fontSize(9).font('Helvetica').text(`• ${item}`, 55, currentY, { width: 500 });
    currentY = doc.y + 3;
  });

  currentY += 6;
  doc.fillColor('#d97706').fontSize(10).font('Helvetica-Bold').text('Short-Term Actions (1 - 3 Days):', 45, currentY);
  currentY += 14;
  (recs.shortTerm || ['Implement fixes']).forEach(item => {
    doc.fillColor('#334155').fontSize(9).font('Helvetica').text(`• ${item}`, 55, currentY, { width: 500 });
    currentY = doc.y + 3;
  });

  currentY += 6;
  doc.fillColor('#047857').fontSize(10).font('Helvetica-Bold').text('Long-Term Preventive Measures:', 45, currentY);
  currentY += 14;
  (recs.longTerm || ['Add monitoring']).forEach(item => {
    doc.fillColor('#334155').fontSize(9).font('Helvetica').text(`• ${item}`, 55, currentY, { width: 500 });
    currentY = doc.y + 3;
  });

  // Footer on all pages
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fillColor('#94a3b8').fontSize(8).font('Helvetica')
      .text(`Page ${i + 1} of ${range.count} | AI-Powered Root Cause Analysis Agent (RCA Agent)`, 40, doc.page.height - 30, {
        align: 'center',
        width: doc.page.width - 80,
      });
  }

  doc.end();
}

module.exports = { buildPDFReport };
