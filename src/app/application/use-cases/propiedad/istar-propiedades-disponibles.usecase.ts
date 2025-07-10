import { Injectable } from '@angular/core';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { Propiedad } from '@domain/models/propiedad.model';
import { Observable } from 'rxjs';

@Injectable()
export class ListarPropiedadesDisponiblesUseCase {
  constructor(private readonly repo: PropiedadRepository) {}

  execute(): Observable<Propiedad[]> {
    return this.repo.listarPropiedadesDisponibles();
  }
}
