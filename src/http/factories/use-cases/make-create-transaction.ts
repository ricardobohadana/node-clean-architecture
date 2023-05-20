import { PrismaProductRepository } from '@/data/prisma/product.repository'
import { PrismaTransactionRepository } from '@/data/prisma/transaction.repository'
import { CreateTransactionUseCase } from '@/domain/application/use-cases/create-transaction'
import { makeEventDispatcher } from '../dispatcher/make-event-dispatcher'

export function makeCreateTransactionUseCase() {
  const transRepo = new PrismaTransactionRepository()
  const prodRepo = new PrismaProductRepository()
  const eventDispatcher = makeEventDispatcher()

  return new CreateTransactionUseCase(transRepo, prodRepo, eventDispatcher)
}
