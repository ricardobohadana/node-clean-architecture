import { TransactionTypeEnum } from '../../entities/enums/transaction-type'
import { TransactionCreatedEventProps } from '../events/transaction-created.event'
import { IEvent } from '../../interfaces/events/event'
import { IEventHandler } from '../../interfaces/events/event-handler'
import { IProductRepository } from '../../interfaces/repositories/product.repository'

export class UpdateStockHandler implements IEventHandler<TransactionCreatedEventProps> {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({
    data: {
      transaction: { type, amount },
      product,
    },
  }: IEvent<TransactionCreatedEventProps>): Promise<void> {
    if (type === TransactionTypeEnum.SALE) product.processSale(amount)
    else product.processPurchase(amount)

    await this.productRepository.update(product)
  }
}
