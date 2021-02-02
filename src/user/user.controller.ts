import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../auth/user.decorator'
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(@User() { username }: UserEntity) {
    return await this.userService.findByUsername(username)
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(@User() { username }: UserEntity, @Body() data: UpdateUserDTO) {
    return await this.userService.updateUser(username, data)
  }
}
