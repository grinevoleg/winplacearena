"use client"

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface QRScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanSuccess: (data: string) => void;
}

export function QRScannerModal({ open, onOpenChange, onScanSuccess }: QRScannerModalProps) {
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader");
    }

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [open]);

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      setScanning(true);
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignore errors during scanning
        }
      );
    } catch (err: any) {
      console.error("Scanner error:", err);
      setHasCamera(false);
      setScanning(false);
      toast.error("Не удалось получить доступ к камере");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    await stopScanning();
    onScanSuccess(decodedText);
    onOpenChange(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !scannerRef.current) return;

    try {
      const decodedText = await scannerRef.current.scanFile(file, false);
      handleScanSuccess(decodedText);
    } catch (err) {
      console.error("Error scanning file:", err);
      toast.error("Не удалось отсканировать QR-код с изображения");
    }
  };

  const handleClose = () => {
    stopScanning();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md glass-card neon-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            <span className="neon-gradient-text">Сканировать QR-код</span>
          </DialogTitle>
          <DialogDescription>
            Отсканируйте QR-код участника или челленджа
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Scanner View */}
          <div 
            id="qr-reader" 
            className={`w-full rounded-lg overflow-hidden border-2 border-purple-500/30 ${
              scanning ? 'block' : 'hidden'
            }`}
            style={{ minHeight: '300px' }}
          />

          {/* Instructions when not scanning */}
          {!scanning && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center neon-glow">
                <Camera className="w-10 h-10 text-purple-400" />
              </div>
              <p className="text-muted-foreground text-sm">
                Используйте камеру или загрузите изображение с QR-кодом
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {!scanning ? (
              <>
                {hasCamera && (
                  <Button
                    onClick={startScanning}
                    className="neon-gradient text-white hover:opacity-90"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Камера
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className={hasCamera ? "" : "col-span-2"}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </>
            ) : (
              <Button
                onClick={stopScanning}
                variant="destructive"
                className="col-span-2"
              >
                <X className="w-4 h-4 mr-2" />
                Остановить
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
