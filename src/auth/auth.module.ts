import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'secret key',
      signOptions: { expiresIn: 3600 }
    })
  ],
  providers: [AuthService, JWTStrategy],
  controllers: [AuthController],
  exports: [JwtModule, JWTStrategy],

})

export class AuthModule { }
