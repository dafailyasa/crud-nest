import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/models/user.model';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post()
  register(@Body() credentials: RegisterDTO) {
    return this.authService.register(credentials)
  }

  @Post('/login')
  login(@Body() credentials: LoginDTO) {
    return this.authService.login(credentials)
  }
}
