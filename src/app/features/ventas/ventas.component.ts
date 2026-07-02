import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../core/services/venta.service';
import { ProductoService } from '../../core/services/producto.service';
import { CareerService } from '../../core/services/career.service';
import { AuthService } from '../../core/services/auth.service';
import { Venta, Producto, Career, VentaRequest } from '../../core/models/models';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit {

  matriculas: Venta[] = [];
  loadingVentas = false;
  showFormVenta = false;
  mensaje = '';
  guardando = false;

  estudiantes: Producto[] = [];
  carreras: Career[] = [];

  form = {
    studentId: 0,
    careerId: 0,
    venueName: '',
    promoter: '',
    price: 0
  };

  constructor(
    private ventaSvc: VentaService,
    private productoSvc: ProductoService,
    private careerSvc: CareerService,
    public auth: AuthService
  ) {}

  ngOnInit() { this.cargarMatriculas(); }

  cargarMatriculas() {
    this.loadingVentas = true;
    this.ventaSvc.getAll().subscribe({
      next: data => { this.matriculas = data; this.loadingVentas = false; },
      error: ()   => { this.mensaje = 'Error al cargar matrículas'; this.loadingVentas = false; }
    });
  }

  nuevaMatricula() {
    this.form = { studentId: 0, careerId: 0, venueName: '', promoter: '', price: 0 };
    this.mensaje = '';
    this.productoSvc.getAll().subscribe(e => this.estudiantes = e);
    this.careerSvc.getAll().subscribe(c => this.carreras = c);
    this.showFormVenta = true;
  }

  registrarMatricula() {
    if (!this.form.studentId) { this.mensaje = 'Selecciona un estudiante'; return; }
    if (!this.form.careerId)  { this.mensaje = 'Selecciona una carrera'; return; }
    if (!this.form.venueName) { this.mensaje = 'Ingresa la sede'; return; }

    const request: VentaRequest = {
      studentId: +this.form.studentId,
      careerId:  +this.form.careerId,
      venueName: this.form.venueName,
      promoter:  this.form.promoter,
      price:     +this.form.price
    };

    this.guardando = true;
    this.ventaSvc.create(request).subscribe({
      next: m => {
        this.mensaje = `Matrícula #${m.idVenta} registrada correctamente`;
        this.showFormVenta = false;
        this.guardando = false;
        this.cargarMatriculas();
      },
      error: e => {
        this.mensaje = 'Error: ' + (e.error || e.message);
        this.guardando = false;
      }
    });
  }

  cancelar() { this.showFormVenta = false; }
}
