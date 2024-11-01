import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from './UserContext';
export default function Header() {
    const user = useUser();

    return (
        <>
        <div className="bg-[#242F3D] max-h-[76px] w-full h-full">
            <div className="max-w-[1216px] w-full mx-auto flex py-6 h-full justify-between items-center">
            <div className="flex gap-20 items-center">
                <Image src="assets/img/logo_main.svg" width={170} height={25} className="w-[170px] h-[25px]" alt="webconnect"/>
                <div className="flex gap-3 items-center">
                    <Link href="/equipment" className="font-semibold text-sm text-[#7F91A4] active:text-white hover:text-white duration-150">
                        <span>Оборудование</span>
                    </Link>
                    <Link href="/equipment" className="font-semibold text-sm text-[#7F91A4] active:text-white hover:text-white duration-150">
                        <span>Почты</span>
                    </Link>
                    <Link href="/equipment" className="font-semibold text-sm text-[#7F91A4] active:text-white hover:text-white duration-150">
                        <span>Пользватели</span>
                    </Link>
                    <Link href="/equipment" className="font-semibold text-sm text-[#7F91A4] active:text-white hover:text-white duration-150">
                        <span>Загрузить</span>
                    </Link>
                </div>
            </div>
                <div className="flex items-center gap-3">
                
                </div>
            </div>
        </div>
        </>
    )
}
