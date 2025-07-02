import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';

export abstract class AuthGateway {
  abstract login(data: LoginRequest): Observable<LoginResponse>;
}
