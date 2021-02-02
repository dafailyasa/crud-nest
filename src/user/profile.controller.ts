import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common";
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
}