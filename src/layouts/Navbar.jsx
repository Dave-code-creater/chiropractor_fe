'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    HomeIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

import { NAV_LINKS, SERVICES } from '../constants/navbar'




export default function Example() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
                <a href="/" className="-m-1.5 p-1.5 flex items-center">
                    <span className="text-2xl font-semibold text-gray-900">DR. DIEU PHAN D.C.</span>
                </a>
            </div>
            <div className="flex lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                </button>
            </div>
            <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                <Popover className="relative">
                    <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                        Service
                        <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                    </PopoverButton>

                    <PopoverPanel
                        transition
                        className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                    >
                        <div className="p-4">
                            {SERVICES.map((item) => (
                                <div
                                    key={item.name}
                                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                                >
                                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                                    </div>
                                    <div className="flex-auto">
                                        <a href={item.href} className="block font-semibold text-gray-900">
                                            {item.name}
                                            <span className="absolute inset-0" />
                                        </a>
                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </PopoverPanel>
                </Popover>

                {NAV_LINKS.map((item) => (
                    <a href={item.href} className="text-sm/6 flex font-semibold text-gray-900">
                        {<item.icon aria-hidden="true" className="size-6 mr-2 flex-none text-gray-400" />}

                        {item.title}
                    </a>

                ))}
            </PopoverGroup>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a href="/login" className="text-sm/6 font-semibold text-gray-900">
                    Log in <span aria-hidden="true">&rarr;</span>
                </a>
            </div>
        </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            D.R DIEU PHAN D.C.
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton className="group w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        <Disclosure>
                                            {({ open }) => (
                                                <>
                                                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5  text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                                        Product
                                                        <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />


                                                    </DisclosureButton>

                                                    <DisclosurePanel className="space-y-2 px-3 py-2">
                                                        {SERVICES.map((item) => (
                                                            <a
                                                                key={item.name}
                                                                href={item.href}
                                                                className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <div className="font-semibold">{item.name}</div>
                                                                <p className="text-xs text-gray-500">{item.description}</p>
                                                            </a>
                                                        ))}
                                                    </DisclosurePanel>
                                                </>
                                            )}
                                        </Disclosure>
                                    </DisclosureButton>

                                </Disclosure>

                                {NAV_LINKS.map((item) => (
                                    <a
                                        key={item.title}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.title}
                                    </a>
                                ))}
                            </div>
                            <div className="py-6">
                                <a
                                    href="/login"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
