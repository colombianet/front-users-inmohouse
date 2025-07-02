import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { PropertyService } from '@infrastructure/services/property.service';
import { Propiedad } from '@domain/models/propiedad.model';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent {
  form = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    tipo: ['', Validators.required],
    precio: [null, [Validators.required, Validators.min(1)]],
    ubicacion: ['', Validators.required],
    estado: ['Disponible', Validators.required]
  });

  constructor(private fb: FormBuilder, private service: PropertyService) {}

  publish(): void {
  if (this.form.valid) {
    const raw = this.form.getRawValue();

    const propiedad: Propiedad = {
      titulo: raw.titulo ?? '',
      descripcion: raw.descripcion ?? '',
      tipo: raw.tipo ?? '',
      precio: raw.precio ?? 0,
      ubicacion: raw.ubicacion ?? '',
      estado: raw.estado ?? '',
      agenteId: 2,
      clienteId: null
    };

    this.service.create(propiedad).subscribe(() => {
      this.form.reset({ estado: 'Disponible' });
    });
  }
}

}
