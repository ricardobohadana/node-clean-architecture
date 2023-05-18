import { Transaction } from '../../entities/transaction'

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>
}
