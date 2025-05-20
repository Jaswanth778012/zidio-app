export interface AdminProfile {
  id?: number;
  userFirstName: string;
  userLastName: string;
  username: string;
  email: string;
  phone?: string;
  profilePictureUrl?: string;
}
