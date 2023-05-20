/* eslint-disable no-unused-vars */
export enum TransactionTypeEnum {
  PURCHASE = 'Purchase',
  SALE = 'Sale',
}

export function toTransactionTypeEnum(value: string) {
  const enumValue =
    value === TransactionTypeEnum.PURCHASE.toString()
      ? TransactionTypeEnum.PURCHASE
      : TransactionTypeEnum.SALE

  return enumValue
}
