import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

    this.propertyService.create(this.form.value as Propiedad).subscribe(() => {
      this.propiedadCreada.emit();
      this.dialogRef.close(); // Cierra el modal al guardar
    });
  }

  cancelar(): void {
    this.dialogRef.close(); // Cierra el modal al cancelar
  }
}
