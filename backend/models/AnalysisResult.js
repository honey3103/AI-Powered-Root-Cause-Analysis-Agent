const mongoose = require('mongoose');

const possibleCauseSchema = new mongoose.Schema({
  cause: { type: String, required: true },
  confidence: { type: Number, required: true, min: 0, max: 100 },
  description: { type: String, default: '' },
  supportingEvidence: [{ type: String }],
  contradictingEvidence: [{ type: String }],
});

const fiveWhysSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  reasoning: { type: String, default: '' },
});

const analysisResultSchema = new mongoose.Schema(
  {
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true,
      unique: true,
      index: true,
    },
    problemSummary: {
      type: String,
      required: true,
    },
    identifiedSymptoms: [
      {
        type: String,
      },
    ],
    possibleCauses: [possibleCauseSchema],
    mostLikelyCause: {
      type: String,
      default: '',
    },
    fiveWhys: [fiveWhysSchema],
    finalRootCause: {
      type: String,
      default: '',
    },
    recommendations: {
      immediate: [{ type: String }],
      shortTerm: [{ type: String }],
      longTerm: [{ type: String }],
    },
    alternativeExplanations: [{ type: String }],
    investigationSteps: [{ type: String }],
    missingInformation: [{ type: String }],
    confidenceAssessment: {
      type: String,
      default: '',
    },
    modelUsed: {
      type: String,
      default: 'Heuristic Engine',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
