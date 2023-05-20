import { PrismaNotificationRepository } from '@/data/prisma/notification.repository'
import { ShouldCreateNotificationHandler } from '@/domain/application/handlers/should-create-notification.handler'

export function makeShouldCreateNotificationHandler() {
  const notificationRepository = new PrismaNotificationRepository()
  return new ShouldCreateNotificationHandler(notificationRepository)
}
