import { INotificationRepository } from '@/domain/interfaces/repositories/notification.repository'

interface GetNotificationsUseCaseProps {
  year?: number
  take?: number
  skip?: number
  productId?: string
  readAt?: boolean
}

export class GetNotificationsUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute({ year, skip = 0, take = 10, productId, readAt }: GetNotificationsUseCaseProps) {
    const notifications = await this.notificationRepository.getAll({
      productId,
      year,
      skip,
      take,
      readAt,
    })

    return { notifications }
  }
}
