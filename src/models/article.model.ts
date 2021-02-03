export class CreateArticleDTO {
  title: string;
  body: string;
  description: string;
  tagList: string[];
}

export class UpdateArticleDTO {
  title: string;
  body: string;
  description: string;
  tagList: string[]
}

export interface FindFeedQuery {
  limit?: number;
  offset?: number
}

export interface FindAllQuery extends FindFeedQuery {
  tag?: string;
  author?: string;
  favorited?: string;
}