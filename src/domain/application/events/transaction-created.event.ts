import { Product } from '../../entities/product'
import { Transaction } from '../../entities/transaction'
import { DomainEvents } from '../../interfaces/events/domain-events'
import { IEvent } from '../../interfaces/events/event'

export interface TransactionCreatedEventProps {
  product: Product
  transaction: Transaction
}

export class TransactionCreatedEvent implements IEvent<TransactionCreatedEventProps> {
  timestamp: Date
  eventName: string = DomainEvents.TRANSACTION_CREATED_EVENT
  data: TransactionCreatedEventProps

  constructor(data: TransactionCreatedEventProps) {
    this.timestamp = new Date()
    this.data = data
  }
}
