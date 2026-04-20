
// Demo-friendly simulation engine
export class FhenixClient {
  provider: any;
  
  constructor(opts?: any) {
    this.provider = opts?.provider;
  }
  
  async encrypt_uint64(_value: number | string): Promise<any> {
    // Return a fake but real-looking FHE ciphertext handle
    return {
      data: "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      owner: "demo-user"
    };
  }

  unseal(_contractAddress: string, _sealedData: any, _userAddress: string): string {
    // Deterministic simulation
    return "4,250.00";
  }
}

// Simulated wallet/contract interaction
export async function getPermit(_contractAddress: string, _provider: any) {
  return "demo-permit-cached";
}

export async function generatePermit(_contractAddress: string, _provider: any, _signer: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        publicKey: "0x8823...fhe",
        signature: "0xsimulated_signature_for_demo"
      });
    }, 1500);
  });
}

// Mock Ethers Contract for demo
export const getMockContract = (_address: string) => {
  return {
    setSalary: async () => new Promise<{hash: string, wait: () => Promise<void>}>(r => setTimeout(() => r({ hash: "0x" + Math.random().toString(16).slice(2), wait: () => Promise.resolve() }), 1200)),
    addTreasury: async () => new Promise<{hash: string, wait: () => Promise<void>}>(r => setTimeout(() => r({ hash: "0x" + Math.random().toString(16).slice(2), wait: () => Promise.resolve() }), 1200)),
    runPayroll: async () => new Promise<{hash: string, wait: () => Promise<void>}>(r => setTimeout(() => r({ hash: "0x" + Math.random().toString(16).slice(2), wait: () => Promise.resolve() }), 2000)),
    totalPayrollsRun: async () => "12",
    isSolvent: async () => true,
    viewMyBalance: async () => "0x_sealed_demo_balance"
  };
};

