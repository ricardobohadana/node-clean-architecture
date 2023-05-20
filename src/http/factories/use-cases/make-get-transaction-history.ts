import { PrismaTransactionRepository } from '@/data/prisma/transaction.repository'
import { GetTransactionHistoryUseCase } from '@/domain/application/use-cases/get-transaction-history'

export function makeGetTransactionHistoryUseCase() {
  const transactionRepository = new PrismaTransactionRepository()
  return new GetTransactionHistoryUseCase(transactionRepository)
}
