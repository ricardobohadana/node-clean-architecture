import { ProductSoldEventProps } from '../../domain/events/domain-events/product-sold.event'
import { IEvent } from '../../domain/events/interfaces/event'
import { IEventHandler } from '../../domain/events/interfaces/event-handler'
import { IProductRepository } from '../../domain/interfaces/product.repository'

export class ProductSoldEventHandler implements IEventHandler<ProductSoldEventProps> {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({
    data: { inStockAmount: oldAmount, productId: id, soldAmount },
  }: IEvent<ProductSoldEventProps>): Promise<void> {
    const inStockAmount = oldAmount - soldAmount
    await this.productRepository.updateStock({ id, inStockAmount })
  }
}
