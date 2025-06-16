export interface StudentProfile {
  id?: number;
  userFirstName: string;
  userLastName: string;
  username: string;
  email: string;
  phone?: string;
  profilePictureUrl?: string;
  college: string;
  branch: string;
  department: string;
  graduationYear: number;
  skills?: string[];
  resumeUrl?: string;
}