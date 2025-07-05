import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CellInput } from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = '.xlsx';

  exportAsExcelFile(json: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}${this.EXCEL_EXTENSION}`);
  }

  exportAsPdfFile(json: any[], fileName: string): void {

    const headers: CellInput[][] = [Object.keys(json[0])];
    const rows: CellInput[][] = json.map(obj => Object.values(obj) as CellInput[]);

    const doc = new jsPDF();

    autoTable(doc, {
      head: headers,
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 20 }
    });

    doc.save(`${fileName}.pdf`);
  }
}
