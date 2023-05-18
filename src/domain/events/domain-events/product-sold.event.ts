import { DomainEvents } from '../interfaces/domain-events'
import { IEvent } from '../interfaces/event'

export interface ProductSoldEventProps {
  productId: string
  inStockAmount: number
  soldAmount: number
}

export class ProductSoldEvent implements IEvent<ProductSoldEventProps> {
  timestamp: Date
  eventName: string = DomainEvents.PRODUCT_SOLD_EVENT
  data: ProductSoldEventProps

  constructor(data: ProductSoldEventProps) {
    this.timestamp = new Date()
    this.data = data
  }
}
