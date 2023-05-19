import { Product } from '../../entities/product'

export interface IProductRepository {
  getProductByName(name: string): Promise<Product | null>
  save(product: Product): Promise<void>
  getProductById(id: string): Promise<Product | null>
  updateStock(data: { id: string; inStockAmount: number }): Promise<void>
  update(product: Product): Promise<void>
  getAll(filter: { take: number; skip: number; name: string }): Promise<Product[]>
}
