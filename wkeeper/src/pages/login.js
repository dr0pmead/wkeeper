import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { motion } from "framer-motion";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(true)
    const loginRef = useRef(null);
    const passwordRef = useRef(null);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleKeyDown = (e, buttonRef) => {
        const isCharacterKey = e.key.length === 1;

        if (e.type === 'keydown' && isCharacterKey && buttonRef.current && e.target === buttonRef.current) {
            console.log(1)
          if (buttonRef === loginRef) {
            setErrorMessage(false);
          } else if (buttonRef === passwordRef) {
            setErrorMessage(false);
          }
        }
      };

    return (
        <>
        <Head>
            <title>Войти в WebConnect</title>
        </Head>
            <div className="flex items-center justify-center h-screen w-full max-w-sm mx-auto">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-3 relative">
                        <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className={`${errorMessage ? ( '' ) : ( 'hidden' ) } absolute -top-20 px-4 py-2 text-sm font-semibold bg-[#FF6270]/50 border-[#FF6270] border text-white rounded-xl w-full`}>
                        
                            <div className="flex items-center gap-3">
                                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0ZM10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13ZM10 4C9.75507 4.00003 9.51866 4.08996 9.33563 4.25272C9.15259 4.41547 9.03566 4.63975 9.007 4.883L9 5V11C9.00028 11.2549 9.09788 11.5 9.27285 11.6854C9.44782 11.8707 9.68695 11.9822 9.94139 11.9972C10.1958 12.0121 10.4464 11.9293 10.6418 11.7657C10.8373 11.6021 10.9629 11.3701 10.993 11.117L11 11V5C11 4.73478 10.8946 4.48043 10.7071 4.29289C10.5196 4.10536 10.2652 4 10 4Z" fill="#FF6270"/>
                                </svg>
                                <div className="flex flex-col">
                                    <span>Произошла ошибка</span>
                                    <span className="text-[13px] text-white/70 font-light">Пожалуйста повторите попытку позднее.</span>
                                </div>
                            </div>

                        </motion.div>
                        <div className="flex flex-col gap-3">
                            <span className="text-[#7F91A4] font-semibold text-[13px]">Логин или Email</span>
                            <input tabIndex="0" ref={loginRef} onKeyDown={(e) => handleKeyDown(e, loginRef)} className={`px-4 py-2 text-md font-semibold bg-transparent border border-[#768A9E]/20 w-full rounded-lg text-white duration-200 ${errorMessage ? ('hover:border-[#FF6270] border-[#FF6270] focus:ring-2 focus:ring-[#FF6270]') : ('hover:border-[#7177F8] focus:ring-2 focus:ring-[#7177F8]')} outline-none ring-0`}/>
                            <span></span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-[#7F91A4] font-semibold text-[13px]">Пароль</span>
                            <div className="relative">
                                <input tabIndex="0" ref={passwordRef} onKeyDown={(e) => handleKeyDown(e, passwordRef)} type={showPassword ? 'text' : 'password'} className={`px-4 pr-12 py-2 text-md font-semibold bg-transparent border border-[#768A9E]/20 w-full rounded-lg text-white duration-200 ${errorMessage ? ('hover:border-[#FF6270] border-[#FF6270] focus:ring-2 focus:ring-[#FF6270]') : ('hover:border-[#7177F8] focus:ring-2 focus:ring-[#7177F8]')} outline-none ring-0`}/>
                                <button onClick={handleShowPassword} className="flex items-center justify-center absolute right-3 top-[50%] -translate-y-[50%] group">
                                    {showPassword ? (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="*:fill-[#7F91A4] group-hover:*:fill-white" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 5.27L3.28 4L20 20.72L18.73 22L15.65 18.92C14.5 19.3 13.28 19.5 12 19.5C7 19.5 2.73 16.39 1 12C1.69 10.24 2.79 8.69 4.19 7.46L2 5.27ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15.0005 12.3406 14.943 12.6787 14.83 13L11 9.17C11.3213 9.05698 11.6594 8.99949 12 9ZM12 4.5C17 4.5 21.27 7.61 23 12C22.1834 14.0729 20.7966 15.8723 19 17.19L17.58 15.76C18.9629 14.8034 20.0783 13.5091 20.82 12C20.0117 10.3499 18.7565 8.95963 17.1974 7.98735C15.6382 7.01508 13.8375 6.49976 12 6.5C10.91 6.5 9.84 6.68 8.84 7L7.3 5.47C8.74 4.85 10.33 4.5 12 4.5ZM3.18 12C3.98835 13.6501 5.24346 15.0404 6.80264 16.0126C8.36182 16.9849 10.1625 17.5002 12 17.5C12.69 17.5 13.37 17.43 14 17.29L11.72 15C11.0242 14.9254 10.3748 14.6149 9.87997 14.12C9.38512 13.6252 9.07458 12.9758 9 12.28L5.6 8.87C4.61 9.72 3.78 10.78 3.18 12Z"/>
                                        </svg>
                                    ) : ( 
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="*:fill-[#7F91A4] group-hover:*:fill-white" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9ZM12 4.5C17 4.5 21.27 7.61 23 12C21.27 16.39 17 19.5 12 19.5C7 19.5 2.73 16.39 1 12C2.73 7.61 7 4.5 12 4.5ZM3.18 12C3.98825 13.6503 5.24331 15.0407 6.80248 16.0133C8.36165 16.9858 10.1624 17.5013 12 17.5013C13.8376 17.5013 15.6383 16.9858 17.1975 16.0133C18.7567 15.0407 20.0117 13.6503 20.82 12C20.0117 10.3497 18.7567 8.95925 17.1975 7.98675C15.6383 7.01424 13.8376 6.49868 12 6.49868C10.1624 6.49868 8.36165 7.01424 6.80248 7.98675C5.24331 8.95925 3.98825 10.3497 3.18 12Z"/>
                                        </svg>                                        
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <button className="mt-2 px-[20px] py-[10px] text-md font-semibold flex items-center justify-center bg-[#7177F8] hover:bg-[#525AFF] duration-150 rounded-xl text-white text-sm">
                        {isLoading ? ( <Spinner/> ) : ( 'Войти в панель управления' ) }
                    </button>
                </div>
            </div>
        </>
    );
};

