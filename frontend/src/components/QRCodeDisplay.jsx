import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ value, size = 120, label }) {
  return (
    <div className="text-center">
      <QRCodeSVG value={value} size={size} />
      {label && <div className="mt-2 text-sm text-amber-200">{label}</div>}
    </div>
  );
}
