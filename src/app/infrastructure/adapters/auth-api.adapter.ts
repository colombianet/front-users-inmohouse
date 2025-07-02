import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthGateway } from '@domain/gateways/auth.gateway';
import { LoginRequest } from '@domain/models/login-request.model';
import { LoginResponse } from '@domain/models/login-response.model';
import { environment } from 'environments/environment';



@Injectable({ providedIn: 'root' })
export class AuthApiAdapter implements AuthGateway {
  private readonly BASE_URL = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE_URL}/login`, data);
  }
}
