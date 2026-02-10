/**
 * @kasflow/wallet-connector - ConnectButton Component
 *
 * Smart button component that handles all wallet connection states.
 */

'use client';

import React, { type ReactNode, type CSSProperties, type MouseEvent } from 'react';
import { useConnect } from '../hooks/useConnect';
import { useAccount } from '../hooks/useAccount';
import { useBalance } from '../hooks/useBalance';
import { useNetwork } from '../hooks/useNetwork';

/**
 * Props for ConnectButton component
 */
export interface ConnectButtonProps {
  /** Label when disconnected */
  label?: string;
  /** Whether to show balance when connected */
  showBalance?: boolean;
  /** Whether to show network badge */
  showNetwork?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Render props for ConnectButton.Custom
 */
export interface ConnectButtonRenderProps {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  shortAddress: string | null;
  balance: string | null;
  network: string;
  openModal: () => void;
  disconnect: () => Promise<void>;
}

/**
 * Props for ConnectButton.Custom
 */
export interface ConnectButtonCustomProps {
  children: (props: ConnectButtonRenderProps) => ReactNode;
}

/**
 * Default button styles
 */
const defaultButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.5,
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontFamily: 'inherit',
  backgroundColor: 'var(--kasflow-button-bg, #7c3aed)',
  color: 'var(--kasflow-button-text, white)',
};

const disabledStyle: CSSProperties = {
  opacity: 0.6,
  cursor: 'not-allowed',
};

const networkBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  fontSize: '10px',
  fontWeight: 600,
  borderRadius: '4px',
  backgroundColor: 'var(--kasflow-badge-bg, rgba(0,0,0,0.2))',
  color: 'var(--kasflow-badge-text, inherit)',
  textTransform: 'uppercase',
};

/**
 * ConnectButton - Smart wallet connection button
 *
 * Automatically handles all wallet states:
 * - Disconnected: Shows connect button
 * - Connecting: Shows loading state
 * - Connected: Shows address and optional balance/network
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ConnectButton />
 *
 * // With options
 * <ConnectButton
 *   label="Connect Wallet"
 *   showBalance={true}
 *   showNetwork={true}
 * />
 *
 * // Custom styling
 * <ConnectButton className="my-custom-class" />
 * ```
 */
export function ConnectButton({
  label = 'Connect Wallet',
  showBalance = false,
  showNetwork = false,
  className,
  style,
  disabled,
}: ConnectButtonProps) {
  const { connected, connecting, openModal, disconnect } = useConnect();
  const { shortAddress } = useAccount();
  const { formattedAvailable } = useBalance();
  const { network, isTestnet } = useNetwork();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (connected) {
      disconnect();
    } else {
      openModal();
    }
  };

  const isDisabled = disabled || connecting;

  const buttonStyle: CSSProperties = {
    ...defaultButtonStyle,
    ...(isDisabled ? disabledStyle : {}),
    ...style,
  };

  // Connecting state
  if (connecting) {
    return (
      <button
        className={className}
        style={buttonStyle}
        disabled
        type="button"
      >
        <LoadingSpinner />
        Connecting...
      </button>
    );
  }

  // Connected state
  if (connected) {
    return (
      <button
        className={className}
        style={buttonStyle}
        onClick={handleClick}
        disabled={isDisabled}
        type="button"
      >
        {showNetwork && (
          <span
            style={{
              ...networkBadgeStyle,
              backgroundColor: isTestnet
                ? 'var(--kasflow-testnet-bg, #f59e0b)'
                : 'var(--kasflow-mainnet-bg, #10b981)',
            }}
          >
            {network}
          </span>
        )}
        {showBalance && (
          <span style={{ opacity: 0.9 }}>{formattedAvailable} KAS</span>
        )}
        <span>{shortAddress}</span>
      </button>
    );
  }

  // Disconnected state
  return (
    <button
      className={className}
      style={buttonStyle}
      onClick={handleClick}
      disabled={isDisabled}
      type="button"
    >
      {label}
    </button>
  );
}

/**
 * Custom render prop version of ConnectButton
 *
 * @example
 * ```tsx
 * <ConnectButton.Custom>
 *   {({ connected, connecting, shortAddress, openModal, disconnect }) => (
 *     <button onClick={connected ? disconnect : openModal}>
 *       {connecting ? 'Connecting...' : connected ? shortAddress : 'Connect'}
 *     </button>
 *   )}
 * </ConnectButton.Custom>
 * ```
 */
ConnectButton.Custom = function ConnectButtonCustom({
  children,
}: ConnectButtonCustomProps) {
  const { connected, connecting, openModal, disconnect } = useConnect();
  const { address, shortAddress } = useAccount();
  const { formattedAvailable } = useBalance();
  const { network } = useNetwork();

  return (
    <>
      {children({
        connected,
        connecting,
        address,
        shortAddress,
        balance: formattedAvailable,
        network,
        openModal,
        disconnect,
      })}
    </>
  );
};

/**
 * Simple loading spinner component
 */
function LoadingSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: 'kasflow-spin 1s linear infinite',
      }}
    >
      <style>
        {`
          @keyframes kasflow-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="31.4"
        strokeDashoffset="10"
        opacity="0.5"
      />
    </svg>
  );
}
