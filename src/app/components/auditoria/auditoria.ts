import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AuditLog {
  id: number;
  fechaHora: string;
  tipo: 'INGRESO' | 'SALIDA';
  usuario: string;
  accion: string;
}

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
})
export class Auditoria implements OnInit {

  // Base de datos simulada (Historial)
  allLogs: AuditLog[] = [
    { id: 1, fechaHora: '22/08/2026 14:00', tipo: 'INGRESO', usuario: 'Juan Trabajador', accion: 'Ingreso Lote: 12x Leche UHT (SKU: 77510203040)' },
    { id: 2, fechaHora: '22/08/2026 15:30', tipo: 'SALIDA', usuario: 'Carlos Admin', accion: 'Resolución [Promoción]: 2x Queso Edam' },
    { id: 3, fechaHora: '22/08/2026 16:15', tipo: 'SALIDA', usuario: 'Juan Trabajador', accion: 'Resolución [Merma]: 1x Gaseosa Vencida' },
    { id: 4, fechaHora: '22/08/2026 18:00', tipo: 'INGRESO', usuario: 'Carlos Admin', accion: 'Ingreso Lote: 24x Yogur Fresa 1L' },
    { id: 5, fechaHora: '23/08/2026 08:30', tipo: 'INGRESO', usuario: 'Ana Trabajador', accion: 'Ingreso Lote: 50x Pan de Molde' },
    { id: 6, fechaHora: '23/08/2026 10:15', tipo: 'SALIDA', usuario: 'Ana Trabajador', accion: 'Resolución [Vendido]: 5x Atún Florida' },
    { id: 7, fechaHora: '23/08/2026 11:45', tipo: 'INGRESO', usuario: 'Juan Trabajador', accion: 'Ingreso Lote: 10x Mantequilla' },
    { id: 8, fechaHora: '24/08/2026 09:00', tipo: 'SALIDA', usuario: 'Carlos Admin', accion: 'Resolución [Merma]: 2x Pan Integral' },
    { id: 9, fechaHora: '24/08/2026 12:30', tipo: 'INGRESO', usuario: 'Ana Trabajador', accion: 'Ingreso Lote: 30x Fideos Don Vittorio' },
    { id: 10, fechaHora: '24/08/2026 15:00', tipo: 'SALIDA', usuario: 'Juan Trabajador', accion: 'Resolución [Promoción]: 3x Leche Evaporada' },
    { id: 11, fechaHora: '25/08/2026 07:45', tipo: 'INGRESO', usuario: 'Carlos Admin', accion: 'Ingreso Lote: 15x Avena Quaker' },
    { id: 12, fechaHora: '25/08/2026 09:15', tipo: 'SALIDA', usuario: 'Juan Trabajador', accion: 'Resolución [Merma]: 1x Yogur Griego' },
  ];

  filteredLogs: AuditLog[] = [];
  paginatedLogs: AuditLog[] = [];
  
  // Filtros y Paginación
  currentFilter: 'TODOS' | 'INGRESO' | 'SALIDA' = 'TODOS';
  searchTerm: string = '';
  
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  pagesArray: number[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }

  // Cambiar entre Todos, Ingresos o Salidas
  setFilter(filter: 'TODOS' | 'INGRESO' | 'SALIDA'): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  // Buscador de alto rendimiento (Se ejecuta al escribir)
  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  // Aplica los filtros y la búsqueda, luego recalcula la paginación
  applyFilters(): void {
    let result = this.allLogs;

    if (this.currentFilter !== 'TODOS') {
      result = result.filter(log => log.tipo === this.currentFilter);
    }

    if (this.searchTerm.trim() !== '') {
      result = result.filter(log => 
        log.usuario.toLowerCase().includes(this.searchTerm) ||
        log.accion.toLowerCase().includes(this.searchTerm) ||
        log.fechaHora.includes(this.searchTerm)
      );
    }

    this.filteredLogs = result;
    this.currentPage = 1; // Volver a la página 1 al filtrar
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    
    // Generar arreglo para los botones de paginación [1, 2, 3...]
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    
    this.extractPageData();
  }

  extractPageData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLogs = this.filteredLogs.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.extractPageData();
    }
  }
}
