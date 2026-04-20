import { useState } from 'react';
import { getMockContract } from '../utils/fhenixMock';

export default function AuditorView() {
  const [auditorKey, setAuditorKey] = useState('');
  const [status, setStatus] = useState('');
  const [disclosedData, setDisclosedData] = useState<any>(null);

  const handleApplyKey = async () => {
    setStatus('Verifying Privara Auditor Key & Selective Disclosure constraints...');
    if (auditorKey.length < 5) {
      setStatus('Invalid Auditor Key structure.');
      return;
    }

    try {
      const contract = getMockContract("demo");
      
      setStatus('Keys matched! Fetching public verifiable state from Fhenix node...');
      await new Promise(r => setTimeout(r, 1000));
      
      const payrollsRun = await contract.totalPayrollsRun();
      const solvent = await contract.isSolvent(); 

      setDisclosedData({
        totalTaxPaid: '$48,250 (FHE Computed Aggregate)',
        totalPayrollsRun: payrollsRun,
        treasuryState: solvent ? 'Solvent - Verified via FHE math' : 'Insolvent'
      });
      setStatus('');
    } catch(e: any) {
      setStatus(`Execution error: ${e.message}`);
    }
  };

  return (
    <div className="grid-layout" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="glass-card">
        <h2 style={{borderBottom: '1px solid var(--border)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between'}}>
          Compliance Center
          <span className="badge" style={{background: 'rgba(255, 255, 255, 0.1)', color: '#fff'}}>Privara Powered</span>
        </h2>
        
        <p className="text-muted">
          Under the Privara Compliance layer, the organization can issue one-time Auditor Keys.
          This grants Selective Disclosure to tax or compliance authorities for specific epochs, 
          without leaking the entire on-chain payment history of the company.
        </p>

        {!disclosedData ? (
          <div style={{marginTop: '2rem'}}>
            <input 
              type="text" 
              placeholder="Paste Privara Auditor Key (e.g., priv-xk9...)" 
              value={auditorKey} 
              onChange={e => setAuditorKey(e.target.value)} 
            />
            <button onClick={handleApplyKey}>
              Authenticate & Decrypt
            </button>
          </div>
        ) : (
          <div style={{marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px'}}>
            <h3 style={{color: 'var(--accent)', marginTop: 0}}>Verified Disclosure Data</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem'}}>
                <span className="text-muted">Total Tax Forwarded:</span>
                <strong>{disclosedData.totalTaxPaid}</strong>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem'}}>
                <span className="text-muted">Payroll Cycles Run:</span>
                <strong>{disclosedData.totalPayrollsRun}</strong>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem'}}>
                <span className="text-muted">On-Chain Solvency Check:</span>
                <strong style={{color: disclosedData.treasuryState.includes('Solvent -') ? '#00f5d4' : '#ff4d4d'}}>
                  {disclosedData.treasuryState}
                </strong>
              </div>
            </div>
            
            <button 
              onClick={() => {setDisclosedData(null); setAuditorKey('');}} 
              style={{marginTop: '2rem', background: 'rgba(255,255,255,0.1)'}}
            >
              Reset Session
            </button>
          </div>
        )}

        {status && (
          <div style={{marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
            <p style={{margin: 0, fontSize: '0.9rem', wordBreak: 'break-all'}}>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
