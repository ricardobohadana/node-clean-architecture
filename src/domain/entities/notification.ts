import {type Optional} from '../@types/optional';
import {type BaseEntityProps, Entity, type EntityProps} from './base/entity';

export type NotificationProps = {
	productId: string;
	readAt?: Date;
};

export class Notification extends Entity<NotificationProps> {
	get productId() {
		return this.props.productId;
	}

	get readAt() {
		return this.props.readAt;
	}

	constructor({id, createdAt, updatedAt, ...props}: NotificationProps & BaseEntityProps) {
		super({
			props,
			entityProps: {
				id, createdAt, updatedAt,
			},
		});
	}

	read() {
		this.props.readAt = new Date();
	}
}
