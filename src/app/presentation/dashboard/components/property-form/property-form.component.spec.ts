import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyFormComponent } from './property-form.component';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PropertyService } from '@infrastructure/services/property.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Propiedad } from '@infrastructure/services/property.service';

describe('PropertyFormComponent', () => {
  let component: PropertyFormComponent;
  let fixture: ComponentFixture<PropertyFormComponent>;

  if (!HTMLElement.prototype.animate) {
    HTMLElement.prototype.animate = () =>
      ({ play: () => { }, cancel: () => { }, addEventListener: () => { } }) as any;
  }

  const mockDialogRef = { close: jest.fn() };
  const mockPropertyService = {
    create: jest.fn(() => of({})),
    update: jest.fn(() => of({}))
  };

  const propiedadEdit: Propiedad = {
    id: 10,
    titulo: 'Casa Demo',
    descripcion: 'Detalles',
    tipo: 'Apartamento',
    estado: 'Disponible',
    ubicacion: 'Centro',
    precio: 1000000
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PropertyFormComponent, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { modo: 'crear', propiedad: undefined } }
      ]
    });

    fixture = TestBed.createComponent(PropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
    expect(component.modo).toBe('crear');
  });

  it('debería guardar y cerrar el diálogo en modo crear', () => {
    component.form.patchValue({
      titulo: 'Nueva propiedad',
      descripcion: '',
      tipo: 'Casa',
      estado: 'Disponible',
      ubicacion: 'Barrio Norte',
      precio: 450000
    });

    component.guardar();

    expect(mockPropertyService.create).toHaveBeenCalledWith(expect.objectContaining({ titulo: 'Nueva propiedad' }));
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('debería guardar y cerrar el diálogo en modo editar', () => {
    component.modo = 'editar';
    component.propiedadOriginal = propiedadEdit;

    component.form.patchValue({
      titulo: 'Casa actualizada',
      descripcion: 'Detalles',
      tipo: 'Casa',
      estado: 'Disponible',
      ubicacion: 'Centro',
      precio: 900000
    });

    component.guardar();

    expect(mockPropertyService.update).toHaveBeenCalledWith(10, expect.objectContaining({ titulo: 'Casa actualizada' }));
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('debería cerrar el diálogo al cancelar', () => {
    component.cancelar();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});

describe('PropertyFormComponent en modo editar', () => {
  let component: PropertyFormComponent;
  let fixture: ComponentFixture<PropertyFormComponent>;

  const propiedadEdit: Propiedad = {
    id: 10,
    titulo: 'Casa Demo',
    descripcion: 'Detalles',
    tipo: 'Apartamento',
    estado: 'Disponible',
    ubicacion: 'Centro',
    precio: 1000000
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PropertyFormComponent, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: PropertyService, useValue: {} },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { modo: 'editar', propiedad: propiedadEdit } }
      ]
    });

    fixture = TestBed.createComponent(PropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar datos iniciales en modo editar', () => {
    expect(component.form.get('titulo')?.value).toBe('Casa Demo');
    expect(component.form.get('precio')?.value).toBe(1000000);
    expect(component.modo).toBe('editar');
  });
});
