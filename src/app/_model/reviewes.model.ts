export interface CourseReview {
  id?: number;
  reviewerUsername: string;
  course: any;
  rating: number;
  comment: string;
  flagged?: boolean;
  createdAt?: string;
}