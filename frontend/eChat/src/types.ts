export type NotificationType = 
  | "hold"
  | "message_notification"
  | "missed_call"
  | "missed_video";

export interface INotification {
  id: string;
  type: NotificationType;
  sender: string;
  senderId?: string;
  content?: string;
  avatar: string;
  timestamp: string;
}

export interface NotificationState {
  notifications: INotification[];
}
