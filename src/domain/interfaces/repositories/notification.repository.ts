import { Notification } from '../../entities/notification'

export interface INotificationRepository {
  getAll(filter: {
    year?: number
    take: number
    skip: number
    productId?: string
    readAt?: boolean
  }): Promise<Notification[]>
  create(notification: Notification): Promise<void>
  get(id: string): Promise<Notification | null>
  update(notification: Notification): Promise<void>
}
