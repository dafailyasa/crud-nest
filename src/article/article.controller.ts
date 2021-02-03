import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from 'src/models/article.model';
import { UpdateUserDTO } from 'src/models/user.model';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) { }

  @Get('/:slug')
  @UseGuards(AuthGuard())
  getArticleBySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug)
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
}
