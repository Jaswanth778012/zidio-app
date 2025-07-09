export interface Application {
  id: number;
  job?: any;
  internship?: any;
  student?: any;
  status: string;
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

