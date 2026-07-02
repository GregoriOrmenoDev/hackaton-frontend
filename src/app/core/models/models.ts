// ============================================================
// MODELOS: interfaces que mapean exactamente el JSON del backend
// Si agregas un campo en la BD y en el backend, agrégalo aquí también
// ============================================================

export interface Usuario {
  idUsuario?: number;
  nombre: string;
  usuario: string;
  password: string;
  rol: string;       // 'ADMIN' | 'VENDEDOR'
  estado?: boolean;
}

export interface Cliente {
  idCliente?: number;
  nombre: string;
  dni: string;
  telefono?: string;
  email?: string;
  estado?: boolean;
}

export interface Producto {
  idProducto?: number;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precio: number;
  stock: number;
  estado?: boolean;
}

export interface DetalleVenta {
  idDetalle?: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Venta {
  idVenta?: number;
  fecha?: string;
  cliente: Cliente;
  usuario: Usuario;
  total: number;
  detalles: DetalleVenta[];
}

// DTO para crear una venta (lo que enviamos al backend)
export interface VentaRequest {
  idCliente: number;
  idUsuario: number;
  detalles: { idProducto: number; cantidad: number }[];
}
