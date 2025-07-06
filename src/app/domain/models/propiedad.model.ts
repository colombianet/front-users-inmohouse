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
}
