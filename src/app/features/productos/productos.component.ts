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

  // Lista de productos que se muestra en la tabla
  productos: Producto[] = [];
  loading = false;
  mensaje = '';

  // Controla si el formulario de crear/editar está visible
  showForm = false;
  editando = false;

  // Objeto vacío que se rellena al crear o editar
  form: Producto = this.emptyForm();

  // ---- Importación ----
  archivoImport: File | null = null;

  constructor(private svc: ProductoService) {}

  ngOnInit() {
    this.cargar();
  }

  // Llama al backend y carga la lista
  cargar() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: data => { this.productos = data; this.loading = false; },
      error: ()   => { this.mensaje = 'Error al cargar productos'; this.loading = false; }
    });
  }

  // Abre el formulario vacío para crear
  nuevo() {
    this.form    = this.emptyForm();
    this.editando = false;
    this.showForm = true;
  }

  // Rellena el formulario con los datos del producto a editar
  editar(p: Producto) {
    this.form     = { ...p };   // copia para no modificar el original
    this.editando  = true;
    this.showForm  = true;
  }

  // Guarda (crea o actualiza según el modo)
  guardar() {
    if (this.editando) {
      this.svc.update(this.form.idProducto!, this.form).subscribe({
        next: () => { this.mensaje = 'Producto actualizado'; this.showForm = false; this.cargar(); },
        error: e => { this.mensaje = 'Error: ' + (e.error || e.message); }
      });
    } else {
      this.svc.create(this.form).subscribe({
        next: () => { this.mensaje = 'Producto creado'; this.showForm = false; this.cargar(); },
        error: e => { this.mensaje = 'Error: ' + (e.error || e.message); }
      });
    }
  }

  // Baja lógica (cambia estado a false en el backend)
  eliminar(p: Producto) {
    if (!confirm(`¿Desactivar "${p.nombre}"?`)) return;
    this.svc.delete(p.idProducto!).subscribe({
      next: () => { this.mensaje = 'Producto desactivado'; this.cargar(); },
      error: ()  => { this.mensaje = 'Error al eliminar'; }
    });
  }

  cancelar() {
    this.showForm = false;
  }

  // ---- Exportar ----
  exportarExcel() {
    this.svc.exportarExcel().subscribe(blob => this.descargar(blob, 'productos.xlsx'));
  }
  exportarPDF() {
    this.svc.exportarPDF().subscribe(blob => this.descargar(blob, 'productos.pdf'));
  }

  // Crea un link temporal para descargar el archivo
  private descargar(blob: Blob, nombre: string) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---- Importar ----
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
    return { nombre: '', descripcion: '', categoria: '', precio: 0, stock: 0, estado: true };
  }
}
