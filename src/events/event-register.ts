import { DomainEvents } from '../domain/interfaces/events/domain-events'
import { INotificationRepository } from '../domain/interfaces/repositories/notification.repository'
import { IProductRepository } from '../domain/interfaces/repositories/product.repository'
import { EventDispatcher } from './event-dispatcher'
import { TransactionCreatedNotificationEventHandler } from './handlers/transaction-created-event/notification.handler'
import { TransactionCreatedProductEventHandler } from './handlers/transaction-created-event/product.handler'

export class RegisterEvents {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  execute() {
    const eventDispatcher = new EventDispatcher()

    const transactionCreatedHandler = new TransactionCreatedProductEventHandler(
      this.productRepository,
    )
    const createNotificationHandler = new TransactionCreatedNotificationEventHandler(
      this.notificationRepository,
    )

    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, transactionCreatedHandler)
    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, createNotificationHandler)
  }
}
