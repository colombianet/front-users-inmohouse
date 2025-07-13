import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '@presentation/dashboard/components/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from '@presentation/dashboard/components/user-form/user-form.component';
import { Usuario } from '@domain/models/user.model';
import { AppTexts } from '@core/constants/app.texts';
import { EliminarUsuarioUseCase } from '@application/use-cases/usuario/eliminar-usuario.usecase';

@Injectable({ providedIn: 'root' })
export class AdminUsuarioService {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private eliminarUsuarioUseCase: EliminarUsuarioUseCase
  ) {}

  abrirFormularioUsuario(callback: () => void): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { modo: 'crear' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) callback();
    });
  }

  editarUsuario(usuario: Usuario, puedeEditar: boolean, callback: () => void): void {
    if (!puedeEditar) return;

    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { usuario, modo: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) callback();
    });
  }

  confirmarEliminarUsuario(usuario: Usuario, puedeEliminar: boolean, callback: () => void): void {
    if (!usuario || !puedeEliminar) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: AppTexts.CONFIRM_DELETE_USER }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.eliminarUsuarioUseCase.execute(usuario.id!).subscribe(() => {
          this.snackBar.open(AppTexts.DELETE_USER_SUCCESS, 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          callback();
        });
      }
    });
  }
}
