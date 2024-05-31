import { Controller } from '@nestjs/common';
import { UserAuthService } from '../auth_service/user_auth.service';

@Controller('user-auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}
}
