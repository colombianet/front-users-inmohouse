import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '@infrastructure/services/user.service';
import { AuthService } from '@core/services/auth.service';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  // ✅ Polyfill animate
  if (!HTMLElement.prototype.animate) {
    HTMLElement.prototype.animate = () =>
      ({
        play: () => { },
        cancel: () => { },
        addEventListener: () => { }
      }) as any;
  }

  const mockDialogRef = { close: jest.fn() };
  const mockSnackBar = { open: jest.fn() };
  const mockUserService = {
    create: jest.fn(() => of({})),
    update: jest.fn(() => of({}))
  };
  const mockAuthService = {
    esAgente: jest.fn(() => false)
  };

  const mockData = {
    modo: 'crear',
    usuario: undefined
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserFormComponent, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    });

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cerrar el formulario si se guarda correctamente', () => {
    component.form.patchValue({
      nombre: 'Oscar',
      email: 'demo@mail.com',
      password: '123456',
      rol: 'ROLE_CLIENTE'
    });

    component.guardar();
    expect(mockUserService.create).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('debería cerrar el diálogo al cancelar', () => {
    component.cancelar();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
