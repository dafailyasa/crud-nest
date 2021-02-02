import { BeforeInsert, Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import * as bcrypt from 'bcrypt';

@Entity()
export class UserEntity extends AbstractEntity {
	@Column()
	email: string

	@Column({ unique: true })
	username: string;

	@Column({ default: '' })
	bio: string;

	@Column({ default: null, nullable: true })
	image: string | null

	@Column()
	password: string

	//TODO: add following

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10)
	}

	async comparePassword(password: string) {
		return await bcrypt.compare(password, this.password)
	}
}