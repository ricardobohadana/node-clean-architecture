import { Notification } from '../../../domain/entities/notification'
import { TransactionTypeEnum } from '../../../domain/enums/transaction-type'
import { TransactionCreatedEventProps } from '../../../domain/events/transaction-created.event'
import { IEvent } from '../../../domain/interfaces/events/event'
import { IEventHandler } from '../../../domain/interfaces/events/event-handler'
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification.repository'

export class TransactionCreatedNotificationEventHandler
  implements IEventHandler<TransactionCreatedEventProps>
{
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async execute({
    data: { transaction, product },
  }: IEvent<TransactionCreatedEventProps>): Promise<void> {
    if (transaction.type === TransactionTypeEnum.SALE && !!product.notificationLimit) {
      const afterSaleInStockAmount = product.inStockAmount - transaction.amount

      if (afterSaleInStockAmount <= product.notificationLimit) {
        const notification = new Notification({ productId: product.id })
        await this.notificationRepository.create(notification)
      }
    }
  }
}
