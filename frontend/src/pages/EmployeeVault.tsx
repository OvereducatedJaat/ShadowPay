import { useState, useEffect } from 'react';
import { FhenixClient, generatePermit, getMockContract } from '../utils/fhenixMock';

export default function EmployeeVault() {
  const [status, setStatus] = useState('');
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [fhenixClient, setFhenixClient] = useState<any>(null);

  useEffect(() => {
    setFhenixClient(new FhenixClient());
  }, []);

  const handleGeneratePermit = async () => {
    try {
      setStatus('Prompting Wallet for Fhenix View Permit (Signed Permission)...');
      
      // Simulated Permit generation
      await generatePermit("demo", {}, {}); 
      setStatus('Permission Granted. Fetching sealed encrypted balance from node...');
      
      const contract = getMockContract("demo");
      const sealedBalance = await contract.viewMyBalance();
      
      setStatus('Unsealing balance locally using your private view key...');
      await new Promise(r => setTimeout(r, 1200));
      
      const unsealed = fhenixClient.unseal("demo", sealedBalance, "user");
      setDecryptedBalance(`$${unsealed}`);
      setStatus('');
    } catch (e: any) {
      setStatus(`Failed: ${e.message}`);
    }
  };

  return (
    <div className="grid-layout" style={{maxWidth: '600px', margin: '0 auto'}}>
      <div className="glass-card" style={{textAlign: 'center'}}>
        <h2>My Employee Vault</h2>
        <p className="text-muted" style={{marginBottom: '2rem'}}>
          Your payroll and balance are stored as Fhenix Encrypted Integers. 
          Generate an Account Abstraction permit to decrypt and view your local copy.
        </p>

        {decryptedBalance ? (
          <div>
            <p className="text-muted">Decrypted Net Pay:</p>
            <div className="stat-value" style={{justifyContent: 'center', color: 'var(--accent)'}}>
              {decryptedBalance}
            </div>
            <p className="text-muted" style={{fontSize: '0.8rem', marginTop: '1rem'}}>
              No external observer can see this value on the blockchain.
            </p>
          </div>
        ) : (
          <button onClick={handleGeneratePermit} style={{margin: '0 auto'}}>
            Generate View Permit
          </button>
        )}

        {status && (
          <div style={{marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'left'}}>
            <span className="badge">Status</span>
            <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', wordBreak: 'break-all'}}>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
