import { TransactionTypeEnum } from '@/domain/entities/enums/transaction-type'
import { Transaction } from '../../entities/transaction'

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>
  getByProductId(data: {
    productId: string
    type?: TransactionTypeEnum
    skip: number
    take: number
  }): Promise<Transaction[]>
}
