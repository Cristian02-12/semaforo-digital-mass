import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IngresoLotes } from '../ingreso-lotes/ingreso-lotes';
import { Auditoria } from '../auditoria/auditoria';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IngresoLotes, Auditoria],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  role: 'admin' | 'worker' = 'worker';
  userName: string = 'Usuario';
  
  isMobileMenuOpen: boolean = false;
  isChatOpen: boolean = false;
  selectedAlert: any = null;

  currentView: 'alertas' | 'ingreso' | 'auditoria' = 'alertas';
  
  screenWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1200; 

  lotesCriticos = [
    { id: 1, producto: 'Yogur Fresa Gloria 1L', sku: '7751271036290', cantidad: 5, vencimiento: '25/08/2026' },
    { id: 2, producto: 'Pan de Molde Bimbo', sku: '7750106182607', cantidad: 3, vencimiento: '23/08/2026' },
    { id: 3, producto: 'Gaseosa Inca Kola de 1.5 L', sku: '7751271036290', cantidad: 8, vencimiento: '29/08/2026' }
  ];

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
        this.router.navigate(['/login']);
      }
    }
  }

  changeView(view: 'alertas' | 'ingreso' | 'auditoria'): void {
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

  openAlertModal(lote: any): void {
    this.selectedAlert = lote;
  }

  closeModal(): void {
    this.selectedAlert = null;
  }

  resolveAlert(action: string): void {
    const isConfirmed = confirm(`¿Estás seguro de registrar esta acción: ${action}?`);
    if (isConfirmed) {
      alert('Acción registrada con éxito. El lote ha sido gestionado.');
      this.closeModal();
    }
  }

  logout(): void {
    const isConfirmed = confirm('¿Estás seguro de cerrar sesión?');
    if (isConfirmed) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
