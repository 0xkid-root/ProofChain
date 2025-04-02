// Shared types for Solidity compilation

export type CompileInput = {
  sourceCode: string;
  version: string;
};

export type CompileOutput = {
  success: boolean;
  result?: any;
  error?: string;
};