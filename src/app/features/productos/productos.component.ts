import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/models';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  loading = false;
  mensaje = '';
  showForm = false;
  editando = false;
  form: Producto = this.emptyForm();
  archivoImport: File | null = null;

  constructor(private svc: ProductoService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: data => { this.productos = data; this.loading = false; },
      error: ()   => { this.mensaje = 'Error al cargar estudiantes'; this.loading = false; }
    });
  }

  nuevo() { this.form = this.emptyForm(); this.editando = false; this.showForm = true; }

  editar(p: Producto) { this.form = { ...p }; this.editando = true; this.showForm = true; }

  guardar() {
    if (this.editando) {
      this.svc.update(this.form.idProducto!, this.form).subscribe({
        next: () => { this.mensaje = 'Estudiante actualizado'; this.showForm = false; this.cargar(); },
        error: e => { this.mensaje = 'Error: ' + (e.error || e.message); }
      });
    } else {
      this.svc.create(this.form).subscribe({
        next: () => { this.mensaje = 'Estudiante registrado'; this.showForm = false; this.cargar(); },
        error: e => { this.mensaje = 'Error: ' + (e.error || e.message); }
      });
    }
  }

  eliminar(p: Producto) {
    if (!confirm(`¿Desactivar a "${p.nombre}"?`)) return;
    this.svc.delete(p.idProducto!).subscribe({
      next: () => { this.mensaje = 'Estudiante desactivado'; this.cargar(); },
      error: ()  => { this.mensaje = 'Error al eliminar'; }
    });
  }

  cancelar() { this.showForm = false; }

  exportarExcel() { this.svc.exportarExcel().subscribe(blob => this.descargar(blob, 'estudiantes.xlsx')); }
  exportarPDF()   { this.svc.exportarPDF().subscribe(blob => this.descargar(blob, 'estudiantes.pdf')); }

  private descargar(blob: Blob, nombre: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nombre; a.click();
    URL.revokeObjectURL(url);
  }

  onArchivoSeleccionado(e: Event) {
    const input = e.target as HTMLInputElement;
    this.archivoImport = input.files?.[0] ?? null;
  }

  importarCSV() {
    if (!this.archivoImport) return;
    this.svc.importarCSV(this.archivoImport).subscribe({
      next: msg => { this.mensaje = String(msg); this.cargar(); },
      error: ()  => { this.mensaje = 'Error al importar CSV'; }
    });
  }

  importarExcel() {
    if (!this.archivoImport) return;
    this.svc.importarExcel(this.archivoImport).subscribe({
      next: msg => { this.mensaje = String(msg); this.cargar(); },
      error: ()  => { this.mensaje = 'Error al importar Excel'; }
    });
  }

  private emptyForm(): Producto {
    return { nombre: '', descripcion: '', categoria: '', email: '', estado: true };
  }
}
