import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDTO, RegisterDTO } from '../models/user.model'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
		private jwtService: JwtService
	) { }

	private tokenSign(data: string) {
		const username = {username: data}
		const token = this.jwtService.sign(username)
		return token
	}

	async register(credentials: RegisterDTO) {
		try {
			const user = await this.userRepository.create(credentials);
			user.save();
			const token = this.tokenSign(user.username)
			return { user: { ...user, token } };
		} catch (error) {
			if (error.code === '23505') {
				throw new ConflictException('Username has been taken!')
			}
			throw new InternalServerErrorException();
		}
	}

	async login({ email, password }: LoginDTO) {
		try {
			const user = await this.userRepository.findOne({ where: { email } })
			const isValid = await user.comparePassword(password);
			if (!isValid) {
				throw new HttpException('Invalid Credentials!', HttpStatus.BAD_REQUEST)
			}
			const token = this.tokenSign(user.username)
			return { user: { ...user, token } };
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}
}
