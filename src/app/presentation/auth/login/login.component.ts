import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoginRequest } from '@domain/models/login-request.model';
import { LoginUserUseCase } from '@application/use-cases/login-user.usecase';
import { AuthApiAdapter } from '@infrastructure/adapters/auth-api.adapter';
import { AppTexts } from '@core/constants/app.texts';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginUseCase: LoginUserUseCase;
  loading = false;
  error: string | null = null;
  texts = AppTexts;

  constructor(
    private fb: FormBuilder,
    private auth: AuthApiAdapter,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginUseCase = new LoginUserUseCase(this.auth);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    const request: LoginRequest = this.loginForm.value;

    this.loginUseCase.execute(request).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);

        const roles = this.authService.getRoles().map(r => r.replace('ROLE_', ''));
        const prioridad = ['ADMIN', 'AGENTE', 'CLIENTE'];
        const rolPrincipal = prioridad.find(r => roles.includes(r));

        if (rolPrincipal) {
          this.authService.redireccionarPorRol();
        } else {
          this.authService.logout();
          this.error = AppTexts.ERROR_ROLES;
        }

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = AppTexts.ERROR_CREDENTIALS;
        console.error(err);
      }
    });
  }
}
