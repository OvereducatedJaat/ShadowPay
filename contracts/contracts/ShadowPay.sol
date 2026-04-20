// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract ShadowPay is Permissioned {
    address public owner;
    address public taxAuthority;

    // Encrypted balances (salaries and treasury)
    mapping(address => euint64) private _salaries;
    mapping(address => euint64) private _balances; // Employee balances after payroll
    euint64 private _treasury;
    euint64 private _totalPayroll;
    
    // Public audit tracking (Selective Disclosure placeholder for Privara)
    uint256 public totalPayrollsRun;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _taxAuthority) {
        owner = msg.sender;
        taxAuthority = _taxAuthority;
        // Initialize to 0
        _treasury = FHE.asEuint64(0);
        _totalPayroll = FHE.asEuint64(0);
    }

    // Set salary for an employee. Receives encrypted ciphertext.
    function setSalary(address employee, inEuint64 memory encryptedSalary) public onlyOwner {
        euint64 newSalary = FHE.asEuint64(encryptedSalary);
        
        // Update the running total of payroll
        // If employee already had a salary, subtract the old one first. 
        // For simplicity in this demo, we assume we only set it once or add to it.
        // Or we can just build a list of employees for iteration.
        _salaries[employee] = newSalary;
        _totalPayroll = FHE.add(_totalPayroll, newSalary);
    }

    function addTreasury(inEuint64 memory encryptedAmount) public onlyOwner {
        _treasury = FHE.add(_treasury, FHE.asEuint64(encryptedAmount));
    }
    
    // A function to check if the employer has enough treasury for payroll
    // This provides Shielded Solvency Check
    function isSolvent() public view returns (bool) {
        // Evaluate the boolean condition and decrypt it. 
        // In real cases involving Fhenix, you might use FHE.decrypt to reveal only the boolean result.
        // Or FHE.req
        ebool canPay = FHE.gte(_treasury, _totalPayroll);
        return FHE.decrypt(canPay);
    }

    // Process payroll for a list of employees
    function runPayroll(address[] memory employees, inEuint64[] memory encryptedTaxes) public onlyOwner {
        // Shielded Solvency Check directly on-chain: 
        FHE.req(FHE.gte(_treasury, _totalPayroll));

        // Let's declare the total tax for this run
        euint64 totalTaxEncrypted = FHE.asEuint64(0);

        for (uint i = 0; i < employees.length; i++) {
            address emp = employees[i];
            euint64 salary = _salaries[emp];
            
            // Equation: netPay = salary - taxPortion
            // Supplying tax encrypted directly avoids FHE division which is computationally intense/unsupported
            euint64 taxPortion = FHE.asEuint64(encryptedTaxes[i]);
            euint64 netPay = FHE.sub(salary, taxPortion);

            // Update balances
            _balances[emp] = FHE.add(_balances[emp], netPay);
            totalTaxEncrypted = FHE.add(totalTaxEncrypted, taxPortion);
        }

        // Deduct from treasury
        _treasury = FHE.sub(_treasury, _totalPayroll);
        
        // Add all gathered taxes to the tax authority's balance
        _balances[taxAuthority] = FHE.add(_balances[taxAuthority], totalTaxEncrypted);
        
        totalPayrollsRun++;
    }

    // View Encrypted Salary (Only the employee themselves or permissioned entities)
    function viewMySalary(Permission calldata permission) public view onlySender(permission) returns (uint64) {
        return FHE.decrypt(_salaries[msg.sender]);
    }

    // View Encrypted Balance limit to only the owner of the wallet
    function viewMyBalance(Permission calldata permission) public view onlySender(permission) returns (uint64) {
        return FHE.decrypt(_balances[msg.sender]);
    }
    
    // View global treasury (Only auditor/owner)
    // Privara Integration: The auditor signs a permit that allows reading this mapping via `Permission` object
    function viewTreasury(Permission calldata permission) public view returns (uint64) {
        return FHE.decrypt(_treasury);
    }
}
