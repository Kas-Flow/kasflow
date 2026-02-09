/**
 * ReceiptTemplate - Printable receipt template for image download
 * Renders off-screen and converts to PNG using html-to-image
 */

import { useEffect, useState } from 'react';
import * as QRCode from 'qrcode';
import { NETWORK_NAMES } from '@/lib/constants/kaspa';

// =============================================================================
// Types
// =============================================================================

interface ReceiptTemplateProps {
  transactionId: string;
  amount: string;
  network: string;
  recipientAddress: string;
  date: string;
  fee?: bigint;
}

interface ReceiptRowProps {
  label: string;
  value: string;
}

// =============================================================================
// Helper Components
// =============================================================================

function ReceiptRow({ label, value }: ReceiptRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-600">{label}</span>
      <span className="text-xs font-bold text-right break-all max-w-[250px]">{value}</span>
    </div>
  );
}

// =============================================================================
// Utility Functions
// =============================================================================

function formatFee(fee?: bigint): string {
  if (!fee) return '—';
  const kasAmount = Number(fee) / 100_000_000;
  return `${kasAmount.toFixed(8)} KAS`;
}

// =============================================================================
// ReceiptTemplate Component
// =============================================================================

export function ReceiptTemplate({
  transactionId,
  amount,
  network,
  recipientAddress,
  date,
  fee,
}: ReceiptTemplateProps) {
  const networkName = NETWORK_NAMES[network as keyof typeof NETWORK_NAMES] || network;
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate QR code as data URL (canvas-based, works with html-to-image)
  useEffect(() => {
    if (transactionId) {
      QRCode.toDataURL(transactionId, {
        width: 140,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((error) => console.error('QR code generation failed:', error));
    }
  }, [transactionId]);

  return (
    <div
      id="receipt-template"
      className="w-[400px] p-8 bg-white text-black"
      style={{
        fontFamily: 'monospace',
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black tracking-tight mb-2">KASFLOW</h1>
        <p className="text-sm text-gray-600 uppercase tracking-wider">Payment Receipt</p>
        <div className="mt-2 h-px bg-gray-300" />
      </div>

      {/* Transaction Details */}
      <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-4 space-y-2">
        <ReceiptRow label="Date:" value={date} />
        <ReceiptRow label="Amount:" value={`${amount} KAS`} />
        <ReceiptRow label="Network:" value={networkName} />
        <ReceiptRow label="Fee:" value={formatFee(fee)} />
        <ReceiptRow label="Status:" value="CONFIRMED ✓" />
      </div>

      {/* Recipient Address */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-gray-500 uppercase">Recipient:</p>
        <p className="text-xs break-all font-mono bg-gray-100 p-2 rounded border border-gray-300">
          {recipientAddress}
        </p>
      </div>

      {/* Transaction ID */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-gray-500 uppercase">Transaction ID:</p>
        <p className="text-xs break-all font-mono bg-gray-100 p-2 rounded border border-gray-300">
          {transactionId}
        </p>
      </div>

      {/* QR Code */}
      <div className="mt-6 flex flex-col items-center">
        <div className="bg-white p-3 border-2 border-black rounded-lg">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="Transaction QR Code"
              width={140}
              height={140}
              style={{ display: 'block' }}
            />
          ) : (
            <div
              style={{
                width: '140px',
                height: '140px',
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="text-xs text-gray-400">Generating QR...</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">Scan to view transaction</p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-300">
        <p className="text-center text-xs text-gray-500">
          Thank you for using KasFlow
        </p>
        <p className="text-center text-xs text-gray-400 mt-1">
          Instant Kaspa Payments
        </p>
      </div>

      {/* Decorative tear line */}
      <div className="mt-6 text-center text-gray-300 text-xs">
        ✂ ✂ ✂ ✂ ✂ ✂ ✂ ✂ ✂ ✂
      </div>
    </div>
  );
}
