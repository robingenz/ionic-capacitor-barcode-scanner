import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-barcode-scanning',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Scanning</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <video #stream style="width: 100%; height: 100%;"></video>
    </ion-content>
  `,
})
export class BarcodeScanningModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stream') streamElement: ElementRef<HTMLVideoElement> | undefined;
  intervalId: number | undefined;
  stream: MediaStream | undefined;

  constructor(private modalController: ModalController) {}

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.startScan();
    }, 250);
  }

  public ngOnDestroy(): void {
    this.stopScan();
  }

  public async closeModal(barcodes?: string[]): Promise<void> {
    this.modalController.dismiss({
      barcodes: barcodes || [],
    });
  }

  private async startScan(): Promise<void> {
    if (!('BarcodeDetector' in window)) {
      return;
    }
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: 'environment',
        },
      },
      audio: false,
    });
    const videoElement = this.streamElement?.nativeElement;
    if (!videoElement) {
      return;
    }
    videoElement.srcObject = this.stream;
    await videoElement.play();
    const barcodeDetector = new (window.BarcodeDetector as any)({
      formats: ['qr_code'],
    });
    this.intervalId = window.setInterval(async () => {
      const barcodes = await barcodeDetector.detect(videoElement);
      console.log(barcodes);
      if (barcodes.length === 0) {
        return;
      } else {
        const values = barcodes.map((barcode: any) => barcode.rawValue);
        this.closeModal(values);
      }
    }, 1000);
  }

  private async stopScan(): Promise<void> {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
}

declare global {
  interface Window {
    BarcodeDetector: any;
  }
}
