import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import type { Place } from '../utils/places'

type Props = {
  open: boolean
  onClose: () => void
  place: Place | null
}

export function PlaceDetailsModal({ open, onClose, place }: Props) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-slate-900 border border-white/10 p-6 text-left align-middle shadow-xl">
                <Dialog.Title className="text-lg font-bold mb-1">{place?.name}</Dialog.Title>
                <p className="text-sm text-slate-300 mb-4">{place?.city}</p>
                {place?.description && <p className="text-sm text-slate-200 mb-4">{place.description}</p>}
                {place?.address && (
                  <p className="text-sm text-slate-300 mb-4">
                    <span className="font-semibold">Dirección:</span> {place.address}
                  </p>
                )}
                {place && (
                  <div className="mt-2 mb-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((place.address || `${place.name}, ${place.city ?? ''}`).trim())}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 underline"
                    >
                      Abrir en Google Maps
                    </a>
                  </div>
                )}
                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white">
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
