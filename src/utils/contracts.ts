export const CONTRACT_ADDRESSES = {
	electroneumTestnet: "0x07cE893Ce0Cc30b96fcD21B9a8352D23671f1Cd4",
	apothemTestnet: "0xCD9735e5bdc463531709990cFB70b9156327c19d",
	eduChainTestnet: "0x0b2Bf2D8Ef1Be332ba303E5BCa81d67A48bF7076",
	celoAlfajoresTestnet: "0x9fE70671061Fdf1227Fa3667AFDc17c730865325", 
  } as const;

// celo 0x9fE70671061Fdf1227Fa3667AFDc17c730865325
// edu testnet 0x0b2Bf2D8Ef1Be332ba303E5BCa81d67A48bF7076

export const AUDIT_REGISTRY_ABI =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "contractHash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "stars",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "summary",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "auditor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AuditRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "contractHash",
				"type": "bytes32"
			},
			{
				"internalType": "uint8",
				"name": "stars",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "summary",
				"type": "string"
			}
		],
		"name": "registerAudit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "auditor",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"name": "setAuditor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "auditorHistory",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contractAudits",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "stars",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "summary",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "auditor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "startIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "limit",
				"type": "uint256"
			}
		],
		"name": "getAllAudits",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "contractHashes",
				"type": "bytes32[]"
			},
			{
				"internalType": "uint8[]",
				"name": "stars",
				"type": "uint8[]"
			},
			{
				"internalType": "string[]",
				"name": "summaries",
				"type": "string[]"
			},
			{
				"internalType": "address[]",
				"name": "auditors",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "timestamps",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "auditor",
				"type": "address"
			}
		],
		"name": "getAuditorHistory",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "contractHash",
				"type": "bytes32"
			}
		],
		"name": "getContractAudits",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint8",
						"name": "stars",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "summary",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "auditor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct AuditRegistry.Audit[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "contractHash",
				"type": "bytes32"
			}
		],
		"name": "getLatestAudit",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint8",
						"name": "stars",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "summary",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "auditor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct AuditRegistry.Audit",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalContracts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isAuditor",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalAudits",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const;

export type ChainKey = keyof typeof CONTRACT_ADDRESSES;
