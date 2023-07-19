import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() authCredentialsDto: AuthCredentialsDto) {
    await this.authService.createUser(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    const payload = await this.authService.signIn(authCredentialsDto);

    return payload;
  }
}
