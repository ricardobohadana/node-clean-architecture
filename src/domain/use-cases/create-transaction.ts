import { Transaction } from '../entities/transaction'
import { TransactionTypeEnum } from '../enums/transaction-type'
import { InvalidTransactionAmountError } from '../errors/invalid-transaction-amount.error'
import { InvalidTransactionDateError } from '../errors/invalid-transaction-date.error'
import { ProductDoesNotExistError } from '../errors/product-does-not-exist.error'
import { IProductRepository } from '../interfaces/product.repository'
import { ITransactionRepository } from '../interfaces/transaction.repository'

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(data: {
    productId: string
    amount: number
    type: TransactionTypeEnum
    transactionDate: Date
  }) {
    if (data.amount <= 0) throw new InvalidTransactionAmountError()

    if (data.transactionDate > new Date()) throw new InvalidTransactionDateError()

    if (!(await this.productRepository.getProductById(data.productId)))
      throw new ProductDoesNotExistError()

    const transaction = new Transaction(data)
    this.transactionRepository.save(transaction)
    return transaction
  }
}
