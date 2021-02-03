import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import * as bcrypt from 'bcrypt';
import { ArticleEntity } from "./article.entity";

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

	@OneToMany(type => ArticleEntity, article => article.author)
	articles: ArticleEntity[]

	@ManyToMany(type => ArticleEntity, article => article.favoritedBy)
	@JoinColumn()
	favorites: ArticleEntity[]

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10)
	}

	async comparePassword(password: string) {
		return await bcrypt.compare(password, this.password)
	}

	toProfile(user?: UserEntity) {
		const following = this.followers.includes(user);
		return { ...user, following }
	}
}