import { IProductRepository } from '@/domain/interfaces/repositories/product.repository'
import { ProductDoesNotExistError } from '../errors/product-does-not-exist.error'

interface UpdateProductNotificationLimitUseCaseProps {
  productId: string
  notificationLimit: number
}

export class UpdateProductNotificationLimitUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({ productId, notificationLimit }: UpdateProductNotificationLimitUseCaseProps) {
    const product = await this.productRepository.getProductById(productId)
    if (!product) throw new ProductDoesNotExistError()

    product.notificationLimit = notificationLimit
    await this.productRepository.update(product)
  }
}
