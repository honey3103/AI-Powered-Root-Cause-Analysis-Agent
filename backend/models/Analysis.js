const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an incident title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide an incident description'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Website downtime',
        'API errors',
        'Database issues',
        'Server problems',
        'Deployment failures',
        'Performance issues',
        'Application crashes',
        'Other technical issues',
      ],
      default: 'Other technical issues',
    },
    severity: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open',
    },
    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],
    errorMessages: {
      type: String,
      default: '',
    },
    timeOfOccurrence: {
      type: String,
      default: '',
    },
    recentChanges: {
      type: String,
      default: '',
    },
    additionalInfo: {
      type: String,
      default: '',
    },
    evidenceCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);
