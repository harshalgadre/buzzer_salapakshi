import mongoose from 'mongoose';

export interface IInterview extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  scenario: string;
  meetingLink: string;
  position: string;
  company: string;
  language: string;
  status: string;
  scheduledTime: Date;
  performance: {
    rating: string;
    feedback: string;
  };
  createdAt: Date;
}

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scenario: {
    type: String,
    required: [true, 'Please specify the interview scenario'],
    enum: ['Job Interview', 'Coding Interview', 'Technical Interview', 'Behavioral Interview', 'Other']
  },
  meetingLink: {
    type: String,
    required: [true, 'Please provide the meeting link']
  },
  position: {
    type: String,
    required: [true, 'Please specify the position']
  },
  company: {
    type: String,
    required: [true, 'Please specify the company']
  },
  language: {
    type: String,
    default: 'English'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  scheduledTime: {
    type: Date,
    required: [true, 'Please specify the interview time']
  },
  performance: {
    rating: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR', 'WORST'],
      default: null
    },
    feedback: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);