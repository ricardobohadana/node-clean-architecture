import { BaseEntityProps, Entity } from './base/entity'

export type ProductProps = {
  name: string
  price: number
  inStockAmount: number
  size?: string
  color?: string
  notificationLimit?: number
}

export class Product extends Entity<ProductProps> {
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

  constructor({
    id,
    createdAt,
    updatedAt,
    ...props
  }: Omit<ProductProps, 'inStockAmount'> & BaseEntityProps) {
    super({
      entityProps: {
        id,
        createdAt,
        updatedAt,
      },
      props: {
        ...props,
        inStockAmount: 0,
      },
    })
  }

  equals(product: Product) {
    const isEqual =
      product.price === this.price && product.color === this.color && product.size === this.size
    return isEqual
  }
}
