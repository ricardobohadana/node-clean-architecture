import {Product} from '../entities/product';

export function createProductUseCase({name, price}: {name: string; price: number}) {
	return new Product({name, price});
}
