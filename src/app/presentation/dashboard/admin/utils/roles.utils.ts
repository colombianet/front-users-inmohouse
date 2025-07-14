import { Usuario } from '@domain/models/user.model';

export function esCliente(usuario: Usuario): boolean {
  return usuario.roles.some(r =>
    typeof r === 'string' ? r === 'ROLE_CLIENTE' : r.nombre === 'ROLE_CLIENTE'
  );
}

export function esAgente(usuario: Usuario): boolean {
  return usuario.roles.some(r =>
    typeof r === 'string' ? r === 'ROLE_AGENTE' : r.nombre === 'ROLE_AGENTE'
  );
}
