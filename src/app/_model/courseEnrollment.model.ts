
export interface CourseEnrollment {
  id: number;
  enrollmentAt: string;
  course: any;
  student: any;
   enrollmentStatus: 'PENDING' | 'ENROLLED' | 'CANCELLED' | 'UNENROLLED';
  studentProfilePicture?: StudentProfilePicture

}

export interface StudentProfilePicture{
  profilePictureUrl?: string;
  userFirstName: string;
  userLastName: string;
  username: string;
  email: string;
}