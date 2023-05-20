import { Product } from '../../entities/product'
import { DuplicateEntityError } from '../errors/duplicate-entity.error'
import { InvalidPriceError } from '../errors/invalid-price.error'
import { IProductRepository } from '../../interfaces/repositories/product.repository'

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(data: {
    name: string
    price: number
    inStockAmount?: number
    size?: string
    color?: string
    notificationLimit?: number
  }) {
    if (data.price <= 0) throw new InvalidPriceError()

    const product = new Product(data)
    const productsWithSameName = await this.productRepository.getProductByName(data.name)

    if (productsWithSameName && productsWithSameName.some((p) => product.equals(p)))
      throw new DuplicateEntityError()

    this.productRepository.save(product)
    return product
  }
}
