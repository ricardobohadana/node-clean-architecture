import { TransactionTypeEnum } from '../../entities/enums/transaction-type'
import { TransactionCreatedEventProps } from '../events/transaction-created.event'
import { IEvent } from '../../interfaces/events/event'
import { IEventHandler } from '../../interfaces/events/event-handler'
import { IProductRepository } from '../../interfaces/repositories/product.repository'

export class UpdateStockHandler implements IEventHandler<TransactionCreatedEventProps> {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({
    data: { transaction, product },
  }: IEvent<TransactionCreatedEventProps>): Promise<void> {
    let inStockAmount: number

    if (transaction.type === TransactionTypeEnum.SALE)
      inStockAmount = product.inStockAmount - transaction.amount
    else inStockAmount = product.inStockAmount + transaction.amount

    await this.productRepository.updateStock({ id: product.id, inStockAmount })
  }
}
