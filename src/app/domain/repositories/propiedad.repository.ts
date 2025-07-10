import { Observable } from 'rxjs';
import { Propiedad } from '../models/propiedad.model';

export abstract class PropiedadRepository {
  abstract listar(): Observable<Propiedad[]>;
  abstract crear(propiedad: Propiedad): Observable<Propiedad>;
  abstract eliminar(id: number): Observable<void>;
  abstract listarPropiedadesDisponibles(): Observable<Propiedad[]>;
}
