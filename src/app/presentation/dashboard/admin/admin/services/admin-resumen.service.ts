import { Injectable } from '@angular/core';
import { Propiedad } from '@domain/models/propiedad.model';
import { Usuario } from '@domain/models/user.model';
import { esAgente } from '../utils/roles.utils';

@Injectable({ providedIn: 'root' })
export class AdminResumenService {
  generarResumen(usuarios: Usuario[], propiedades: Propiedad[]): { agente: string; cantidad: number }[] {
    const conteoPorAgente = new Map<string, number>();

    usuarios.filter(esAgente).forEach(agente => {
      conteoPorAgente.set(agente.nombre, 0);
    });

    propiedades.forEach(p => {
      const nombre = p.agente?.nombre;
      if (nombre && conteoPorAgente.has(nombre)) {
        conteoPorAgente.set(nombre, (conteoPorAgente.get(nombre) || 0) + 1);
      }
    });

    return Array.from(conteoPorAgente.entries()).map(([agente, cantidad]) => ({ agente, cantidad }));
  }
}
