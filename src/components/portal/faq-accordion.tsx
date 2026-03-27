"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FaqAccordionProps {
  question: string
  answer: string
}

export function FaqAccordion({ question, answer }: FaqAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-100/80 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-acl-light/50 transition-colors"
      >
        <span className="text-sm font-medium text-acl-dark pr-4">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-acl-gray flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-350"
        style={{
          maxHeight: isOpen ? "500px" : "0",
          transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="px-6 pb-4 text-sm text-acl-gray leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  )
}
