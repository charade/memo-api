import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { RouteEnum } from 'src/enums/routes';
import { RequestKeysEnums } from 'src/enums/request.enum';

@Controller(RouteEnum.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(RouteEnum.SignIn)
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() payload: SignInDto,
    @Res() res: Response,
  ): Promise<void> {
    const generatedToken = await this.authService.signIn(payload);
    res.cookie(process.env.AUTH_COOKIE, `Bearer ${generatedToken}`, {
      httpOnly: true,
      maxAge: Date.now() + 3600 * 1000,
    });
    res.status(HttpStatus.OK).send();
  }

  @UseGuards(AuthGuard)
  @Post(RouteEnum.checkUser)
  checkUser(@Req() req: Request) {
    return req[RequestKeysEnums.UserID];
  }
}
