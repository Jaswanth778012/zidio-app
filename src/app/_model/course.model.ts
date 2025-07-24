export interface Course {
  id: number;
  courseName: string;
  description: string;
  price: number;
  discountedPrice: number;
  duration: string; // Could also calculate based on video durations
  startDate: string;
  endDate: string;
  selfPaced: boolean;
  contentType: string;
  previewUrl: string;
  prerequisites: string;
  certificate: boolean;
  status: string;
  enrollmentCount: number;
  createdAt: string;
  archived: boolean;
  tags: string;

  category: {
    id: number;
    name: string;
    description: string | null;
  };

  courseImages: {
    id: number;
    imageName: string;
    type: string;
    url: string;
    picByte: string | null;
  }[];

  faculty: {
    userName: string;
    userFirstName: string;
    userLastName: string;
    userPassword: string;
    userStatus: string;
    roles: {
      roleName: string;
      roleDescription: string;
    }[];
  };

  reviews: {
    id: number;
    reviewerUsername: string;
    rating: number;
    comment: string;
    flagged: boolean;
    resolved: boolean;
    createdAt: string;
  }[];

  syllabus: {
    id: number;
    title: string;
    description: string;
    videos: {
      id: number;
      title: string;
      description: string;
      videoUrl: string;
      duration: number; // in minutes
    }[];
  }[];

  progress: {
    id: number;
    completed: boolean;
    progressPercentage: number;
    watchedVideosCount: number;
    lastWatched: string;
    student: {
      userName: string;
      userFirstName: string;
      userLastName: string;
      userPassword: string;
      userStatus: string;
      roles: {
        roleName: string;
        roleDescription: string;
      }[];
    };
    video: {
      id: number;
      title: string;
      description: string;
      videoUrl: string;
      duration: number;
    };
  }[];
}
