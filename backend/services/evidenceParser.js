const pdfParse = require('pdf-parse');
const path = require('path');

const extractTextFromBuffer = async (buffer, originalName) => {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.pdf') {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (err) {
      console.error('PDF parsing error:', err.message);
      return `[Error parsing PDF content: ${err.message}]`;
    }
  }

  // TXT, LOG, CSV, or generic text
  return buffer.toString('utf-8');
};

const analyzeExtractedText = (text) => {
  const lines = text.split(/\r?\n/);
  const detectedErrors = [];
  const detectedWarnings = [];
  const detectedTimestamps = [];

  const errorRegex = /(error|fatal|exception|fail|crash|econnrefused|etimedout|500|502|503|504|oom|killed|panic|traceback|undefined|syntaxerror|typeerror|referenceerror)/i;
  const warnRegex = /(warn|warning|slow query|high memory|high cpu|timeout|retry|deprecated)/i;
  const timestampRegex = /(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?|\[\w{3}\s+\w{3}\s+\d+\s+\d{2}:\d{2}:\d{2}\s+\d{4}\]|\d{2}\/\w{3}\/\d{4}:\d{2}:\d{2}:\d{2})/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Error match
    if (errorRegex.test(trimmed) && detectedErrors.length < 30) {
      detectedErrors.push(trimmed.length > 250 ? trimmed.substring(0, 250) + '...' : trimmed);
    }

    // Warning match
    if (warnRegex.test(trimmed) && detectedWarnings.length < 20) {
      detectedWarnings.push(trimmed.length > 250 ? trimmed.substring(0, 250) + '...' : trimmed);
    }

    // Timestamp match
    const tsMatch = trimmed.match(timestampRegex);
    if (tsMatch && detectedTimestamps.length < 15) {
      if (!detectedTimestamps.includes(tsMatch[0])) {
        detectedTimestamps.push(tsMatch[0]);
      }
    }
  }

  return {
    rawContent: text.length > 20000 ? text.substring(0, 20000) + '\n\n[...truncated for analysis]' : text,
    detectedErrors,
    detectedWarnings,
    detectedTimestamps,
  };
};

module.exports = {
  extractTextFromBuffer,
  analyzeExtractedText,
};
