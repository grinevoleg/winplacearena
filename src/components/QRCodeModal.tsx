"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: string;
  title: string;
  description?: string;
}

export function QRCodeModal({ open, onOpenChange, data, title, description }: QRCodeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card neon-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-gradient-text">{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="flex justify-center p-6">
          <div className="p-4 bg-white rounded-2xl">
            <QRCodeSVG
              value={data}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Scan this QR code to share
        </p>
      </DialogContent>
    </Dialog>
  );
}
