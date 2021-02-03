import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, RelationCount } from "typeorm";
import { UserEntity } from "./user.entity";
import { AbstractEntity } from "./abstract-entity";
import { default as slugify } from 'slugify';


@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  body: string

  @Column('simple-array')
  taglist: string[]

  @ManyToOne(type => UserEntity, user => user.articles, { eager: true })
  author: UserEntity

  @ManyToMany(type => UserEntity, user => user.favorites, { eager: true })
  @JoinTable()
  favoritedBy: UserEntity[]

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

  @BeforeInsert()
  async generateSlug() {
    const data = await slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    this.slug = data
  }

  toArticle(user: UserEntity) {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.includes(user);
    }
    return { favorited }
  }
}