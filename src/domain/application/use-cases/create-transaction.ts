import { Transaction } from '../../entities/transaction'
import { TransactionTypeEnum } from '../../entities/enums/transaction-type'
import { InvalidTransactionAmountError } from '../errors/invalid-transaction-amount.error'
import { InvalidTransactionDateError } from '../errors/invalid-transaction-date.error'
import { NotEnoughStockError } from '../errors/not-enough-stock.error'
import { ProductDoesNotExistError } from '../errors/product-does-not-exist.error'
import { TransactionCreatedEvent } from '../events/transaction-created.event'
import { IEventDispatcher } from '../../interfaces/events/event-dispatcher'
import { IProductRepository } from '../../interfaces/repositories/product.repository'
import { ITransactionRepository } from '../../interfaces/repositories/transaction.repository'

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly productRepository: IProductRepository,
    private readonly eventDispatcher: IEventDispatcher,
  ) {}

  async execute(data: {
    productId: string
    amount: number
    type: TransactionTypeEnum
    transactionDate: Date
  }) {
    if (data.amount <= 0) throw new InvalidTransactionAmountError()

    if (data.transactionDate > new Date()) throw new InvalidTransactionDateError()

    const product = await this.productRepository.getProductById(data.productId)
    if (!product) throw new ProductDoesNotExistError()

    if (product.inStockAmount < data.amount) throw new NotEnoughStockError()

    const transaction = new Transaction(data)

    await this.transactionRepository.save(transaction)

    // event
    const transactionCreatedEvent = new TransactionCreatedEvent({
      product,
      transaction,
    })
    // const createNotificationEvent = new CreateNotificationEvent({
    //   product,
    //   transaction,
    // })
    await this.eventDispatcher.dispatch(transactionCreatedEvent)
    // await this.eventDispatcher.dispatch(createNotificationEvent)

    return transaction
  }
}
