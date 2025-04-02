// Web Worker for Solidity compilation
import type { CompileInput, CompileOutput } from '../../../types/solidity-compiler';

// Handle compilation requests
self.onmessage = async (e: MessageEvent<CompileInput>) => {
  try {
    const { sourceCode, version } = e.data;
    
    // Import solc dynamically within the worker
    const solc = await import('solc');
    
    const input = {
      language: 'Solidity',
      sources: {
        'contract.sol': {
          content: sourceCode
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode', 'evm.methodIdentifiers', 'metadata'],
            '': ['ast']
          }
        },
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    const response: CompileOutput = {
      success: true,
      result: output
    };

    self.postMessage(response);
  } catch (error) {
    const response: CompileOutput = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during compilation'
    };
    self.postMessage(response);
  }
};