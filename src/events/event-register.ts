import { DomainEvents } from '../domain/interfaces/events/domain-events'
import { INotificationRepository } from '../domain/interfaces/repositories/notification.repository'
import { IProductRepository } from '../domain/interfaces/repositories/product.repository'
import { EventDispatcher } from './event-dispatcher'
import { ShouldSendNotificationHandler } from './handlers/notification.handler'
import { UpdateStockHandler } from './handlers/update-stock.handler'

export class RegisterEvents {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  execute() {
    const eventDispatcher = new EventDispatcher()

    const transactionCreatedHandler = new UpdateStockHandler(
      this.productRepository,
    )
    const createNotificationHandler = new ShouldSendNotificationHandler(
      this.notificationRepository,
    )

    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, transactionCreatedHandler)
    eventDispatcher.register(DomainEvents.TRANSACTION_CREATED_EVENT, createNotificationHandler)
  }
}
