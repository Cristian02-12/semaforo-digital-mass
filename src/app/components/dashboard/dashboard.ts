import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Importación de todos tus sub-componentes modulares
import { Alertas } from '../alertas/alertas';
import { IngresoLotes } from '../ingreso-lotes/ingreso-lotes';
import { Auditoria } from '../auditoria/auditoria';
import { GestionPersonal } from '../gestion-personal/gestion-personal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Alertas, IngresoLotes, Auditoria, GestionPersonal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  role: 'admin' | 'worker' = 'worker';
  userName: string = 'Usuario';
  
  isMobileMenuOpen: boolean = false;
  isChatOpen: boolean = false;
  
  // Controlador de las vistas
  currentView: 'alertas' | 'ingreso' | 'auditoria' | 'personal' = 'alertas';
  
  screenWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1200; 

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedRole = localStorage.getItem('userRole');
      
      if (savedRole === 'admin') {
        this.role = 'admin';
        this.userName = 'Cristian';
      } else if (savedRole === 'worker') {
        this.role = 'worker';
        this.userName = 'Juan';
      } else {
        // Redirige al login si no hay sesión
        this.router.navigate(['/login']);
      }
    }
  }

  changeView(view: 'alertas' | 'ingreso' | 'auditoria' | 'personal'): void {
    this.currentView = view;
    if (this.isMobile()) {
      this.isMobileMenuOpen = false; // Cierra el menú en móvil tras hacer clic
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.isMobile() && this.isMobileMenuOpen) {
      this.isChatOpen = false;
    }
  }

  isMobile(): boolean {
    return this.screenWidth <= 991;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isChatOpen = false;
    }
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  logout(): void {
    const isConfirmed = confirm('¿Estás seguro de cerrar sesión?');
    if (isConfirmed) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
