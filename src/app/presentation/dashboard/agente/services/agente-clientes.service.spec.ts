import { TestBed } from '@angular/core/testing';
import { AgenteClientesService } from './agente-clientes.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EliminarUsuarioUseCase } from '@application/use-cases/usuario/eliminar-usuario.usecase';
import { AppTexts } from '@core/constants/app.texts';
import { of } from 'rxjs';

describe('AgenteClientesService', () => {
  let service: AgenteClientesService;

  const mockDialogRef = {
    afterClosed: jest.fn(() => of(true)),
    close: jest.fn()
  };

  const mockDialog = {
    open: jest.fn(() => mockDialogRef)
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  const mockEliminarUsuarioUseCase = {
    execute: jest.fn(() => of(undefined))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AgenteClientesService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: EliminarUsuarioUseCase, useValue: mockEliminarUsuarioUseCase }
      ]
    });

    service = TestBed.inject(AgenteClientesService);
    jest.clearAllMocks();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería abrir el formulario de creación y ejecutar el callback al cerrar con resultado', () => {
    const callback = jest.fn();
    service.abrirFormulario(callback);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });

  it('debería abrir el formulario de edición y ejecutar el callback al cerrar con resultado', () => {
    const callback = jest.fn();
    const usuario = { id: 1, nombre: 'Cliente Demo' } as any;
    service.editar(usuario, callback);
    expect(mockDialog.open).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({
      width: '600px',
      data: { usuario, modo: 'editar' }
    }));
    expect(callback).toHaveBeenCalled();
  });

  it('debería confirmar la eliminación y ejecutar el caso de uso y callback si se confirma', () => {
    const callback = jest.fn();
    service.eliminar(99, callback);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockEliminarUsuarioUseCase.execute).toHaveBeenCalledWith(99);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      AppTexts.DELETE_USER_SUCCESS,
      'Cerrar',
      expect.objectContaining({ duration: 3000 })
    );
    expect(callback).toHaveBeenCalled();
  });
});
