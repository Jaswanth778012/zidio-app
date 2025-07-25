export interface Application {
  id: number;
  job?: any;
  internship?: any;
  student?: any;
  status: ApplicationStage;
  appliedDate: string;
  resumeUrl: string;
  timestamp: string;
  studentProfilePicture?: StudentProfilePicture;
}

export interface StudentProfilePicture{
  profilePictureUrl?: string;
  userFirstName: string;
  userLastName: string;
  username: string;
  email: string;
}

export enum ApplicationStage{
  APPLICATIONS_RECEIVED='APPLICATIONS_RECEIVED',
  RESUME_SCREENING='RESUME_SCREENING',
  SHORTLISTED='SHORTLISTED',
  PHONE_INTERVIEW='PHONE_INTERVIEW',
  TECHNICAL_ASSESSMENT='TECHNICAL_ASSESSMENT',
  FINAL_INTERVIEW='FINAL_INTERVIEW',
  OFFER_EXTENDED='OFFER_EXTENDED',
  REJECTED='REJECTED'

}