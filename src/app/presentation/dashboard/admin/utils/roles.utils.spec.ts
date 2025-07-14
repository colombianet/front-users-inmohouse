import { esCliente, esAgente } from './roles.utils';

describe('Utilidades de Roles', () => {
  describe('esCliente()', () => {
    it('debería retornar true si el usuario tiene ROLE_CLIENTE como string', () => {
      const usuario = { roles: ['ROLE_CLIENTE'] };
      expect(esCliente(usuario as any)).toBe(true);
    });

    it('debería retornar true si el usuario tiene ROLE_CLIENTE como objeto', () => {
      const usuario = { roles: [{ nombre: 'ROLE_CLIENTE' }] };
      expect(esCliente(usuario as any)).toBe(true);
    });

    it('debería retornar false si el usuario no tiene rol de cliente', () => {
      const usuario = { roles: ['ROLE_ADMIN', 'ROLE_AGENTE'] };
      expect(esCliente(usuario as any)).toBe(false);
    });

    it('debería retornar false si roles está vacío', () => {
      const usuario = { roles: [] };
      expect(esCliente(usuario as any)).toBe(false);
    });
  });

  describe('esAgente()', () => {
    it('debería retornar true si el usuario tiene ROLE_AGENTE como string', () => {
      const usuario = { roles: ['ROLE_AGENTE'] };
      expect(esAgente(usuario as any)).toBe(true);
    });

    it('debería retornar true si el usuario tiene ROLE_AGENTE como objeto', () => {
      const usuario = { roles: [{ nombre: 'ROLE_AGENTE' }] };
      expect(esAgente(usuario as any)).toBe(true);
    });

    it('debería retornar false si el usuario no tiene rol de agente', () => {
      const usuario = { roles: ['ROLE_ADMIN', 'ROLE_CLIENTE'] };
      expect(esAgente(usuario as any)).toBe(false);
    });

    it('debería retornar false si roles está vacío', () => {
      const usuario = { roles: [] };
      expect(esAgente(usuario as any)).toBe(false);
    });
  });
});
