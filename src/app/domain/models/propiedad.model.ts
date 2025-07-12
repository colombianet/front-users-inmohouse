import { Usuario } from "./user.model";

export interface Propiedad {
  id?: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  precio: number;
  ubicacion: string;
  estado: string;
  agenteId?: number;
  clienteId?: number | null;
  agente?: Usuario;
}
