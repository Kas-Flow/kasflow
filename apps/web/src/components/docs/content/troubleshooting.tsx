export function TroubleshootingContent() {
  return (
    <>
      <p className="lead text-xl">
        Common issues and their solutions to help you get back to sending and receiving payments quickly.
      </p>

      <div className="p-4 bg-blue-500/10 border-2 border-blue-500 rounded-lg not-prose mb-8">
        <p className="text-sm">
          <strong>💡 Quick Tip:</strong> Most issues can be resolved by refreshing the page, checking your network connection, or switching to a different browser. Try these first!
        </p>
      </div>

      {/* Wallet Issues */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black">Wallet Issues</h2>

        <details className="p-4 bg-card rounded-lg border-2 border-border" open>
          <summary className="font-bold cursor-pointer">Passkey authentication not working</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If biometric authentication fails or doesn't appear:</p>
            <ul className="space-y-2">
              <li><strong>1. Check browser support:</strong> Use Chrome 67+, Safari 14+, Firefox 60+, or Edge 18+</li>
              <li><strong>2. Verify HTTPS:</strong> Passkeys only work on secure (HTTPS) connections</li>
              <li><strong>3. Enable biometric:</strong> Make sure Face ID/Touch ID/Windows Hello is enabled in your device settings</li>
              <li><strong>4. Try device password:</strong> If biometric fails, use your device password as fallback</li>
              <li><strong>5. Clear browser data:</strong> Sometimes clearing cache can fix stuck states</li>
            </ul>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Wallet balance shows zero</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If your balance isn't showing correctly:</p>
            <ul className="space-y-2">
              <li><strong>1. Check network:</strong> Make sure you're on the correct network (mainnet vs testnet)</li>
              <li><strong>2. Wait for sync:</strong> Balance updates every 2-3 seconds, give it a moment</li>
              <li><strong>3. Verify address:</strong> Copy your address and check it on a block explorer</li>
              <li><strong>4. Reconnect wallet:</strong> Disconnect and reconnect your wallet</li>
              <li><strong>5. Check RPC connection:</strong> Look for connection errors in browser console (F12)</li>
            </ul>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Can't send payment - insufficient balance</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If you get "insufficient balance" errors:</p>
            <ul className="space-y-2">
              <li><strong>1. Include fees:</strong> You need amount + ~0.001 KAS for network fees</li>
              <li><strong>2. Wait for confirmations:</strong> Pending transactions reduce available balance</li>
              <li><strong>3. Check UTXO state:</strong> Refresh the page to update UTXO set</li>
              <li><strong>4. Get more funds:</strong> For testnet, use the faucet. For mainnet, deposit more KAS</li>
            </ul>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Wallet disconnects on page refresh</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If your wallet doesn't persist across page refreshes:</p>
            <ul className="space-y-2">
              <li><strong>1. This is intentional:</strong> For security, you need to unlock on each page load</li>
              <li><strong>2. Session restoration:</strong> The wallet will prompt you to unlock automatically</li>
              <li><strong>3. Authenticate again:</strong> Simply approve the biometric prompt</li>
              <li><strong>4. Stay on same tab:</strong> Navigating within the app shouldn't disconnect you</li>
            </ul>
          </div>
        </details>
      </section>

      {/* Payment Issues */}
      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-black">Payment Issues</h2>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Payment link shows "Invalid payment link"</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If payment links aren't loading:</p>
            <ul className="space-y-2">
              <li><strong>1. Check URL:</strong> Make sure the full URL was copied (starts with https://kasflow.app/pay/)</li>
              <li><strong>2. Encoding issues:</strong> Some messaging apps break long URLs - try shortening or using QR code</li>
              <li><strong>3. Expired link:</strong> Check if the payment link has an expiration date</li>
              <li><strong>4. Wrong network:</strong> Verify the network matches your wallet</li>
            </ul>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">QR code not scanning</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If QR codes aren't working:</p>
            <ul className="space-y-2">
              <li><strong>1. Use Kaspa wallet app:</strong> Generic QR scanners won't work - use Kaspium, Kasware, etc.</li>
              <li><strong>2. Check lighting:</strong> Make sure screen is bright and clear</li>
              <li><strong>3. Try manual entry:</strong> Click "Copy Address" and paste instead</li>
              <li><strong>4. Verify network:</strong> QR code includes network info - wallet must match</li>
            </ul>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Payment stuck on "Confirming"</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If payment confirmation takes longer than expected:</p>
            <ul className="space-y-2">
              <li><strong>1. Wait 10 seconds:</strong> Normal confirmations take 1-3 seconds, but can occasionally be slower</li>
              <li><strong>2. Check explorer:</strong> Click "View Explorer" to see actual blockchain status</li>
              <li><strong>3. Refresh page:</strong> Sometimes the monitoring needs a refresh to update</li>
              <li><strong>4. RPC timeout:</strong> If RPC disconnects, the payment still went through - check explorer</li>
            </ul>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Transaction failed to broadcast</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If transaction fails to send:</p>
            <ul className="space-y-2">
              <li><strong>1. Check balance:</strong> Ensure you have enough for amount + fees</li>
              <li><strong>2. Invalid address:</strong> Verify recipient address is correct format</li>
              <li><strong>3. Network mismatch:</strong> Can't send mainnet to testnet address or vice versa</li>
              <li><strong>4. RPC connection:</strong> Check network connection and try again</li>
              <li><strong>5. Try smaller amount:</strong> If sending max balance, reduce by 0.01 KAS for fees</li>
            </ul>
          </div>
        </details>
      </section>

      {/* Browser Issues */}
      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-black">Browser & Connection Issues</h2>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">WebSocket connection errors</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If you see "WebSocket is not connected" errors:</p>
            <ul className="space-y-2">
              <li><strong>1. Check internet:</strong> Verify you have a stable internet connection</li>
              <li><strong>2. Firewall/VPN:</strong> Some firewalls block WebSocket connections</li>
              <li><strong>3. Browser extensions:</strong> Ad blockers can interfere - try disabling</li>
              <li><strong>4. Wait for retry:</strong> KasFlow automatically retries connection</li>
              <li><strong>5. Switch network:</strong> Try testnet-10 if testnet-11 is having issues</li>
            </ul>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Page won't load or is blank</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If KasFlow pages aren't displaying:</p>
            <ul className="space-y-2">
              <li><strong>1. Hard refresh:</strong> Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)</li>
              <li><strong>2. Clear cache:</strong> Clear browser cache and cookies for kasflow.app</li>
              <li><strong>3. Disable extensions:</strong> Try incognito/private mode to rule out extensions</li>
              <li><strong>4. Update browser:</strong> Make sure you're on the latest browser version</li>
              <li><strong>5. Try different browser:</strong> Test in Chrome, Firefox, or Safari</li>
            </ul>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Console shows JavaScript errors</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If you see errors in browser console (F12):</p>
            <ul className="space-y-2">
              <li><strong>1. Take screenshot:</strong> Capture the error message for reporting</li>
              <li><strong>2. Check version:</strong> Clear cache to ensure you have latest version</li>
              <li><strong>3. Report issue:</strong> Open a GitHub issue with error details</li>
              <li><strong>4. Workaround:</strong> Try the action in a different browser</li>
            </ul>
          </div>
        </details>
      </section>

      {/* Network Issues */}
      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-black">Network Issues</h2>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Wrong network selected</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If you're on the wrong network:</p>
            <ul className="space-y-2">
              <li><strong>1. Check badge:</strong> Look for network badge (Mainnet/Testnet-10/Testnet-11)</li>
              <li><strong>2. Switch wallet network:</strong> Click wallet → network dropdown → select correct network</li>
              <li><strong>3. Disconnect wallet:</strong> Disconnect to manually choose network on payment page</li>
              <li><strong>4. Address mismatch:</strong> kaspa: = mainnet, kaspatest: = testnet</li>
            </ul>
          </div>
        </details>

        <details className="p-4 bg-card rounded-lg border-2 border-border">
          <summary className="font-bold cursor-pointer">Can't get testnet funds</summary>
          <div className="mt-3 space-y-3 text-sm">
            <p className="text-muted-foreground">If testnet faucets aren't working:</p>
            <ul className="space-y-2">
              <li><strong>1. Join Discord:</strong> Most testnet faucets are in Kaspa Discord</li>
              <li><strong>2. Use correct address:</strong> Must start with kaspatest: not kaspa:</li>
              <li><strong>3. Wait cooldown:</strong> Faucets have time limits between requests</li>
              <li><strong>4. Try different faucet:</strong> Multiple testnets available (tn10, tn11)</li>
              <li><strong>5. Ask community:</strong> Discord members often share testnet coins</li>
            </ul>
          </div>
        </details>
      </section>

      {/* Advanced Issues */}
      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-black">Advanced Troubleshooting</h2>

        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold mb-2">🔍 Enable Debug Mode</h4>
          <ol className="text-sm space-y-2 text-muted-foreground">
            <li>1. Open browser console (F12 or Cmd+Option+I)</li>
            <li>2. Go to "Console" tab</li>
            <li>3. Look for [KasFlow] prefixed logs</li>
            <li>4. Check for error messages or warnings</li>
            <li>5. Copy relevant errors for support</li>
          </ol>
        </div>

        <div className="p-4 bg-card rounded-lg border-2 border-border">
          <h4 className="font-bold mb-2">🗄️ Reset Wallet Data</h4>
          <p className="text-sm text-muted-foreground mb-2">If you need to start fresh:</p>
          <ol className="text-sm space-y-2 text-muted-foreground">
            <li>1. Open browser DevTools (F12)</li>
            <li>2. Go to "Application" tab</li>
            <li>3. Under "Storage", find "IndexedDB"</li>
            <li>4. Delete "kasflow-wallet" database</li>
            <li>5. Refresh page - wallet will be reset</li>
          </ol>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
            ⚠️ Warning: This doesn't delete your passkey. You can recreate the wallet with the same passkey.
          </p>
        </div>
      </section>

      {/* Still Need Help */}
      <div className="p-6 bg-gradient-to-r from-neo-pink/20 to-neo-yellow/20 rounded-xl border-2 border-border not-prose mt-8">
        <p className="text-lg font-bold mb-2">Still stuck?</p>
        <p className="text-muted-foreground mb-4">
          We're here to help! Open an issue on GitHub with details about your problem.
        </p>
        <div className="space-y-3">
          <p className="text-sm font-semibold">When reporting an issue, include:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Browser and version (Chrome 120, Safari 17, etc.)</li>
            <li>• Operating system (Windows 11, macOS 14, etc.)</li>
            <li>• Steps to reproduce the problem</li>
            <li>• Console errors (F12 → Console tab)</li>
            <li>• Screenshots if applicable</li>
          </ul>
          <a
            href="https://github.com/yourusername/kasflow/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg border-2 border-border hover:shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all"
          >
            Open GitHub Issue →
          </a>
        </div>
      </div>
    </>
  );
}
