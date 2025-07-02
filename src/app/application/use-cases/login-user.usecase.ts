import { Observable } from 'rxjs';
import { AuthGateway } from '@domain/gateways/auth.gateway';
import { LoginRequest } from '@domain/models/login-request.model';
import { LoginResponse } from '@domain/models/login-response.model';

export class LoginUserUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  execute(request: LoginRequest): Observable<LoginResponse> {
    return this.authGateway.login(request);
  }
}
