import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`border-b border-slate-200 dark:border-slate-800 last:border-b-0 ${isOpen ? '' : ''}`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded-sm"
      >
        <span className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`flex-shrink-0 transition-colors ${isOpen ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'}`}
        >
          <ChevronRight size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
              {typeof answer === 'string' ? <p>{answer}</p> : answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
