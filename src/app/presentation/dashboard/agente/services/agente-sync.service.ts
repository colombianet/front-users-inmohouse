import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListarClientesUseCase } from '@application/use-cases/usuario/listar-clientes.usecase';
import { ListarPropiedadesUseCase } from '@application/use-cases/propiedad/listar-propiedades.usecase';
import { Usuario } from '@domain/models/user.model';
import { Propiedad } from '@domain/models/propiedad.model';

@Injectable({ providedIn: 'root' })
export class AgenteSyncService {
  constructor(
    private listarClientes: ListarClientesUseCase,
    private listarPropiedades: ListarPropiedadesUseCase
  ) {}

  sincronizar(): Observable<{ clientes: Usuario[]; propiedades: Propiedad[] }> {
    return forkJoin([
      this.listarClientes.execute(),
      this.listarPropiedades.execute()
    ]).pipe(
      map(([clientes, propiedades]) => ({ clientes, propiedades }))
    );
  }
}
