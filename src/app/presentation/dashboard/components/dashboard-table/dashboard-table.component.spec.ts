import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardTableComponent } from './dashboard-table.component';
import { MatTableDataSource } from '@angular/material/table';

describe('DashboardTableComponent', () => {
  let component: DashboardTableComponent<any>;
  let fixture: ComponentFixture<DashboardTableComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardTableComponent]
    });

    fixture = TestBed.createComponent(DashboardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería asignar el dataSource y conectar paginador', () => {
    const ds = new MatTableDataSource([{ id: 1 }]);
    component.dataSource = ds;
    expect(component.dataSource.data.length).toBe(1);
  });

  it('debería emitir evento editar', () => {
    const spy = jest.spyOn(component.editar, 'emit');
    const row = { id: 1 };
    component.onEditar(row);
    expect(spy).toHaveBeenCalledWith(row);
  });

  it('debería emitir evento eliminar', () => {
    const spy = jest.spyOn(component.eliminar, 'emit');
    const row = { id: 2 };
    component.onEliminar(row);
    expect(spy).toHaveBeenCalledWith(row);
  });

  it('debería resolver plantilla por clave', () => {
    expect(component.resolveTemplate('inexistente')).toBe(component.defaultCell);
  });
});
