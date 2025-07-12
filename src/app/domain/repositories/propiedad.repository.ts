import { Observable } from 'rxjs';
import { Propiedad } from '../models/propiedad.model';

export abstract class PropiedadRepository {
  abstract listar(): Observable<Propiedad[]>;
  abstract crear(propiedad: Propiedad): Observable<Propiedad>;
  abstract eliminar(id: number): Observable<void>;
  abstract listarPropiedadesDisponibles(): Observable<Propiedad[]>;
  abstract asignarAgente(idPropiedad: number, idAgente: number): Observable<void>;
  abstract desasignarAgente(idPropiedad: number): Observable<void>;
}
