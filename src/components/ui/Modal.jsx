import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

const SIZE_CLASSES = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Modal — Headless UI Dialog with dark overlay.
 * @param {boolean} open
 * @param {Function} onClose
 * @param {string} title
 * @param {'md'|'lg'|'xl'} size
 * @param {React.ReactNode} children
 */
export function Modal({ open, onClose, title, size = 'md', children }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={[
                  'w-full rounded-2xl bg-surface-800 border border-surface-600 shadow-2xl',
                  SIZE_CLASSES[size] || SIZE_CLASSES.md,
                ].join(' ')}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600">
                  <Dialog.Title className="text-white font-display font-semibold text-base">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Body */}
                <div className="px-6 py-5">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
