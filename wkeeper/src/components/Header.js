import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from './UserContext';
import { useRouter } from 'next/router';

export default function Header() {
    const user = useUser();
    const router = useRouter();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const isActiveLink = (href) => {
        return router.pathname === href ? 'text-white' : 'text-[#7F91A4]';
    };

    return (
        <>
           <div className="bg-[#242F3D] w-full h-full">
            <div className="max-w-[1216px] w-full mx-auto flex p-6 h-full justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-20">
                    <Image src="/assets/img/logo_main.svg" width={170} height={25} alt="webconnect" className="w-[170px] h-[25px]" />
                    
                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-6 items-center">
                        <Link href="/equipment" className={`font-semibold text-sm hover:text-white duration-150 ${isActiveLink('/equipment')}`}>
                            Оборудование
                        </Link>
                        <Link href="/mails" className={`font-semibold text-sm hover:text-white duration-150 ${isActiveLink('/mails')}`}>
                            Почты
                        </Link>
                        <Link href="/users" className={`font-semibold text-sm hover:text-white duration-150 ${isActiveLink('/users')}`}>
                            Пользователи
                        </Link>
                        <Link href="/upload" className={`font-semibold text-sm hover:text-white duration-150 ${isActiveLink('/upload')}`}>
                            Загрузить
                        </Link>
                    </div>
                </div>

                {/* User Section */}
                <div className="hidden md:flex items-center gap-3">
                    <span className="text-sm text-white font-bold">{user?.username}</span>
                    <Image src="/assets/img/user.svg" alt="User" width={22} height={22} />
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.54503L5.36572 5.57508L10.1689 1.54492" stroke="#7F91A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={toggleMobileMenu} className="md:hidden flex items-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>

            {/* Mobile Menu with Slide-in Effect */}
            <div
                className={`fixed inset-y-0 right-0 bg-[#1E293B] z-50 w-full md:w-[300px] transform ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 ease-in-out`}
            >
                <div className="flex flex-col items-center justify-between p-8 h-full">
                    <button onClick={toggleMobileMenu} className="absolute top-4 right-4 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <div className="flex flex-col items-start justify-start w-full gap-10 mt-10">
                            <Link href="/equipment" onClick={toggleMobileMenu} className={`font-semibold hover:text-white hover:pl-4 pl-4 w-full text-2xl duration-150 ${isActiveLink('/equipment')}`}>
                                Оборудование
                            </Link>
                            <Link href="/mails" onClick={toggleMobileMenu} className={`font-semibold hover:text-white hover:pl-4 text-2xl w-full duration-150 ${isActiveLink('/mails')}`}>
                                Почты
                            </Link>
                            <Link href="/users" onClick={toggleMobileMenu} className={`font-semibold hover:text-white hover:pl-4 text-2xl w-full duration-150 ${isActiveLink('/users')}`}>
                                Пользователи
                            </Link>
                            <Link href="/upload" onClick={toggleMobileMenu} className={`font-semibold hover:text-white hover:pl-4 text-2xl w-full duration-150 ${isActiveLink('/upload')}`}>
                                Загрузить
                            </Link>
                        </div>

                    {/* User Section in Mobile Menu */}
                    <div className="flex items-center justify-start w-full gap-3 mt-8">
                        <span className="text-lg text-white font-bold">{user?.username}</span>
                        <Image src="/assets/img/user.svg" alt="User" width={24} height={24} />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
