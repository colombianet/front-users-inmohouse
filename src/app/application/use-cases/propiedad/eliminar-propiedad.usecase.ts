import { inject } from '@angular/core';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { Observable } from 'rxjs';

export class EliminarPropiedadUseCase {
  private propiedadRepository = inject(PropiedadRepository);

  execute(id: string | number): Observable<void> {
    return this.propiedadRepository.eliminar(Number(id));
  }
}
