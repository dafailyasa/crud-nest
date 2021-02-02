import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { username } })
  }

  async updateUser(username: string, data: UpdateUserDTO) {
    await this.userRepository.update({ username }, data)
    return this.findByUsername(username)
  }
}