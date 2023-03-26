import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Injectable({
  providedIn: 'root',
})
export class NativeBarcodeScannerService {
  constructor() {}

  async isSupported(): Promise<boolean> {
    const { supported } = await BarcodeScanner.isSupported();
    return supported;
  }

  async scan(): Promise<string[]> {
    const { barcodes } = await BarcodeScanner.scan();
    return barcodes.map((barcode) => barcode.rawValue);
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }
}
