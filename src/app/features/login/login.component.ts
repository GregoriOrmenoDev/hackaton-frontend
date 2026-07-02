import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  usuario  = '';
  password = '';
  error    = '';
  loading  = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error   = '';
    this.loading = true;

    this.auth.login(this.usuario, this.password).subscribe(user => {
      this.loading = false;
      if (user) {
        this.router.navigate(['/productos']); // Redirige al módulo principal
      } else {
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
