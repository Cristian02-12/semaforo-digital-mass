import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css',
})
export class Alertas {
  lotesCriticos = [
    { id: 1, producto: 'Yogur Fresa Gloria 1L', sku: '7751271036290', cantidad: 5, vencimiento: '25/08/2026' },
    { id: 2, producto: 'Pan de Molde Bimbo', sku: '7750106182607', cantidad: 3, vencimiento: '23/08/2026' },
    { id: 3, producto: 'Gaseosa Inca Kola de 1.5 L', sku: '7751271036290', cantidad: 8, vencimiento: '29/08/2026' }
  ];

  selectedAlert: any = null;

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
}
