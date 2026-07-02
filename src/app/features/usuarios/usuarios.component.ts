import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  loading  = false;
  mensaje  = '';
  showForm = false;
  editando = false;
  form: Usuario = this.emptyForm();

  constructor(private svc: UsuarioService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: data => { this.usuarios = data; this.loading = false; },
      error: ()   => { this.mensaje = 'Error al cargar'; this.loading = false; }
    });
  }

  nuevo()        { this.form = this.emptyForm(); this.editando = false; this.showForm = true; }
  editar(u: Usuario) { this.form = { ...u }; this.editando = true; this.showForm = true; }
  cancelar()     { this.showForm = false; }

  guardar() {
    const obs = this.editando
      ? this.svc.update(this.form.idUsuario!, this.form)
      : this.svc.create(this.form);

    obs.subscribe({
      next: () => { this.mensaje = this.editando ? 'Usuario actualizado' : 'Usuario creado'; this.showForm = false; this.cargar(); },
      error: e  => { this.mensaje = 'Error: ' + (e.error || e.message); }
    });
  }

  eliminar(u: Usuario) {
    if (!confirm(`¿Desactivar a "${u.nombre}"?`)) return;
    this.svc.delete(u.idUsuario!).subscribe({
      next: () => { this.mensaje = 'Usuario desactivado'; this.cargar(); },
      error: ()  => { this.mensaje = 'Error al eliminar'; }
    });
  }

  private emptyForm(): Usuario {
    return { nombre: '', usuario: '', password: '', rol: 'VENDEDOR' };
  }
}
