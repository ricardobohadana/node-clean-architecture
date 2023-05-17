import { Product } from '../entities/product'

export interface IProductRepository {
  getProductByName(name: string): Promise<Product | null>
  save(product: Product): Promise<void>
}
