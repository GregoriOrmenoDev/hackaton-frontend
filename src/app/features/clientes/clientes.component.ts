import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../core/models/models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  loading  = false;
  mensaje  = '';
  showForm = false;
  editando = false;
  form: Cliente = this.emptyForm();

  constructor(private svc: ClienteService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: data => { this.clientes = data; this.loading = false; },
      error: ()   => { this.mensaje = 'Error al cargar'; this.loading = false; }
    });
  }

  nuevo()       { this.form = this.emptyForm(); this.editando = false; this.showForm = true; }
  editar(c: Cliente) { this.form = { ...c }; this.editando = true; this.showForm = true; }
  cancelar()    { this.showForm = false; }

  guardar() {
    const obs = this.editando
      ? this.svc.update(this.form.idCliente!, this.form)
      : this.svc.create(this.form);

    obs.subscribe({
      next: () => { this.mensaje = this.editando ? 'Cliente actualizado' : 'Cliente creado'; this.showForm = false; this.cargar(); },
      error: e  => { this.mensaje = 'Error: ' + (e.error || e.message); }
    });
  }

  eliminar(c: Cliente) {
    if (!confirm(`¿Desactivar a "${c.nombre}"?`)) return;
    this.svc.delete(c.idCliente!).subscribe({
      next: () => { this.mensaje = 'Cliente desactivado'; this.cargar(); },
      error: ()  => { this.mensaje = 'Error al eliminar'; }
    });
  }

  private emptyForm(): Cliente {
    return { nombre: '', dni: '', telefono: '', email: '' };
  }
}
