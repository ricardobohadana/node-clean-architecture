import { TransactionTypeEnum } from '@/domain/entities/enums/transaction-type'
import { ITransactionRepository } from '@/domain/interfaces/repositories/transaction.repository'

interface GetTransactionHistoryUseCaseProps {
  productId: string
  type?: TransactionTypeEnum
  skip?: number
  take?: number
}

export class GetTransactionHistoryUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute({ productId, type, skip = 0, take = 10 }: GetTransactionHistoryUseCaseProps) {
    const transactions = await this.transactionRepository.getByProductId({
      productId,
      type,
      skip,
      take,
    })

    return { transactions }
  }
}
