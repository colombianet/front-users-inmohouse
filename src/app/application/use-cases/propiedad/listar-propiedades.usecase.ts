import { inject } from '@angular/core';
import { Propiedad } from '@domain/models/propiedad.model';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { Observable } from 'rxjs';

export class ListarPropiedadesUseCase {
  private propiedadRepository = inject(PropiedadRepository);

  execute(): Observable<Propiedad[]> {
    return this.propiedadRepository.listar();
  }
}
