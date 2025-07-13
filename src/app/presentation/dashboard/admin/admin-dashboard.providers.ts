import { SesionService } from '@application/services/sesion.service';

import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';

import { PropiedadHttpService } from '@infrastructure/adapters/propiedad-http.service';
import { UsuarioHttpService } from '@infrastructure/adapters/usuario-http.service';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { LogoutUseCase } from '@application/use-cases/handle-sesion/logout.usecase';
import { ListarPropiedadesUseCase } from '@application/use-cases/propiedad/listar-propiedades.usecase';
import { CrearPropiedadUseCase } from '@application/use-cases/propiedad/crear-propiedad.usecase';
import { EliminarPropiedadUseCase } from '@application/use-cases/propiedad/eliminar-propiedad.usecase';
import { ListarUsuariosUseCase } from '@application/use-cases/usuario/listar-usuarios.usecase';
import { CrearUsuarioUseCase } from '@application/use-cases/usuario/crear-usuario.usecase';
import { EditarUsuarioUseCase } from '@application/use-cases/usuario/editar-usuario.usecase';
import { EliminarUsuarioUseCase } from '@application/use-cases/usuario/eliminar-usuario.usecase';
import { AdminPropiedadService } from './admin/services/admin-propiedad.service';
import { AdminUsuarioService } from './admin/services/admin-usuario.service';
import { AdminResumenService } from './admin/services/admin-resumen.service';
import { AdminSyncService } from './admin/services/admin-sync.service';

export const ADMIN_PROVIDERS = [
  ListarPropiedadesUseCase,
  CrearPropiedadUseCase,
  EliminarPropiedadUseCase,
  ListarUsuariosUseCase,
  CrearUsuarioUseCase,
  EditarUsuarioUseCase,
  EliminarUsuarioUseCase,
  LogoutUseCase,
  SesionService,
  AdminPropiedadService,
  AdminResumenService,
  AdminSyncService,
  AdminUsuarioService,
  { provide: PropiedadRepository, useClass: PropiedadHttpService },
  { provide: UsuarioRepository, useClass: UsuarioHttpService },
  { provide: AuthSessionGateway, useClass: AuthStorageAdapter }
];
