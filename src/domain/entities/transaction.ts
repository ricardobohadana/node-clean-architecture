import { TransactionTypeEnum } from '../enums/transaction-type'
import { BaseEntityProps, Entity } from './base/entity'

export type TransactionProps = {
  productId: string
  amount: number
  type: TransactionTypeEnum
  transactionDate: Date
}

export class Transaction extends Entity<TransactionProps> {
  get productId() {
    return this.props.productId
  }

  get amount() {
    return this.props.amount
  }

  get type() {
    return this.props.type
  }

  get transactionDate() {
    return this.props.transactionDate
  }

  constructor({ id, createdAt, updatedAt, ...props }: TransactionProps & BaseEntityProps) {
    super({
      props,
      entityProps: {
        id,
        createdAt,
        updatedAt,
      },
    })
  }
}
