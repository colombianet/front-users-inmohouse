import { SesionService } from "@application/services/sesion.service";
import { LogoutUseCase } from "@application/use-cases/handle-sesion/logout.usecase";
import { ListarPropiedadesDisponiblesUseCase } from "@application/use-cases/propiedad/istar-propiedades-disponibles.usecase";
import { AuthSessionGateway } from "@domain/gateways/auth-session.gateway";
import { PropiedadRepository } from "@domain/repositories/propiedad.repository";
import { AuthStorageAdapter } from "@infrastructure/adapters/auth-storage.adapter";
import { PropiedadHttpService } from "@infrastructure/adapters/propiedad-http.service";

export const CLIENTE_PROVIDERS = [
  ListarPropiedadesDisponiblesUseCase,
  LogoutUseCase,
  SesionService,
  { provide: PropiedadRepository, useClass: PropiedadHttpService },
  { provide: AuthSessionGateway, useClass: AuthStorageAdapter }
];
