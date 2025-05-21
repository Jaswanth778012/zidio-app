export interface AdminNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  read: boolean;
  resolved: boolean;
  timestamp: string;
  referenceId: string;
}
