import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Colaborador {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  rol: 'Administrador' | 'Trabajador';
  isPrincipal?: boolean; // Para proteger al admin principal
}
@Component({
  selector: 'app-gestion-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-personal.html',
  styleUrl: './gestion-personal.css',
})
export class GestionPersonal implements OnInit {

  colaboradores: Colaborador[] = [
    { id: 1, nombres: 'Cristian', apellidos: 'Admin', dni: '11111111', rol: 'Administrador', isPrincipal: true },
    { id: 2, nombres: 'Juan', apellidos: 'Trabajador', dni: '22222222', rol: 'Trabajador' }
  ];

  showModal: boolean = false;
  personalForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Validadores para el botón de enviar
    this.personalForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      rol: ['Trabajador', Validators.required]
    });
  }

  // --- RESTRICCIÓN EN TIEMPO REAL: Solo Letras ---
  onTextInput(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    // Remueve todo lo que NO sea letra (mayúscula/minúscula), espacio o acento
    const newValue = inputElement.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.personalForm.get(controlName)?.setValue(newValue, { emitEvent: false });
  }

  // --- RESTRICCIÓN EN TIEMPO REAL: Solo Números ---
  onNumberInput(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    // Remueve todo lo que NO sea número (0-9)
    const newValue = inputElement.value.replace(/[^0-9]/g, '');
    this.personalForm.get(controlName)?.setValue(newValue, { emitEvent: false });
  }

  getInicial(nombre: string): string {
    return nombre ? nombre.charAt(0).toUpperCase() : '';
  }

  openModal(): void {
    this.personalForm.reset({ rol: 'Trabajador' }); 
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveColaborador(): void {
    if (this.personalForm.valid) {
      const nuevoColaborador: Colaborador = {
        id: this.colaboradores.length + 1,
        nombres: this.personalForm.value.nombres,
        apellidos: this.personalForm.value.apellidos,
        dni: this.personalForm.value.dni,
        rol: this.personalForm.value.rol
      };
      
      this.colaboradores.push(nuevoColaborador);
      alert('Colaborador registrado exitosamente.');
      this.closeModal();
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  deleteColaborador(id: number): void {
    const isConfirmed = confirm('¿Está seguro de eliminar a este colaborador?');
    if (isConfirmed) {
      this.colaboradores = this.colaboradores.filter(c => c.id !== id);
    }
  }

  changeRole(colaborador: Colaborador, event: any): void {
    const nuevoRol = event.target.value;
    colaborador.rol = nuevoRol;
  }
}
