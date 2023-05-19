import { Notification } from '../../entities/notification'

export interface INotificationRepository {
  getAll(filter: {
    month?: number
    year?: number
    take: number
    skip: number
    productId?: string
    readAt?: boolean
  }): Promise<Notification[]>
  create(notification: Notification): Promise<void>
}
