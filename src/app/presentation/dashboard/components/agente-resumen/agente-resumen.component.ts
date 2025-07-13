import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-agente-resumen',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './agente-resumen.component.html',
  styleUrls: ['./agente-resumen.component.scss']
})
export class AgenteResumenComponent {
  @Input() resumen: { agente: string; cantidad: number }[] = [];

  sanitizarNombre(nombre: string): string {
    return nombre?.replace(/[{}]/g, '') ?? '';
  }
}
