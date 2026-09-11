import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;

  // Inyectamos el Router en el constructor
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });
  }

  onDniInput(event: any): void {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');
    if (inputValue.length > 8) {
      inputValue = inputValue.substring(0, 8);
    }
    this.loginForm.get('dni')?.setValue(inputValue, { emitEvent: false });
    event.target.value = inputValue;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const dniValue = this.loginForm.get('dni')?.value;
      
      // Lógica temporal para roles usando el DNI
      if (dniValue === '11111111') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userDni', dniValue);
        this.router.navigate(['/dashboard']); // Redirige al Dashboard
      } else if (dniValue === '22222222') {
        localStorage.setItem('userRole', 'worker');
        localStorage.setItem('userDni', dniValue);
        this.router.navigate(['/dashboard']); // Redirige al Dashboard
      } else {
        // Alerta si ingresan un DNI no registrado en nuestra prueba
        alert('Credenciales incorrectas. Intente con DNI: 11111111 (Admin) o 22222222 (Operario)');
      }

    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
