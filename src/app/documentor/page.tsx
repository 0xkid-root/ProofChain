"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mistral } from '@mistralai/mistralai';
import {
  FileText,
  Copy,
  Check,
  Function as FunctionIcon,
  Database,
  Bell,
  Robot,
  CircleNotch,
  DownloadSimple,
  Lightning,
  Article,
  BookOpen
} from 'phosphor-react';

const mistralClient = new Mistral({
  apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY!
});

interface Parameter {
  name: string;
  type: string;
  description?: string;
  indexed?: boolean;
}

interface Function {
  name: string;
  description: string;
  params: Parameter[];
  visibility: string;
}

interface Event {
  name: string;
  description: string;
  params: Parameter[];
}

interface Variable {
  name: string;
  type: string;
  visibility: string;
  description: string;
}

interface Documentation {
  name: string;
  description: string;
  version: string;
  license: string;
  functions?: Function[];
  events?: Event[];
  variables?: Variable[];
}

const ContractDocsGenerator = () => {
  const [contractCode, setContractCode] = useState<string>('');
  const [documentation, setDocumentation] = useState<Documentation | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const generateDocs = async () => {
    if (!contractCode.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `You are an expert Solidity smart contract analyzer. Analyze this smart contract and provide a structured documentation object.
      The response should be ONLY a valid JSON object with the following structure:
      {
        "name": "contract name",
        "description": "brief description of what the contract does",
        "version": "solidity version",
        "license": "license type",
        "functions": [
          {
            "name": "function name",
            "description": "what the function does",
            "params": [
              {
                "name": "parameter name",
                "type": "parameter type",
                "description": "parameter description"
              }
            ],
            "visibility": "public/private/internal/external"
          }
        ],
        "events": [
          {
            "name": "event name",
            "description": "what the event represents",
            "params": [
              {
                "name": "parameter name",
                "type": "parameter type",
                "indexed": boolean
              }
            ]
          }
        ],
        "variables": [
          {
            "name": "variable name",
            "type": "variable type",
            "visibility": "public/private/internal",
            "description": "what the variable represents"
          }
        ]
      }

      Contract code to analyze:
      ${contractCode}

      Important:
      1. Return ONLY the JSON object, no additional text or backticks
      2. Include all public and external functions
      3. Document all events
      4. Include all public state variables
      5. Keep descriptions concise but informative
      6. Ensure the JSON is valid and properly formatted
      `;

      const response = await mistralClient.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        maxTokens: 4096,
      });

      let jsonString = response.choices?.[0]?.message?.content || '';
      if (typeof jsonString === 'string') {
        jsonString = jsonString.trim();
        if (jsonString.startsWith('```json')) jsonString = jsonString.substring(7).trimStart();
        if (jsonString.endsWith('```')) jsonString = jsonString.slice(0, -3).trimEnd();
      }

      try {
        const parsedDocs = JSON.parse(typeof jsonString === 'string' ? jsonString : '') as Documentation;
        setDocumentation(parsedDocs);
      } catch (parseError) {
        console.error('Failed to parse Mistral response:', parseError, jsonString);
        setError('Failed to parse contract documentation. Ensure the smart contract is valid. Please try again.');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setError('Failed to generate documentation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadDocs = () => {
    if (!documentation) return;
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);

    const markdownContent = `# ${documentation.name}

${documentation.description}

**Version:** ${documentation.version}
**License:** ${documentation.license}

## Functions

${documentation.functions?.map(func => `### ${func.name}
* **Visibility:** ${func.visibility}
* **Description:** ${func.description}
${func.params.length ? `* **Parameters:**
${func.params.map(param => `  * \`${param.name}\` (${param.type}) - ${param.description}`).join('\n')}` : ''}`).join('\n\n')}

## Events

${documentation.events?.map(event => `### ${event.name}
* **Description:** ${event.description}
${event.params.length ? `* **Parameters:**
${event.params.map(param => `  * \`${param.name}\` (${param.type})${param.indexed ? ' - indexed' : ''}`).join('\n')}` : ''}`).join('\n\n')}

## State Variables

${documentation.variables?.map(variable => `### ${variable.name}
* **Type:** ${variable.type}
* **Visibility:** ${variable.visibility}
* **Description:** ${variable.description}`).join('\n\n')}`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentation.name.toLowerCase()}-documentation.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen py-12 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="inline-block mb-3 px-4 py-1 rounded-full bg-purple-600/20 border border-purple-600/30">
            <span className="text-purple-400 text-sm font-semibold">Smart Contract Docs</span>
          </div>
          <h1 className="text-3xl font-mono font-bold mb-4 text-purple-400">Smart Contract Documentation</h1>
          <p className="text-purple-300">Generate clear and comprehensive documentation for your smart contracts</p>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 bg-red-600/20 border border-red-600/30 text-red-400 px-4 py-2 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <div className="bg-purple-950/30 rounded-lg border border-purple-900 hover:border-purple-600/50 transition-colors duration-300 shadow-lg">
              <div className="p-4 border-b border-purple-900 flex items-center gap-2">
                <FileText className="text-purple-400" size={20} weight="duotone" />
                <span className="font-mono text-white">Contract Input</span>
              </div>
              <textarea
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                placeholder="Paste your contract code here..."
                className="w-full h-[400px] bg-transparent p-6 font-mono text-sm resize-none focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/50 transition-all duration-200 text-white custom-scrollbar"
              />
            </div>
            <button
              onClick={generateDocs}
              disabled={!contractCode || isGenerating}
              className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 ${isGenerating || !contractCode
                ? 'bg-purple-950 text-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <CircleNotch className="animate-spin" size={20} weight="bold" />
                  Generating Documentation...
                </>
              ) : (
                <>
                  <BookOpen size={20} weight="fill" />
                  Generate Documentation
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex-1 bg-purple-950/30 rounded-lg border border-purple-900 hover:border-purple-600/50 transition-colors duration-300 shadow-lg">
              <div className="p-4 border-b border-purple-900 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Article className="text-purple-400" size={20} weight="duotone" />
                  <span className="font-mono text-white">Documentation</span>
                </div>
                {documentation && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(documentation, null, 2))}
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-purple-600/20"
                    >
                      {copySuccess ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
                      {copySuccess ? 'Copied!' : 'Copy JSON'}
                    </button>
                    <button
                      onClick={downloadDocs}
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-purple-600/20"
                    >
                      {downloadSuccess ? <Check size={16} weight="bold" /> : <DownloadSimple size={16} weight="bold" />}
                      {downloadSuccess ? 'Downloaded!' : 'Download MD'}
                    </button>
                  </div>
                )}
              </div>

              <div className="h-[600px] overflow-auto p-6 custom-scrollbar">
                {documentation ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 text-purple-400">{documentation.name}</h2>
                      <p className="text-purple-300">{documentation.description}</p>
                      <div className="flex gap-4 mt-3">
                        <span className="text-sm bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-600/30">v{documentation.version}</span>
                        <span className="text-sm bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-600/30">{documentation.license} License</span>
                      </div>
                    </div>

                    {documentation.functions?.length ? (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <FunctionIcon className="text-purple-400" size={20} weight="duotone" />
                          <h3 className="text-lg font-semibold text-purple-400">Functions</h3>
                        </div>
                        <div className="space-y-4">
                          {documentation.functions.map((func, index) => (
                            <div key={index} className="bg-purple-900/50 rounded-lg p-4 border border-purple-800/70 hover:border-purple-600/50 transition-colors duration-200">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-mono text-purple-400">{func.name}</span>
                                <span className="text-sm px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30">{func.visibility}</span>
                              </div>
                              <p className="text-sm text-purple-300 mb-3">{func.description}</p>
                              {func.params?.length > 0 && (
                                <div className="mt-2 bg-purple-950/50 rounded p-3">
                                  <div className="text-sm text-purple-300 mb-2">Parameters:</div>
                                  {func.params.map((param, i) => (
                                    <div key={i} className="ml-3 text-sm flex items-start mb-1">
                                      <span className="text-purple-400 font-mono">{param.name}</span>
                                      <span className="text-purple-500 mx-1">({param.type})</span>
                                      <span className="text-purple-300"> - {param.description}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {(documentation.events?.length ?? 0) > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Bell className="text-purple-400" size={20} weight="duotone" />
                          <h3 className="text-lg font-semibold text-purple-400">Events</h3>
                        </div>
                        <div className="space-y-4">
                          {documentation.events?.map((event, index) => (
                            <div key={index} className="bg-purple-900/50 rounded-lg p-4 border border-purple-800/70 hover:border-purple-600/50 transition-colors duration-200">
                              <div className="font-mono text-purple-400 mb-2">{event.name}</div>
                              <p className="text-sm text-purple-300 mb-3">{event.description}</p>
                              <div className="space-y-1 bg-purple-950/50 rounded p-3">
                                {event.params?.map((param, i) => (
                                  <div key={i} className="text-sm flex items-center">
                                    <span className="text-purple-400 font-mono">{param.name}</span>
                                    <span className="text-purple-500 mx-1">({param.type})</span>
                                    {param.indexed && (
                                      <span className="text-sm px-2 py-0.5 ml-2 rounded-full bg-yellow-600/20 text-yellow-300 border border-yellow-600/30">indexed</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(documentation.variables?.length ?? 0) > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Database className="text-purple-400" size={20} weight="duotone" />
                          <h3 className="text-lg font-semibold text-purple-400">State Variables</h3>
                        </div>
                        <div className="space-y-4">
                          {documentation.variables?.map((variable, index) => (
                            <div key={index} className="bg-purple-900/50 rounded-lg p-4 border border-purple-800/70 hover:border-purple-600/50 transition-colors duration-200">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-mono text-purple-400">{variable.name}</span>
                                <div className="flex space-x-2">
                                  <span className="text-sm px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30">{variable.type}</span>
                                  <span className="text-sm px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30">{variable.visibility}</span>
                                </div>
                              </div>
                              <p className="text-sm text-purple-300">{variable.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-purple-300">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-2xl"></div>
                      <BookOpen size={64} className="text-purple-400 relative z-10 mb-6" weight="duotone" />
                    </div>
                    <h3 className="text-xl font-mono mb-4 text-white">Contract Documentation</h3>
                    <p className="text-purple-300 mb-6 text-center max-w-md">
                      Paste your contract code and generate documentation to automatically create a detailed reference
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30">
                        Function Documentation
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30">
                        Event Descriptions
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30">
                        State Variables
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30">
                        Markdown Export
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(107, 70, 193, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(107, 70, 193, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 70, 193, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ContractDocsGenerator;