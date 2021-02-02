import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/auth/user.decorator";
import { UserEntity } from "src/entities/user.entity";
import { UserService } from "./user.service";

@Controller('profile')
export class ProfileController {
  constructor(private userService: UserService) { }

  @Get('/:username')
  async findProfileByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username)
    if (!user) {
      throw new HttpException('canot find the user', HttpStatus.NOT_FOUND)
    }
    return { profile: user }
  }

  @Post('/:username/follow')
  @UseGuards(AuthGuard())
  followUser(@User() user: UserEntity, @Param('username') username: string) {
    return this.userService.followUser(user, username)
  }

  @Delete('/:username/unfollow')
  @UseGuards(AuthGuard())
  unfollowUser(@User() user: UserEntity, @Param('username') username: string) {
    return this.userService.unfollowUser(user, username)
  }
}