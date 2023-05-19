import { Notification } from '../../entities/notification'
import { TransactionTypeEnum } from '../../entities/enums/transaction-type'
import { TransactionCreatedEventProps } from '../events/transaction-created.event'
import { IEvent } from '../../interfaces/events/event'
import { IEventHandler } from '../../interfaces/events/event-handler'
import { INotificationRepository } from '../../interfaces/repositories/notification.repository'

export class ShouldSendNotificationHandler implements IEventHandler<TransactionCreatedEventProps> {
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
