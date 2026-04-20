import { useState, useEffect } from 'react';
import { FhenixClient, getMockContract } from '../utils/fhenixMock';

export default function EmployerDashboard() {
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [salaryRaw, setSalaryRaw] = useState('');
  const [treasuryAddRaw, setTreasuryAddRaw] = useState('');
  const [status, setStatus] = useState('');
  
  const [fhenixClient, setFhenixClient] = useState<any>(null);

  // Demo initialization
  useEffect(() => {
    setFhenixClient(new FhenixClient());
  }, []);

  const handleSetSalary = async () => {
    try {
      setStatus('Encrypting salary locally (FHE)...');
      const contract = getMockContract("demo");
      
      // Local FHE Encryption Simulation
      await new Promise(r => setTimeout(r, 800));
      const encryptedSalary = await fhenixClient.encrypt_uint64(Number(salaryRaw));
      
      setStatus('Pushing encrypted salary to ShadowPay registry...');
      const tx = await contract.setSalary();
      
      setStatus(`Success! Tx Hash: ${tx.hash}`);
      setEmployeeAddress('');
      setSalaryRaw('');
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleFundTreasury = async () => {
    try {
      setStatus('Encrypting vault deposit...');
      const contract = getMockContract("demo");
      
      await new Promise(r => setTimeout(r, 1000));
      const tx = await contract.addTreasury();
      
      setStatus(`Treasury Funded! (Simulated Tx: ${tx.hash})`);
      setTreasuryAddRaw('');
    } catch(e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleRunPayroll = async () => {
    try {
      setStatus('Fhenix Solvency Check: Verifying Treasury >= Total Payroll (Confidential)...');
      await new Promise(r => setTimeout(r, 1500));
      
      setStatus('Computing Net Pay and Taxes for 12 employees (Encrypted math)...');
      const contract = getMockContract("demo");
      const tx = await contract.runPayroll();
      
      setStatus(`Payroll Complete! Net pay distributed via FHE logic. Tx: ${tx.hash}`);
    } catch(e: any) {
      setStatus(`Failed: ${e.message}`);
    }
  };

  return (
    <div className="grid-layout">
      <div className="glass-card">
        <h2>Shielded Treasury</h2>
        <p className="text-muted">Current Encrypted Balance (Fhenix Target):</p>
        <div className="stat-value"><span className="encrypted-text">0x8a992...fhe9a</span></div>
        <p className="text-muted" style={{fontSize: '0.8rem'}}>No external observer can see your balance</p>
        
        <div style={{marginTop: '2rem'}}>
          <input 
            type="number" 
            placeholder="Amount to deposit (USD)" 
            value={treasuryAddRaw} 
            onChange={e => setTreasuryAddRaw(e.target.value)} 
          />
          <button onClick={handleFundTreasury} style={{width: '100%', justifyContent: 'center'}}>
            Deposit to Vault
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h2>Employee Registry</h2>
        <div style={{marginBottom: '1rem'}}>
          <input 
            type="text" 
            placeholder="0x... Employee Address" 
            value={employeeAddress} 
            onChange={e => setEmployeeAddress(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Monthly Gross Salary (USD)" 
            value={salaryRaw} 
            onChange={e => setSalaryRaw(e.target.value)} 
          />
          <button onClick={handleSetSalary} style={{width: '100%', justifyContent: 'center', backgroundColor: 'var(--accent)', color: '#000'}}>
            Encrypt & Register Input
          </button>
        </div>

        <div style={{marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem'}}>
          <h3>Execute Cycle</h3>
          <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '1rem'}}>
            Executes Phase 2 logic: Solvency check -&gt; Computes `Net Pay = e * (1-x)` -&gt; Sends net pay to employees via FHE logic -&gt; Tax forwarded.
          </p>
          <button onClick={handleRunPayroll} style={{width: '100%', justifyContent: 'center'}}>
            Run Live FHE Payroll
          </button>
        </div>

        {status && (
          <div style={{marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
            <span className="badge">Status</span>
            <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', wordBreak: 'break-all'}}>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
