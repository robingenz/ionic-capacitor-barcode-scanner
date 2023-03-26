import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { NativeBarcodeScannerService } from './native-barcode-scanner.service';
import { WebBarcodeScannerService } from './web-barcode-scanner.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  supported = false;
  barcodes: string[] = [];

  constructor(
    private alertController: AlertController,
    private nativeBarcodeScannerService: NativeBarcodeScannerService,
    private webBarcodeScannerService: WebBarcodeScannerService
  ) {}

  ngOnInit() {
    this.isSupported().then((supported) => {
      this.supported = supported;
    });
  }

  async isSupported(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      return this.nativeBarcodeScannerService.isSupported();
    } else {
      return this.webBarcodeScannerService.isSupported();
    }
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    if (Capacitor.isNativePlatform()) {
      this.barcodes = await this.nativeBarcodeScannerService.scan();
    } else {
      this.barcodes = await this.webBarcodeScannerService.scan();
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      return this.nativeBarcodeScannerService.requestPermissions();
    } else {
      return this.webBarcodeScannerService.requestPermissions();
    }
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
