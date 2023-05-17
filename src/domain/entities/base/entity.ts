import {randomUUID, type UUID} from 'crypto';
import {type Optional} from '../../@types/optional';

export type EntityProps = {
	id: string;
	updatedAt: Date;
	createdAt: Date;
};

export class Entity<Props> {
	protected props: EntityProps;

	constructor(props: Optional<EntityProps, 'id' | 'updatedAt' | 'createdAt'>) {
		this.props = {
			id: randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...props,
		};
	}
}
