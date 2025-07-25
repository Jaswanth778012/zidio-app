export interface Syllabus {
  id: number;
  title: string;
  description: string;
  course?: any;
    video?: string[]; // Assuming video is an array of URLs or video IDs
}