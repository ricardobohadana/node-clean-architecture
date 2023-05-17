import {randomUUID, type UUID} from 'crypto';
import {type Optional} from '../../@types/optional';

export type EntityProps = {
	id: string;
	updatedAt: Date;
	createdAt: Date;
};

export type BaseEntityProps = Optional<EntityProps, 'id' | 'updatedAt' | 'createdAt'>;

export class Entity<Props> {
	protected entityProps: EntityProps;
	protected props: Props;

	protected constructor({entityProps, props}: {entityProps: BaseEntityProps; props: Props}) {
		this.entityProps = {
			id: randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...entityProps,
		};

		this.props = props;
	}

	protected touch() {
		this.entityProps.updatedAt = new Date();
	}
}
