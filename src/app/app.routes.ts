import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ProductosComponent } from './features/productos/productos.component';
import { ClientesComponent } from './features/clientes/clientes.component';
import { UsuariosComponent } from './features/usuarios/usuarios.component';
import { VentasComponent } from './features/ventas/ventas.component';

export const routes: Routes = [
  // Ruta pública
  { path: 'login', component: LoginComponent },

  // Rutas protegidas — requieren estar logueado
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'productos', component: ProductosComponent },
      { path: 'clientes',  component: ClientesComponent },
      { path: 'ventas',    component: VentasComponent },
      { path: 'usuarios',  component: UsuariosComponent },
      { path: '',          redirectTo: 'productos', pathMatch: 'full' }
    ]
  },

  // Cualquier otra ruta → login
  { path: '**', redirectTo: 'login' }
];
