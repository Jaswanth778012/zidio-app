export interface ApplicationQuestion {
  id: number;
  job?: any;
  internship?: any;
  questionText: string;
  questionType: string;
  options?: string[];
  answer?: string;
  required: boolean;
}
