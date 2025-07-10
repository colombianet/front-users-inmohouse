import { Observable } from 'rxjs';
import { AuthLoginGateway } from '@domain/gateways/auth-login.gateway';
import { LoginRequest } from '@domain/models/login-request.model';
import { LoginResponse } from '@domain/models/login-response.model';

export class LoginUserUseCase {
  constructor(private readonly authGateway: AuthLoginGateway) {}

  execute(request: LoginRequest): Observable<LoginResponse> {
    return this.authGateway.login(request);
  }
}
