const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORK_DIR = path.join(process.env.TEMP, 'template_update');
const ORIGINAL_DOCX = 'C:\\Users\\harsh\\Downloads\\CSE_1_Inside cover Page_Mini Project.docx';
const TEMP_ZIP = path.join(process.env.TEMP, 'template_src.zip');

if (fs.existsSync(WORK_DIR)) {
  fs.rmSync(WORK_DIR, { recursive: true, force: true });
}
fs.mkdirSync(WORK_DIR, { recursive: true });

// Copy original docx to temp zip and extract
fs.copyFileSync(ORIGINAL_DOCX, TEMP_ZIP);
execSync(`powershell -Command "Expand-Archive -LiteralPath '${TEMP_ZIP}' -DestinationPath '${WORK_DIR}' -Force"`);

const docXmlPath = path.join(WORK_DIR, 'word', 'document.xml');
let xml = fs.readFileSync(docXmlPath, 'utf8');

console.log('Original XML read, length:', xml.length);

// 1. Update Title on Cover Page
xml = xml.replace('Mini Project Title Name', 'AI-POWERED ROOT CAUSE ANALYSIS (RCA) AGENT');

// 2. Update Student block on Cover Page (1 + 3 = 4 members)
const oldStudentBlock = `<w:t xml:space="preserve">Name of Student1 (1509710001)</w:t></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="00000012"><w:pPr><w:spacing w:after="0" w:lineRule="auto"/><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">Name of Student2 (1509710002)</w:t></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="00000013"><w:pPr><w:spacing w:after="0" w:lineRule="auto"/><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">Name of Student3 (1409710003)</w:t></w:r></w:p>`;

const newStudentBlock = `<w:t xml:space="preserve">Harsh (Roll No: 21009701000XX)</w:t></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="00000012"><w:pPr><w:spacing w:after="0" w:lineRule="auto"/><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">Partner 1 Name (Roll No: 21009701000YY)</w:t></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="00000013"><w:pPr><w:spacing w:after="0" w:lineRule="auto"/><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">Partner 2 Name (Roll No: 21009701000ZZ)</w:t></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="0000001A"><w:pPr><w:spacing w:after="0" w:lineRule="auto"/><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Arial Black" w:cs="Arial Black" w:eastAsia="Arial Black" w:hAnsi="Arial Black"/><w:b w:val="1"/><w:sz w:val="26"/><w:szCs w:val="26"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">Partner 3 Name (Roll No: 21009701000WW)</w:t></w:r></w:p>`;

if (xml.includes(oldStudentBlock)) {
  xml = xml.replace(oldStudentBlock, newStudentBlock);
  console.log('Cover page student block replaced successfully.');
} else {
  console.log('WARN: oldStudentBlock exact match not found, checking individual replacements');
  xml = xml.replace('Name of Student1 (1509710001)', 'Harsh (Roll No: 21009701000XX)');
  xml = xml.replace('Name of Student2 (1509710002)', 'Partner 1 Name (Roll No: 21009701000YY)');
  xml = xml.replace('Name of Student3 (1409710003)', 'Partner 2 Name (Roll No: 21009701000ZZ)');
}

// 3. Supervisor on Cover Page
xml = xml.replace('Prof. or Dr. Name', 'Project Guide Name');

// 4. Certificate Page - Project Title
xml = xml.replace('TITLE  OF  PROJECT  WORK', 'AI-POWERED ROOT CAUSE ANALYSIS (RCA) AGENT');

// 5. Certificate Page - Students (Harsh + 3 partners)
const oldCertStudents = `” submitted  by Mr./Ms. &lt;</w:t></w:r><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:b w:val="1"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">NAME&gt; &lt;Roll No:&gt; OF  STUDENT 1 Roll No., </w:t></w:r><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">Mr./Ms. &lt;</w:t></w:r><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:b w:val="1"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">NAME&gt; &lt;Roll No:&gt; OF  STUDENT 2, </w:t></w:r><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">Mr./Ms. &lt;</w:t></w:r><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:b w:val="1"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">NAME&gt; &lt;Roll No:&gt;  OF  STUDENT 3 </w:t></w:r>`;

const newCertStudents = `” submitted by </w:t></w:r><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:b w:val="1"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">Mr. Harsh (Roll No: 21009701000XX), Mr./Ms. Partner 1 (Roll No: 21009701000YY), Mr./Ms. Partner 2 (Roll No: 21009701000ZZ), and Mr./Ms. Partner 3 (Roll No: 21009701000WW) </w:t></w:r>`;

if (xml.includes(oldCertStudents)) {
  xml = xml.replace(oldCertStudents, newCertStudents);
  console.log('Certificate student block replaced successfully.');
} else {
  console.log('WARN: oldCertStudents exact match not found, applying regex');
  xml = xml.replace(/NAME&gt; &lt;Roll No:&gt; OF  STUDENT 1 Roll No., /g, 'Harsh (Roll No: 21009701000XX), ');
  xml = xml.replace(/NAME&gt; &lt;Roll No:&gt; OF  STUDENT 2, /g, 'Partner 1 (Roll No: 21009701000YY), ');
  xml = xml.replace(/NAME&gt; &lt;Roll No:&gt;  OF  STUDENT 3 /g, 'Partner 2 (Roll No: 21009701000ZZ), and Partner 3 (Roll No: 21009701000WW) ');
}

// 6. Acknowledgement Page - Guide
xml = xml.replace('&lt;Name of your Organization Guide&gt;', 'our Project Guide');
xml = xml.replace('&lt;his/her&gt;', 'their');

// 7. Acknowledgement Page - 4 Students
const oldAckStudents = `<w:t xml:space="preserve">(Name of Student 1)</w:t></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="00000051"><w:pPr><w:widowControl w:val="0"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:ind w:right="7"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rtl w:val="0"/></w:rPr></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="00000052"><w:pPr><w:widowControl w:val="0"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:ind w:right="7"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">(Name of Student 2)</w:t></w:r></w:p>`;

const newAckStudents = `<w:t xml:space="preserve">(Harsh)</w:t></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="00000051"><w:pPr><w:widowControl w:val="0"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:ind w:right="7"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rtl w:val="0"/></w:rPr></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="00000052"><w:pPr><w:widowControl w:val="0"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:ind w:right="7"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">(Partner 1 Name)</w:t></w:r></w:p><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="0000005B"><w:pPr><w:widowControl w:val="0"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:ind w:right="7"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000"><w:rPr><w:rFonts w:ascii="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman" w:hAnsi="Times New Roman"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">(Partner 2 Name)</w:t></w:r></w:p>`;

if (xml.includes(oldAckStudents)) {
  xml = xml.replace(oldAckStudents, newAckStudents);
  xml = xml.replace('(Name of Student 3)', '(Partner 3 Name)');
  console.log('Acknowledgement student block replaced successfully.');
} else {
  xml = xml.replace('(Name of Student 1)', '(Harsh)');
  xml = xml.replace('(Name of Student 2)', '(Partner 1 Name)');
  xml = xml.replace('(Name of Student 3)', '(Partner 2 Name)\n(Partner 3 Name)');
}

// 8. Abstract Page - Replace old NDVI text with RCA Agent abstract (<300 words)
const oldAbstractText = 'We have proposed an approach for building extraction from very high resolution (VHR) multispectral images using NDVI (Normalized Difference Vegetation Index) based segmentation and morphological operations. This approach uses both spatial and spectral properties of an image scene for building detection. Spectral properties are related to NDVI based segmentation and spatial properties are related to the morphological operations. Normally an image scene is consists of natural region (vegetation and soil) and manmade regions (buildings and roads). Use of NDVI (spectral properties) eliminates the chance of shadow being a building region and other similar regions that are not road like soil, vegetation etc. because shadow is a spatial property and NDVI is based on spectral property irrespective of brightness in the image. By using NDVI we can eliminate the natural regions from the man made.';

const newAbstractText = 'Modern enterprise and cloud microservices architectures frequently encounter critical production outages, such as HTTP 502 Bad Gateway errors, database thread-pool saturation, and memory exhaustion. Diagnosing these incidents requires Site Reliability Engineers (SREs) to manually sift through thousands of noisy log lines under strict SLA pressure. In this project, we develop an AI-Powered Root Cause Analysis (RCA) Agent that automates incident triage and failure localization. The system extracts error codes, warnings, and stack traces from uploaded server logs using a regex telemetry parser. It then executes an algorithmic Five-Whys deductive chain that traces symptoms back to their structural root cause, calculating confidence likelihood percentages for competing hypotheses. The platform features an offline deterministic heuristics engine for instant zero-cost analysis, alongside an Atlassian Jira-style master-detail workflow and automated 3-tier remediation checklists.';

if (xml.includes(oldAbstractText)) {
  xml = xml.replace(oldAbstractText, newAbstractText);
  console.log('Abstract text replaced successfully.');
} else {
  console.log('WARN: Exact old abstract text not matched, searching with substring');
  const abStart = xml.indexOf('We have proposed an approach for building extraction');
  if (abStart !== -1) {
    const abEnd = xml.indexOf('</w:t>', abStart);
    xml = xml.substring(0, abStart) + newAbstractText + xml.substring(abEnd);
    console.log('Abstract text replaced via substring.');
  }
}

// 9. Keywords
xml = xml.replace(
  'Extraction, NDVI, Segmentation, Morphology, Image processing, Spatial domain',
  'Root Cause Analysis, Five-Whys Deduction, Log Parsing, Incident Triage, SRE, Diagnostic Engine'
);

// Save updated document.xml
fs.writeFileSync(docXmlPath, xml, 'utf8');
console.log('Updated document.xml written successfully.');

// Zip back into docx using PowerShell Compress-Archive
const OUTPUT_DOCX_PROJECT = path.resolve(__dirname, '../CSE_1_Inside_cover_Page_Mini_Project.docx');
const OUTPUT_DOCX_DOWNLOADS = 'C:\\Users\\harsh\\Downloads\\CSE_1_Inside cover Page_Mini Project.docx';

// Create zip in temp
const repackedZip = path.join(process.env.TEMP, 'repacked.zip');
if (fs.existsSync(repackedZip)) fs.unlinkSync(repackedZip);

execSync(`powershell -Command "Compress-Archive -Path '${WORK_DIR}\\*' -DestinationPath '${repackedZip}' -Force"`);

// Copy zip as docx
fs.copyFileSync(repackedZip, OUTPUT_DOCX_PROJECT);
console.log('Saved to Project:', OUTPUT_DOCX_PROJECT);

const DOWNLOADS_ALT = 'C:\\Users\\harsh\\Downloads\\CSE_1_Inside_cover_Page_Mini_Project_Updated.docx';
fs.copyFileSync(repackedZip, DOWNLOADS_ALT);
console.log('Saved to Downloads (Alternative name):', DOWNLOADS_ALT);

try {
  fs.copyFileSync(repackedZip, OUTPUT_DOCX_DOWNLOADS);
  console.log('Saved to Downloads (Direct in-place):', OUTPUT_DOCX_DOWNLOADS);
} catch (err) {
  console.log('Note: Original file in Downloads is currently open in Word. Saved as CSE_1_Inside_cover_Page_Mini_Project_Updated.docx');
}

