import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

import { PropertyService, Propiedad } from '@infrastructure/services/property.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class PropertyFormComponent {
  @Output() propiedadCreada = new EventEmitter<void>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private dialogRef: MatDialogRef<PropertyFormComponent>
  ) {
    this.form = this.fb.group(
      {
        titulo: ['', [Validators.required, Validators.pattern(/\S+/)]],
        descripcion: [''],
        tipo: ['', Validators.required],
        estado: ['', Validators.required],
        ubicacion: ['', [Validators.required, Validators.pattern(/\S+/)]],
        precio: [null, [Validators.required, Validators.min(0)]]
      },
      { updateOn: 'blur' }
    );
  }

  guardar(): void {
    if (this.form.invalid) return;

    const propiedad: Propiedad = {
      ...this.form.value,
      agenteId: undefined // El backend asigna el agente automáticamente según el token
    };

    this.propertyService.create(propiedad).subscribe(() => {
      this.propiedadCreada.emit();
      this.dialogRef.close();
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
