import { Optional } from '../../@types/optional'
import { BaseEntityProps, Entity } from './base/entity'

export type ProductProps = {
  name: string
  price: number
  inStockAmount: number
  size?: string
  color?: string
  notificationLimit?: number
}

export type ProductConstructorProps = Optional<ProductProps, 'inStockAmount'> & BaseEntityProps

export class Product extends Entity<ProductProps> {
  set inStockAmount(value) {
    if (value < 0) throw new Error()
    this.props.inStockAmount = value
  }

  set notificationLimit(value) {
    this.props.notificationLimit = value
  }

  get name() {
    return this.props.name
  }

  get price() {
    return this.props.price
  }

  get inStockAmount() {
    return this.props.inStockAmount
  }

  get size() {
    return this.props.size
  }

  get color() {
    return this.props.color
  }

  get notificationLimit() {
    return this.props.notificationLimit
  }

  constructor({ id, createdAt, updatedAt, ...props }: ProductConstructorProps) {
    super({
      entityProps: {
        id,
        createdAt,
        updatedAt,
      },
      props: {
        ...props,
        inStockAmount: props.inStockAmount ?? 0,
      },
    })
  }

  equals(product: Product) {
    const isEqual =
      product.price === this.price && product.color === this.color && product.size === this.size
    return isEqual
  }
}
