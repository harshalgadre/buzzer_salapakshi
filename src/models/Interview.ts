import mongoose from 'mongoose';

export interface IInterview extends mongoose.Document {
  userId: string;
  scenario: string;
  meetingUrl: string;
  isDesktopCall: boolean;
  liveCoding: boolean;
  aiInterview: boolean;
  position: string;
  company: string;
  meetingLanguage: string;
  translationLanguage: string;
  resume: string;
  createdAt: Date;
  __v: number;
}

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  scenario: {
    type: String,
    required: true
  },
  meetingUrl: {
    type: String,
    required: true
  },
  isDesktopCall: {
    type: Boolean,
    default: false
  },
  liveCoding: {
    type: Boolean,
    default: false
  },
  aiInterview: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  meetingLanguage: {
    type: String,
    default: 'english'
  },
  translationLanguage: {
    type: String,
    default: 'english'
  },
  resume: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'interviewsessions' // match actual MongoDB collection name
});

export default mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);