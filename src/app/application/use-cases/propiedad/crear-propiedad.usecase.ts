import { inject } from '@angular/core';
import { Propiedad } from '@domain/models/propiedad.model';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { Observable } from 'rxjs';

export class CrearPropiedadUseCase {
  private propiedadRepository = inject(PropiedadRepository);

  execute(propiedad: Propiedad): Observable<Propiedad> {
    return this.propiedadRepository.crear(propiedad);
  }
}
