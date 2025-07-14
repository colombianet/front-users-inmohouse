import { Injectable } from '@angular/core';
import { ListarUsuariosUseCase } from '@application/use-cases/usuario/listar-usuarios.usecase';
import { ListarPropiedadesUseCase } from '@application/use-cases/propiedad/listar-propiedades.usecase';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminSyncService {
  constructor(
    private listarUsuarios: ListarUsuariosUseCase,
    private listarPropiedades: ListarPropiedadesUseCase
  ) {}

  sincronizar(): Observable<{ usuarios: any[]; propiedades: any[] }> {
    return forkJoin([
      this.listarUsuarios.execute(),
      this.listarPropiedades.execute()
    ]).pipe(
      map(([usuarios, propiedades]) => ({ usuarios, propiedades }))
    );
  }
}
