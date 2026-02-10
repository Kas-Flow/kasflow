/**
 * @kasflow/wallet-connector - WalletModal Component
 *
 * Modal for selecting and connecting to a wallet.
 */

'use client';

import React, { useCallback, useEffect, type CSSProperties } from 'react';
import { useConnect } from '../hooks/useConnect';
import type { WalletAdapter } from '../../core/types';

/**
 * Props for WalletModal component
 */
export interface WalletModalProps {
  /** Additional CSS class for the modal */
  className?: string;
  /** Title displayed in the modal header */
  title?: string;
}

/**
 * Backdrop styles
 */
const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--kasflow-backdrop-bg, rgba(0, 0, 0, 0.6))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
  padding: '16px',
};

/**
 * Modal container styles
 */
const modalStyle: CSSProperties = {
  backgroundColor: 'var(--kasflow-modal-bg, #1f1f1f)',
  borderRadius: '16px',
  padding: '24px',
  width: '100%',
  maxWidth: '360px',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  border: '1px solid var(--kasflow-modal-border, rgba(255,255,255,0.1))',
};

/**
 * Header styles
 */
const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
};

const titleStyle: CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--kasflow-text, white)',
  margin: 0,
};

const closeButtonStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  padding: '4px',
  cursor: 'pointer',
  color: 'var(--kasflow-text-muted, rgba(255,255,255,0.5))',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * Wallet option styles
 */
const walletListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const walletButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  backgroundColor: 'var(--kasflow-wallet-bg, rgba(255,255,255,0.05))',
  border: '1px solid var(--kasflow-wallet-border, rgba(255,255,255,0.1))',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'inherit',
};

const walletIconStyle: CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  backgroundColor: 'var(--kasflow-wallet-icon-bg, rgba(255,255,255,0.1))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const walletInfoStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const walletNameStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--kasflow-text, white)',
  marginBottom: '2px',
};

const walletDescStyle: CSSProperties = {
  fontSize: '12px',
  color: 'var(--kasflow-text-muted, rgba(255,255,255,0.5))',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const statusBadgeStyle: CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  padding: '2px 6px',
  borderRadius: '4px',
  textTransform: 'uppercase',
};

/**
 * WalletModal - Modal for wallet selection
 *
 * Displays available wallets and handles connection.
 * Automatically shows/hides based on useConnect modal state.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <KaspaWalletProvider config={config}>
 *       <MyApp />
 *       <WalletModal title="Connect your wallet" />
 *     </KaspaWalletProvider>
 *   );
 * }
 * ```
 */
export function WalletModal({
  className,
  title = 'Connect Wallet',
}: WalletModalProps) {
  const { isModalOpen, closeModal, adapters, connect, connecting } = useConnect();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen, closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

  const handleWalletClick = useCallback(
    async (adapter: WalletAdapter) => {
      try {
        await connect(adapter.metadata.name);
      } catch (error) {
        // Error handled by provider
        console.error('Connection failed:', error);
      }
    },
    [connect]
  );

  if (!isModalOpen) {
    return null;
  }

  return (
    <div
      style={backdropStyle}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div style={modalStyle} className={className}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 id="wallet-modal-title" style={titleStyle}>
            {title}
          </h2>
          <button
            style={closeButtonStyle}
            onClick={closeModal}
            aria-label="Close modal"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Wallet list */}
        <div style={walletListStyle}>
          {adapters.map((adapter) => (
            <WalletOption
              key={adapter.metadata.name}
              adapter={adapter}
              onClick={() => handleWalletClick(adapter)}
              disabled={connecting}
            />
          ))}

          {adapters.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 16px',
                color: 'var(--kasflow-text-muted, rgba(255,255,255,0.5))',
              }}
            >
              No wallets available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual wallet option
 */
function WalletOption({
  adapter,
  onClick,
  disabled,
}: {
  adapter: WalletAdapter;
  onClick: () => void;
  disabled: boolean;
}) {
  const { metadata, readyState } = adapter;

  const isNotDetected = readyState === 'not-detected';
  const canConnect = !isNotDetected && !disabled;

  const handleClick = () => {
    if (isNotDetected) {
      // Open installation page
      window.open(metadata.url, '_blank');
    } else if (canConnect) {
      onClick();
    }
  };

  return (
    <button
      style={{
        ...walletButtonStyle,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={handleClick}
      disabled={disabled && !isNotDetected}
      type="button"
    >
      {/* Icon */}
      <div style={walletIconStyle}>
        {metadata.icon.startsWith('data:') || metadata.icon.startsWith('http') ? (
          <img
            src={metadata.icon}
            alt={metadata.displayName}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
            }}
          />
        ) : (
          <span style={{ fontSize: '20px' }}>{metadata.icon}</span>
        )}
      </div>

      {/* Info */}
      <div style={walletInfoStyle}>
        <div style={walletNameStyle}>{metadata.displayName}</div>
        {metadata.description && (
          <div style={walletDescStyle}>{metadata.description}</div>
        )}
      </div>

      {/* Status */}
      <StatusBadge readyState={readyState} />
    </button>
  );
}

/**
 * Status badge component
 */
function StatusBadge({
  readyState,
}: {
  readyState: 'installed' | 'not-detected' | 'loadable';
}) {
  if (readyState === 'not-detected') {
    return (
      <span
        style={{
          ...statusBadgeStyle,
          backgroundColor: 'var(--kasflow-status-not-detected-bg, rgba(239,68,68,0.2))',
          color: 'var(--kasflow-status-not-detected-text, #ef4444)',
        }}
      >
        Install
      </span>
    );
  }

  if (readyState === 'loadable') {
    return (
      <span
        style={{
          ...statusBadgeStyle,
          backgroundColor: 'var(--kasflow-status-loadable-bg, rgba(59,130,246,0.2))',
          color: 'var(--kasflow-status-loadable-text, #3b82f6)',
        }}
      >
        Detected
      </span>
    );
  }

  return (
    <span
      style={{
        ...statusBadgeStyle,
        backgroundColor: 'var(--kasflow-status-installed-bg, rgba(16,185,129,0.2))',
        color: 'var(--kasflow-status-installed-text, #10b981)',
      }}
    >
      Ready
    </span>
  );
}

/**
 * Close icon component
 */
function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5L5 15M5 5L15 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
