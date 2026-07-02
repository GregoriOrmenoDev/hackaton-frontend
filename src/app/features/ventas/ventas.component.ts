import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../core/services/venta.service';
import { ProductoService } from '../../core/services/producto.service';
import { ClienteService } from '../../core/services/cliente.service';
import { AuthService } from '../../core/services/auth.service';
import { Venta, Producto, Cliente, VentaRequest } from '../../core/models/models';

// Item del carrito (antes de enviar al backend)
interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit {

  // ---- Historial ----
  ventas: Venta[]    = [];
  loadingVentas      = false;

  // ---- Nueva venta ----
  showFormVenta      = false;
  clientes: Cliente[]  = [];
  productos: Producto[] = [];
  idClienteSeleccionado = 0;
  carrito: ItemCarrito[] = [];
  productoSeleccionadoId = 0;
  cantidadSeleccionada   = 1;
  mensaje = '';
  guardando = false;

  constructor(
    private ventaSvc: VentaService,
    private productoSvc: ProductoService,
    private clienteSvc: ClienteService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.loadingVentas = true;
    this.ventaSvc.getAll().subscribe({
      next: data => { this.ventas = data; this.loadingVentas = false; },
      error: ()   => { this.mensaje = 'Error al cargar ventas'; this.loadingVentas = false; }
    });
  }

  // Abre el formulario de nueva venta y carga los datos necesarios
  nuevaVenta() {
    this.carrito                  = [];
    this.idClienteSeleccionado    = 0;
    this.productoSeleccionadoId   = 0;
    this.cantidadSeleccionada     = 1;
    this.mensaje                  = '';

    // Carga clientes y productos en paralelo
    this.clienteSvc.getAll().subscribe(c => this.clientes = c);
    this.productoSvc.getAll().subscribe(p => this.productos = p);

    this.showFormVenta = true;
  }

  // Agrega un producto al carrito
  agregarAlCarrito() {
    if (!this.productoSeleccionadoId || this.cantidadSeleccionada < 1) return;

    const producto = this.productos.find(p => p.idProducto === +this.productoSeleccionadoId);
    if (!producto) return;

    // Si ya está en el carrito, suma la cantidad
    const existente = this.carrito.find(i => i.producto.idProducto === producto.idProducto);
    if (existente) {
      existente.cantidad += this.cantidadSeleccionada;
    } else {
      this.carrito.push({ producto, cantidad: this.cantidadSeleccionada });
    }

    // Resetea la selección
    this.productoSeleccionadoId = 0;
    this.cantidadSeleccionada   = 1;
  }

  quitarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  // Calcula el total del carrito
  get totalCarrito(): number {
    return this.carrito.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
  }

  // Registra la venta
  registrarVenta() {
    if (!this.idClienteSeleccionado) { this.mensaje = 'Selecciona un cliente'; return; }
    if (this.carrito.length === 0)   { this.mensaje = 'Agrega al menos un producto'; return; }

    const usuario = this.auth.getUser();
    if (!usuario?.idUsuario)         { this.mensaje = 'No hay usuario en sesión'; return; }

    const request: VentaRequest = {
      idCliente: +this.idClienteSeleccionado,
      idUsuario: usuario.idUsuario,
      detalles: this.carrito.map(i => ({
        idProducto: i.producto.idProducto!,
        cantidad:   i.cantidad
      }))
    };

    this.guardando = true;
    this.ventaSvc.create(request).subscribe({
      next: venta => {
        this.mensaje       = `Venta #${venta.idVenta} registrada. Total: S/. ${venta.total}`;
        this.showFormVenta = false;
        this.guardando     = false;
        this.cargarVentas();
      },
      error: e => {
        this.mensaje   = 'Error: ' + (e.error || e.message);
        this.guardando = false;
      }
    });
  }

  cancelarVenta() {
    this.showFormVenta = false;
  }
}
