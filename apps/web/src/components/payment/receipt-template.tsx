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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '12px', color: '#4b5563' }}>{label}</span>
      <span style={{
        fontSize: '12px',
        fontWeight: 'bold',
        textAlign: 'right',
        wordBreak: 'break-all',
        maxWidth: '280px',
      }}>{value}</span>
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
      style={{
        width: '450px',
        padding: '32px',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: 'monospace',
        position: 'fixed',
        left: '0',
        top: '0',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.025em', marginBottom: '8px' }}>
          KASFLOW
        </h1>
        <p style={{ fontSize: '14px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Payment Receipt
        </p>
        <div style={{ marginTop: '8px', height: '1px', backgroundColor: '#d1d5db' }} />
      </div>

      {/* Transaction Details */}
      <div style={{
        borderTop: '2px dashed #9ca3af',
        borderBottom: '2px dashed #9ca3af',
        paddingTop: '16px',
        paddingBottom: '16px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ReceiptRow label="Date:" value={date} />
          <ReceiptRow label="Amount:" value={`${amount} KAS`} />
          <ReceiptRow label="Network:" value={networkName} />
          <ReceiptRow label="Fee:" value={formatFee(fee)} />
          <ReceiptRow label="Status:" value="CONFIRMED ✓" />
        </div>
      </div>

      {/* Recipient Address */}
      <div style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>
          Recipient:
        </p>
        <p style={{
          fontSize: '12px',
          wordBreak: 'break-all',
          fontFamily: 'monospace',
          backgroundColor: '#f3f4f6',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #d1d5db',
        }}>
          {recipientAddress}
        </p>
      </div>

      {/* Transaction ID */}
      <div style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>
          Transaction ID:
        </p>
        <p style={{
          fontSize: '12px',
          wordBreak: 'break-all',
          fontFamily: 'monospace',
          backgroundColor: '#f3f4f6',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #d1d5db',
        }}>
          {transactionId}
        </p>
      </div>

      {/* QR Code */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '12px', border: '2px solid #000000', borderRadius: '8px' }}>
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
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>Generating QR...</span>
            </div>
          )}
        </div>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Scan to view transaction</p>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #d1d5db' }}>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
          Thank you for using KasFlow
        </p>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          Instant Kaspa Payments
        </p>
      </div>

      {/* Decorative tear line */}
      <div style={{ marginTop: '24px', textAlign: 'center', color: '#d1d5db', fontSize: '12px' }}>
        ✂ ✂ ✂ ✂ ✂ ✂ ✂ ✂ ✂ ✂
      </div>
    </div>
  );
}
