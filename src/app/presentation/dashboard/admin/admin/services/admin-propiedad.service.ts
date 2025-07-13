import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Propiedad } from '@domain/models/propiedad.model';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { PropertyFormComponent } from '@presentation/dashboard/components/property-form/property-form.component';
import { ConfirmDialogComponent } from '@presentation/dashboard/components/confirm-dialog/confirm-dialog.component';
import { AssignAgentDialogComponent } from '@presentation/dashboard/components/assign-agent-dialog/assign-agent-dialog.component';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminPropiedadService {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private propiedadRepo: PropiedadRepository
  ) {}

  abrirFormularioEdicion(propiedad: Propiedad, callback: () => void): void {
    const dialogRef = this.dialog.open(PropertyFormComponent, {
      width: '600px',
      data: { propiedad, modo: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) callback();
    });
  }

  confirmarEliminar(id: number, eliminarFn: (id: number) => void): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: '¿Estás seguro de eliminar esta propiedad?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) eliminarFn(id);
    });
  }

  abrirAsignarDialog(propiedad: Propiedad, callback: () => void): void {
    const dialogRef = this.dialog.open(AssignAgentDialogComponent, {
      width: '500px',
      data: { propiedad }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        callback();
        this.snackBar.open('✅ Agente asignado correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-success']
        });
      }
    });
  }

  desasignarConConfirmacion(propiedad: Propiedad, callback: () => void): void {
    if (!propiedad.agente?.nombre) {
      this.snackBar.open('⚠️ La propiedad ya no tiene agente asignado', 'Cerrar', {
        duration: 3000,
        panelClass: ['snack-warning']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        mensaje: `¿Estás seguro de desasignar a ${propiedad.agente.nombre}?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.propiedadRepo.desasignarAgente(propiedad.id!).subscribe(() => {
          this.snackBar.open(`👤 Se ha desasignado a ${propiedad.agente?.nombre}`, 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-warning']
          });
          callback();
        });
      }
    });
  }

  eliminarPropiedad(id: number, eliminarUseCase: (id: number) => Observable<void>, callback: () => void): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: '¿Estás seguro de eliminar esta propiedad?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        eliminarUseCase(id).subscribe(() => {
          this.snackBar.open('✅ Propiedad eliminada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          callback();
        });
      }
    });
  }
}
