export interface Usuario {
  idUsuario?: number;
  nombre: string;
  usuario: string;
  password: string;
  rol: string;
  estado?: boolean;
}

// Estudiante (tabla maestra)
export interface Producto {
  idProducto?: number;
  nombre: string;       // name
  descripcion?: string; // DNI
  categoria?: string;   // phone
  email?: string;
  estado?: boolean;
}

// Carrera
export interface Career {
  idCareer?: number;
  career: string;
  cycles?: string;
  investment?: number;
}

// Cliente reutilizado para carreras en el selector
export interface Cliente {
  idCliente?: number;
  nombre: string;
  dni: string;
  telefono?: string;
  email?: string;
  estado?: boolean;
}

// Matricula
export interface Venta {
  idVenta?: number;
  estudiante?: Producto;
  carrera?: Career;
  venueName?: string;
  promoter?: string;
  total?: number;
  estado?: boolean;
  createdAt?: string;
}

// DTO para registrar matricula
export interface VentaRequest {
  studentId: number;
  careerId: number;
  venueName: string;
  promoter: string;
  price: number;
}

export interface DetalleVenta {
  idDetalle?: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}
