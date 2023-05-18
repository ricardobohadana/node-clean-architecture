import { Notification } from '../../entities/notification'

export interface INotificationRepository {
  getAll(): Promise<Notification[]>
  create(notification: Notification): Promise<void>
}
