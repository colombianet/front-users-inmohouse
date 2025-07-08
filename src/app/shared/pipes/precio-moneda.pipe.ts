import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precioMoneda',
  standalone: true
})
export class PrecioMonedaPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  }
}
