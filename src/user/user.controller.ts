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
  findCurrentUser(@User() { username }: UserEntity) {
    console.log(username)
    return this.userService.findByUsername(username)
  }

  @Put()
  @UseGuards(AuthGuard())
  update(@User() { username }: UserEntity, @Body() data: UpdateUserDTO) {
    return this.userService.updateUser(username, data)
  }
}
