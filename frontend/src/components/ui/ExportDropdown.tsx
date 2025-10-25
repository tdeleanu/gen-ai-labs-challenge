"use client"

import { useState, useRef, useEffect } from 'react'
import { HiOutlineDotsVertical, HiDownload } from 'react-icons/hi'
import { FiFile, FiFileText } from 'react-icons/fi'
import { SiJson } from 'react-icons/si'
import type { Experiment } from '@/types/experiment'
import type { ExportFormat } from '@/lib/export'
import { useExport } from '@/hooks/useExport'

interface ExportDropdownProps {
  experiment: Experiment
  variant?: 'default' | 'icon-only'
  size?: 'sm' | 'md' | 'lg'
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'json',
    label: 'JSON',
    icon: <SiJson className="w-4 h-4" />,
    description: 'Complete data structure',
  },
  {
    value: 'csv',
    label: 'CSV',
    icon: <FiFile className="w-4 h-4" />,
    description: 'Spreadsheet format',
  },
  {
    value: 'md',
    label: 'Markdown',
    icon: <FiFileText className="w-4 h-4" />,
    description: 'Formatted report',
  },
]

export function ExportDropdown({ experiment, variant = 'default', size = 'md' }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { exportExperiment, isExporting } = useExport()

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      })
    }
  }, [isOpen])

  const handleExport = (format: ExportFormat) => {
    exportExperiment(experiment, format)
    setIsOpen(false)
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const buttonClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={`
          inline-flex items-center gap-2 rounded-lg
          bg-white border border-gray-300
          hover:bg-gray-50 hover:border-gray-400
          active:bg-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          font-medium text-gray-700
          ${buttonClasses[size]}
          ${variant === 'icon-only' ? 'px-2' : ''}
        `}
      >
        {variant === 'default' && (
          <>
            <HiDownload className="w-4 h-4" />
            <span>Export</span>
          </>
        )}
        <HiOutlineDotsVertical className={`w-4 h-4 ${variant === 'default' ? 'opacity-60' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className="fixed w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in duration-150"
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`,
            }}
          >
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                Export Format
              </p>
            </div>

            {FORMAT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleExport(option.value)}
                disabled={isExporting}
                className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex-shrink-0 mt-0.5 text-gray-600">
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </div>
                </div>
              </button>
            ))}

            <div className="border-t border-gray-100 mt-1 pt-2 px-3 pb-2">
              <p className="text-xs text-gray-400">
                Downloads will start automatically
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
