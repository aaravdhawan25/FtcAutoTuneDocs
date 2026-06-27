import { useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import groovy from 'react-syntax-highlighter/dist/esm/languages/prism/groovy'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useTheme } from '../context'

SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('groovy', groovy)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('yaml', yaml)

export function CodeBlock({ code, language = 'java', className = '' }) {
  const [copied, setCopied] = useState(false)
  const { isDark } = useTheme()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const el = document.createElement('textarea')
      el.value = code.trim()
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const LANG_MAP = {
    java: 'Java',
    groovy: 'Groovy',
    js: 'JavaScript',
    jsx: 'JSX',
    bash: 'Bash',
    yaml: 'YAML',
  }

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-700/50 dark:border-slate-700 bg-slate-900 ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/50">
        <span className="text-xs font-mono text-slate-400 font-medium tracking-wide uppercase">
          {LANG_MAP[language] || language}
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors duration-150 px-2 py-1 rounded-md hover:bg-slate-700/50"
        >
          {copied ? (
            <>
              <Check size={13} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language === 'groovy' ? 'groovy' : language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          background: 'transparent',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          fontFamily: '"JetBrains Mono", monospace',
        }}
        codeTagProps={{
          style: {
            fontFamily: '"JetBrains Mono", monospace',
          },
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  )
}
