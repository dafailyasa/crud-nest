import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, FindAllQuery, FindFeedQuery, UpdateArticleDTO } from 'src/models/article.model';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) { }

  @Get('')
  async getAllArticle(@User() user: UserEntity, @Query() query: FindAllQuery) {
    const articles = await this.articleService.getAll(user, query);
    return {
      articles,
      articleLength: articles.length
    }
  }

  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(@User() user: UserEntity, @Query() query: FindFeedQuery) {
    const articles = await this.articleService.findFeed(user, query)
    return { articles, articleLength: articles.length }
  }

  @Get('/:slug')
  @UseGuards(AuthGuard())
  async getArticleBySlug(@Param('slug') slug: string) {
    const article = this.articleService.findBySlug(slug)
    if (!article) {
      throw new HttpException('canot find the user', HttpStatus.NOT_FOUND)
    }
    return article
  }

  @Post('')
  @UseGuards(AuthGuard())
  createArticle(@User() user: UserEntity, @Body() article: CreateArticleDTO) {
    return this.articleService.createArticle(user, article)
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  updateArticle(@Param('slug') slug: string, @User() user: UserEntity, @Body() article: UpdateArticleDTO) {
    return this.articleService.updateArticle(slug, user, article);
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  deleteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    return this.articleService.deleteArticle(slug, user)
  }

  @Post('/:slug/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(@User() user: UserEntity, @Param('slug') slug: string) {
    const favoriteArticle = await this.articleService.favoriteArticle(slug, user);
    return favoriteArticle
  }

  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(@User() user: UserEntity, @Param('slug') slug: string) {
    const unfavoriteArticle = await this.articleService.unfavoriteArticle(slug, user);
    return unfavoriteArticle;
  }
}
