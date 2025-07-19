import { Application } from "./Application.model";

export interface Job {
  id: number;
    title: string;
    description: string;
    companyName: string;
    location: string;
    applications: Application[];
}
