import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EliminarUsuarioUseCase } from '@application/use-cases/usuario/eliminar-usuario.usecase';
import { AppTexts } from '@core/constants/app.texts';
import { Usuario } from '@domain/models/user.model';
import { ConfirmDialogComponent } from '@presentation/dashboard/components/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from '@presentation/dashboard/components/user-form/user-form.component';

@Injectable({ providedIn: 'root' })
export class AgenteClientesService {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private eliminarUsuarioUseCase: EliminarUsuarioUseCase
  ) {}

  abrirFormulario(callback: () => void): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { modo: 'crear' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) callback();
    });
  }

  editar(cliente: Usuario, callback: () => void): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { usuario: cliente, modo: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) callback();
    });
  }

  eliminar(id: number, callback: () => void): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: AppTexts.CONFIRM_DELETE_USER }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.eliminarUsuarioUseCase.execute(id).subscribe(() => {
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
