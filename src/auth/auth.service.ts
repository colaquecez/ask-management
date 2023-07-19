import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn({ password, username }: AuthCredentialsDto) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException('Please check your login credentials');
  }

  async createUser({ password, username }: AuthCredentialsDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      password: hashedPassword,
      username,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email is already taken');
      } else {
        throw new InternalServerErrorException('Unexpected error occurred');
      }
    }
  }
}
