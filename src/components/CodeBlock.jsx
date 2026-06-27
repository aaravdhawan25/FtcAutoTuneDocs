import { useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import groovy from 'react-syntax-highlighter/dist/esm/languages/prism/groovy'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('groovy', groovy)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('yaml', yaml)

const LANG_LABEL = { java: 'Java', groovy: 'Groovy', bash: 'Bash', yaml: 'YAML' }

// Custom dark style — more refined than vscDarkPlus defaults
const codeStyle = {
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: 'transparent',
    margin: 0,
    padding: '1rem 1.25rem',
    fontSize: '0.8125rem',
    lineHeight: '1.7',
    fontFamily: '"JetBrains Mono", monospace',
  },
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: '"JetBrains Mono", monospace',
  },
}

export function CodeBlock({ code, language = 'java', className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim())
    } catch {
      const el = Object.assign(document.createElement('textarea'), { value: code.trim() })
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-[#1e1e2e] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#16162a] border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/60" />
          </span>
          <span className="text-[11px] font-mono text-slate-500 ml-1">
            {LANG_LABEL[language] || language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : 'Copy code'}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md transition-all duration-150 ${
            copied
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          {copied ? (
            <><Check size={11} strokeWidth={2.5} />Copied!</>
          ) : (
            <><Copy size={11} />Copy</>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={codeStyle}
          codeTagProps={{ style: { fontFamily: '"JetBrains Mono", monospace' } }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
