import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@Injectable({
  providedIn: 'root',
})
export class WebBarcodeScannerService {
  constructor(private modalController: ModalController) {}

  async isSupported(): Promise<boolean> {
    return 'BarcodeDetector' in window;
  }

  async scan(): Promise<string[]> {
    const element = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      showBackdrop: false,
    });
    return new Promise<string[]>((resolve) => {
      element.onDidDismiss().then((result) => {
        const barcodes: string[] = result.data?.barcodes || [];
        resolve(barcodes);
      });
      element.present();
    });
  }

  async requestPermissions(): Promise<boolean> {
    await new Promise<void>((resolve) => {
      navigator.mediaDevices.getUserMedia({ video: true }).finally(() => {
        resolve();
      });
    });
    const permission = await window.navigator.permissions.query({
      name: 'camera' as any,
    });
    return permission.state === 'granted';
  }
}
