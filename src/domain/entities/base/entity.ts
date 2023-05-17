import {randomUUID, type UUID} from 'crypto';
import {type Optional} from '../../@types/optional';

export type EntityProps = {
	id: string;
	updatedAt: Date;
	createdAt: Date;
};

export type BaseEntityProps = Optional<EntityProps, 'id' | 'updatedAt' | 'createdAt'>;

export class Entity<Props> {
	protected props: Props;

	private readonly _id: string;
	private _updatedAt: Date;
	private readonly _createdAt: Date;

	protected constructor({entityProps: {id, createdAt, updatedAt}, props}: {entityProps: BaseEntityProps; props: Props}) {
		this._id = id ?? randomUUID();
		this._createdAt = createdAt ?? new Date();
		this._updatedAt = updatedAt ?? new Date();

		this.props = props;
	}

	protected touch() {
		this._updatedAt = new Date();
	}

	get id() {
		return this._id;
	}

	get updatedAt() {
		return this._updatedAt;
	}

	get createdAt() {
		return this._createdAt;
	}
}
