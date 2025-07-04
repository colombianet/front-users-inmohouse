import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '@domain/models/user.model';
import { UserService } from '@infrastructure/services/user.service';

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
    MatButtonModule
  ]
})
export class UserFormComponent {
  form: FormGroup;
  rolesDisponibles = ['ROLE_ADMIN', 'ROLE_AGENTE', 'ROLE_CLIENTE'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario?: Usuario, modo: 'crear' | 'editar' }
  ) {
    this.form = this.fb.group({
      nombre: [data.usuario?.nombre || '', Validators.required],
      email: [data.usuario?.email || '', [Validators.required, Validators.email]],
      password: ['', data.modo === 'crear' ? Validators.required : []],
      roles: [data.usuario?.roles || [], Validators.required]
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    const usuario: Usuario = this.form.value;

    const request$ = this.data.modo === 'crear'
      ? this.userService.create(usuario)
      : this.userService.update(this.data.usuario!.id!, usuario);

    request$.subscribe(() => this.dialogRef.close(true));
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
