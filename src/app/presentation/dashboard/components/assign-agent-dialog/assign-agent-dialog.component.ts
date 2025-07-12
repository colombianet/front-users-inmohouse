import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Usuario } from '@domain/models/user.model';
import { Propiedad } from '@domain/models/propiedad.model';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { UsuarioHttpService } from '@infrastructure/adapters/usuario-http.service';
import { PropiedadHttpService } from '@infrastructure/adapters/propiedad-http.service';

@Component({
  selector: 'app-assign-agent-dialog',
  standalone: true,
  templateUrl: './assign-agent-dialog.component.html',
  styleUrls: ['./assign-agent-dialog.component.scss'],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  providers: [
    { provide: UsuarioRepository, useClass: UsuarioHttpService },
    { provide: PropiedadRepository, useClass: PropiedadHttpService }
  ]
})
export class AssignAgentDialogComponent {
  agenteId: number | null = null;
  agentes: Usuario[] = [];
  propiedad: Propiedad = inject(MAT_DIALOG_DATA).propiedad;
  private dialogRef = inject(MatDialogRef<AssignAgentDialogComponent>);
  private userRepo = inject(UsuarioRepository);
  private propiedadRepo = inject(PropiedadRepository);

  constructor() {
    this.cargarAgentes();
  }

  cargarAgentes(): void {
    this.userRepo.listar().subscribe(usuarios => {
      this.agentes = usuarios.filter(u =>
        u.roles?.some(r => typeof r === 'string'
          ? r === 'ROLE_AGENTE'
          : r.nombre === 'ROLE_AGENTE')
      );
    });
  }

  asignar(): void {
    if (!this.agenteId) return;
    this.propiedadRepo.asignarAgente(this.propiedad.id!, this.agenteId).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
