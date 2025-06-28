export interface Interview {
  id?: number;
  job?: any;
  internship?: any;
  student: { userName: string };
  employer?: { userName?: string }; // Optional as it's set by backend
  interviewDate: string;
  startTime: string;
  endTime: string;
  mode: string;
  location: string;
  notes: string;
  meetingLink?: string;
  status?: string;
}