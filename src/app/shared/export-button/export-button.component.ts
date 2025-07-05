import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ExportService } from '@core/services/export.service';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.scss']
})
export class ExportButtonComponent {
  @Input() data: any[] = [];
  @Input() fileName: string = 'export';
  @Input() showPdf: boolean = true;
  @Input() showExcel: boolean = true;

  constructor(private exportService: ExportService) {}

  exportExcel(): void {
    this.exportService.exportAsExcelFile(this.data, this.fileName);
  }

  exportPdf(): void {
    this.exportService.exportAsPdfFile(this.data, this.fileName);
  }
}
