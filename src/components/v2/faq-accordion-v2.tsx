"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FaqAccordionV2Props {
  question: string
  answer: string
}

export function FaqAccordionV2({ question, answer }: FaqAccordionV2Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="v2-glass overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm font-medium text-white pr-4">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-white/50 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-acl-orange" : ""
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-all"
        style={{
          maxHeight: isOpen ? "500px" : "0",
          transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="px-6 pb-4 text-sm text-white/60 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  )
}
