import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, FindAllQuery, FindFeedQuery, UpdateArticleDTO } from 'src/models/article.model';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) { }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }

  async getAll(user: UserEntity, query: FindAllQuery) {
    let findOptions: any = {
      where: {}
    };
    if (query.author) {
      findOptions.where['author.username'] = query.author;
    }
    if (query.favorited) {
      findOptions.where['favoritedBy.username'] = query.favorited;
    }
    if (query.offset) {
      findOptions.offset = query.offset;
    }
    if (query.tag) {
      findOptions.where.taglist = Like(`%${query.tag}%`);
    }
    if (query.limit) {
      findOptions.limit = query.limit;
    }
    return (await this.articleRepository.find(findOptions)).map(article => article)
  }

  async findFeed(user: UserEntity, query: FindFeedQuery) {
    const { followee } = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['followee'],
    });
    const findOptions = { ...query, where: followee.map(follow => ({ author: follow.id })) };
    return (await this.articleRepository.find(findOptions)).map(article =>
      article
    );
  }

  async findBySlug(slug: string) {
    const article = await this.articleRepository.findOne({ where: { slug } })
    return article;
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO,) {
    const article = this.articleRepository.create(data);
    article.author = user;
    await article.save();
    return article;
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepository.update({ slug }, data);
    return article;
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug)
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepository.remove(article)
    return "success delete!"
  }

  async favoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy.push(user);
    await article.save();
    return article;
  }

  async unfavoriteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy = article.favoritedBy.filter(fav => fav.id !== user.id)
    await article.save();
    return article;
  }
}
