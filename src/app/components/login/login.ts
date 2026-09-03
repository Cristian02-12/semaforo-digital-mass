import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Inicializamos el formulario reactivo con validación de 8 dígitos
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });
  }

  // Función para restringir la entrada solo a números y máximo 8 caracteres
  onDniInput(event: any): void {
    let inputValue = event.target.value;
    
    // Reemplaza cualquier carácter que NO sea un número (0-9) por vacío
    inputValue = inputValue.replace(/[^0-9]/g, '');
    
    // Limita la longitud máxima a 8 dígitos
    if (inputValue.length > 8) {
      inputValue = inputValue.substring(0, 8);
    }
    
    // Actualiza el valor en el formulario y en el input visualmente
    this.loginForm.get('dni')?.setValue(inputValue, { emitEvent: false });
    event.target.value = inputValue;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const dniValue = this.loginForm.get('dni')?.value;
      console.log('Iniciando sesión con DNI:', dniValue);
      // Aquí irá luego la conexión con Spring Boot
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
