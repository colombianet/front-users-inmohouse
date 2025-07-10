import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatearRoles', standalone: true })
export class FormatearRolesPipe implements PipeTransform {
  transform(roles: any[]): string {
    if (!Array.isArray(roles)) return '—';
    return roles
      .map(r => {
        const valor = typeof r === 'string' ? r : r?.nombre || r?.name;
        return typeof valor === 'string' ? valor.replace('ROLE_', '') : '';
      })
      .filter(r => r)
      .join(', ');
  }
}
