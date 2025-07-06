import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '@domain/models/user.model';
import { UserService } from '@infrastructure/services/user.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class UserFormComponent {
  form: FormGroup;
  rolesDisponibles: string[];
  modoEdicion: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public data: { usuario?: Usuario; modo: 'crear' | 'editar' }
  ) {
    this.modoEdicion = data.modo === 'editar';

    this.rolesDisponibles = this.authService.esAgente()
      ? ['ROLE_CLIENTE']
      : ['ROLE_ADMIN', 'ROLE_AGENTE', 'ROLE_CLIENTE'];

    const rawRol = data.usuario?.roles?.[0];
    const rolActual = typeof rawRol === 'string'
      ? rawRol
      : (rawRol && 'nombre' in rawRol)
        ? rawRol.nombre
        : 'ROLE_CLIENTE';

    this.form = this.fb.group({
      nombre: [data.usuario?.nombre || '', Validators.required],
      email: [data.usuario?.email || '', [Validators.required, Validators.email]],
      password: [''],
      rol: [rolActual, Validators.required]
    });

    if (data.modo === 'crear') {
      this.form.get('password')?.setValidators(Validators.required);
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const usuario: Usuario = {
      ...this.data.usuario,
      nombre: raw.nombre,
      email: raw.email,
      roles: [raw.rol]
    };

    if (raw.password && raw.password.trim().length > 0) {
      usuario.password = raw.password;
    } else {
      delete usuario.password;
    }

    const request$ = this.data.modo === 'crear'
      ? this.userService.create(usuario)
      : this.userService.update(this.data.usuario!.id!, usuario);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.data.modo === 'crear'
            ? '✅ Usuario creado correctamente'
            : '✅ Usuario actualizado correctamente',
          'Cerrar',
          { duration: 3000, panelClass: ['snack-success'] }
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('❌ Error al guardar el usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
