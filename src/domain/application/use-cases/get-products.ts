import { IProductRepository } from '@/domain/interfaces/repositories/product.repository'

interface GetProductUseCaseProps {
  skip?: number
  take?: number
  name?: string
}

export class GetProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({ name = '', skip = 0, take = 10 }: GetProductUseCaseProps) {
    const products = await this.productRepository.getAll({
      name,
      skip,
      take,
    })

    return { products }
  }
}
