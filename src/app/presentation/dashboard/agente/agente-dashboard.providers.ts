import { SesionService } from '@application/services/sesion.service';

import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';

import { PropiedadHttpService } from '@infrastructure/adapters/propiedad-http.service';
import { UsuarioHttpService } from '@infrastructure/adapters/usuario-http.service';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { LogoutUseCase } from '@application/use-cases/handle-sesion/logout.usecase';
import { ListarPropiedadesUseCase } from '@application/use-cases/propiedad/listar-propiedades.usecase';
import { CrearUsuarioUseCase } from '@application/use-cases/usuario/crear-usuario.usecase';
import { EditarUsuarioUseCase } from '@application/use-cases/usuario/editar-usuario.usecase';
import { EliminarUsuarioUseCase } from '@application/use-cases/usuario/eliminar-usuario.usecase';
import { ListarClientesUseCase } from '@application/use-cases/usuario/listar-clientes.usecase';
import { AgenteSyncService } from './services/agente-sync.service';
import { AgenteClientesService } from './services/agente-clientes.service';

export const AGENTE_PROVIDERS = [
  ListarClientesUseCase,
  CrearUsuarioUseCase,
  EditarUsuarioUseCase,
  EliminarUsuarioUseCase,
  ListarPropiedadesUseCase,
  LogoutUseCase,
  SesionService,
  AgenteClientesService,
  AgenteSyncService,
  { provide: PropiedadRepository, useClass: PropiedadHttpService },
  { provide: UsuarioRepository, useClass: UsuarioHttpService },
  { provide: AuthSessionGateway, useClass: AuthStorageAdapter }
];
