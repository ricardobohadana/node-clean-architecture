import {
  TransactionTypeEnum,
  toTransactionTypeEnum,
} from '@/domain/entities/enums/transaction-type'
import { Transaction } from '@/domain/entities/transaction'
import { ITransactionRepository } from '@/domain/interfaces/repositories/transaction.repository'
import { prisma } from './client'

export class PrismaTransactionRepository implements ITransactionRepository {
  async save({
    id,
    amount,
    productId,
    transactionDate,
    type,
    updatedAt,
    createdAt,
  }: Transaction): Promise<void> {
    await prisma.transaction.create({
      data: {
        id,
        amount,
        productId,
        transactionDate,
        type,
        updatedAt,
        createdAt,
      },
    })
  }

  async getByProductId({
    productId,
    take,
    skip,
    type,
  }: {
    productId: string
    type?: TransactionTypeEnum | undefined
    skip: number
    take: number
  }): Promise<Transaction[]> {
    const models = await prisma.transaction.findMany({ take, skip, where: { productId, type } })

    const transactions = models.map(
      ({ id, amount, productId, transactionDate, type, updatedAt, createdAt }) =>
        new Transaction({
          id,
          amount,
          productId,
          transactionDate,
          type: toTransactionTypeEnum(type),
          updatedAt: updatedAt ?? undefined,
          createdAt,
        }),
    )
    return transactions
  }
}
