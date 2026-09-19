import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingreso-lotes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingreso-lotes.html',
  styleUrl: './ingreso-lotes.css',
})
export class IngresoLotes implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  loteForm!: FormGroup;
  isScanning: boolean = false;
  showModal: boolean = false;
  cameraStream: MediaStream | null = null;
  cameraError: string = '';

  // Producto simulado al encontrar una coincidencia
  productoActual: any = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loteForm = this.fb.group({
      skuManual: [''],
      unidades: ['', [Validators.required, Validators.min(1)]],
      fechaVencimiento: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  // --- LÓGICA DE LA CÁMARA ---
  async startScanner(): Promise<void> {
    this.isScanning = true;
    this.cameraError = '';
    try {
      // Solicita acceso a la cámara trasera (ideal para móviles)
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.cameraStream;
      }

      // Simulación de escaneo exitoso después de 3 segundos para el prototipo
      setTimeout(() => {
        if (this.isScanning) {
          this.stopCamera();
          this.triggerSuccessModal('7751271036290', 'Yogur Griego Fresa 1L');
        }
      }, 3000);

    } catch (err) {
      console.error('Error accediendo a la cámara: ', err);
      this.cameraError = 'No se pudo acceder a la cámara. Verifique los permisos.';
      this.isScanning = false;
    }
  }

  stopCamera(): void {
    this.isScanning = false;
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
  }

  // --- LÓGICA MANUAL ---
  searchManual(): void {
    const sku = this.loteForm.get('skuManual')?.value;
    if (sku && sku.length > 5) {
      // Simulamos la búsqueda en BD
      this.triggerSuccessModal(sku, 'Producto Genérico (Búsqueda Manual)');
    } else {
      alert('Ingrese un código de barras válido para buscar.');
    }
  }

  // --- LÓGICA DEL MODAL ---
  triggerSuccessModal(sku: string, nombre: string): void {
    this.productoActual = { sku, nombre };
    this.loteForm.patchValue({ unidades: '', fechaVencimiento: '' });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productoActual = null;
  }

  saveLote(): void {
    if (this.loteForm.valid) {
      const datosGuardar = {
        producto: this.productoActual,
        unidades: this.loteForm.get('unidades')?.value,
        fechaVencimiento: this.loteForm.get('fechaVencimiento')?.value
      };
      console.log('Guardando en BD:', datosGuardar);
      
      alert('Lote guardado correctamente. Registrado para Auditoría.');
      this.closeModal();
      this.loteForm.get('skuManual')?.setValue('');
    } else {
      this.loteForm.markAllAsTouched();
    }
  }
}
