import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { UserEntity } from "src/entities/user.entity";
import { AuthPayload } from "src/models/user.model";
import { Repository } from "typeorm";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret key'
    })
  }

  async validate(payload: AuthPayload)  {
    const { username } = payload
    const user = this.userRepository.findOne({where: {username}});
    if(!user){
      throw new HttpException('unauthorization!',HttpStatus.FORBIDDEN)
    }
    return user
  }
} 