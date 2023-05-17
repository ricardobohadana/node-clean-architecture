import { Product } from '../entities/product'
import { DuplicateEntityError } from '../errors/duplicate-entity.error'
import { InvalidPriceError } from '../errors/invalid-price.error'
import { IProductRepository } from '../interfaces/product.repository'

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({ name, price }: { name: string; price: number }) {
    if (price <= 0) throw new InvalidPriceError()

    const product = new Product({ name, price })
    const productWithSameName = await this.productRepository.getProductByName(name)

    if (productWithSameName && product.equals(productWithSameName)) throw new DuplicateEntityError()

    this.productRepository.save(product)
    return product
  }
}
