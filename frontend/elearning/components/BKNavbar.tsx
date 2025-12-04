"use client"
import React from 'react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';

function BKNavbar() {
    const router = useRouter()
    return (
        <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5  dark:bg-neutral-800 dark:border-neutral-700">
            <nav className="w-full px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="me-5">
                    <a className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-none focus:opacity-80" href="#" aria-label="Preline">
                        <Image className="w-28 h-auto" src="https://lms.hcmut.edu.vn/pluginfile.php/3/theme_academi/logo/1725955904/logoBK.png" alt='demo' width={100} height={100} />
                    </a>
                </div>

                <div className="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3">
                    

                    <div className="hidden md:block w-full">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                                <svg className="shrink-0 size-4 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                            <input type="text" className="py-2 ps-10 pe-16 block w-full bg-white border rounded-2xl border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600" placeholder="Search" />
                            <div className="hidden absolute inset-y-0 end-0 items-center pointer-events-none z-20 pe-1">
                                <button type="button" className="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500" aria-label="Close">
                                    <span className="sr-only">Close</span>
                                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                </button>
                            </div>                       
                        </div>
                    </div>
                </div>

                <div className="flex w-full items-center justify-end gap-x-1 md:gap-x-2 ms-auto py-1 md:ps-6 md:order-3 md:col-span-3">
                    <button 
                    type="button" 
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-2xl bg-white border border-sky-600 text-sky-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white dark:focus:text-white"
                    onClick={() => {
                        router.push('/login')
                    }}>
                        Đăng nhập
                    </button>
                    <button 
                    type="button" 
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-2xl bg-white border border-sky-600 text-sky-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-white/10 dark:text-white dark:hover:text-white dark:focus:text-white"
                    onClick={() => {
                        router.push('signup')
                    }}>
                        Đăng kí
                    </button>     
                </div>
            </nav>
        </header>


    );
}

export default BKNavbar;