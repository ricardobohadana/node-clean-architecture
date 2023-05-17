import { Transaction } from '../entities/transaction'
import { TransactionTypeEnum } from '../enums/transaction-type'

export function createTransactionUseCase(data: {
  productId: string
  amount: number
  type: TransactionTypeEnum
  transactionDate: Date
}) {
  const transaction = new Transaction(data)
  return transaction
}
