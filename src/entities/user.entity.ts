import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from "typeorm";
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

	@ManyToMany(type => UserEntity, user => user.followee)
	@JoinTable()
	followers: UserEntity[];

	@ManyToMany(type => UserEntity, user => user.followers)
	followee: UserEntity[]

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10)
	}

	async comparePassword(password: string) {
		return await bcrypt.compare(password, this.password)
	}

	toProfile(user: UserEntity) {
		const following = this.followers.includes(user);
		return { ...user, following }
	}
}