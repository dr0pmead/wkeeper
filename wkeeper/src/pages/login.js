import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/components/UserContext';
import Head from 'next/head';
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import Cookies from 'js-cookie';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { parseCookies } from 'nookies';
import { authenticateUser, verifyTwoFA } from '@/utils/api';
import { useRouter } from 'next/router';
const schema = yup.object().shape({
    emailOrLogin: yup
      .string()
      .required('Введите email или логин')
      .min(4, 'Минимум 4 символа')
      .matches(/^[a-zA-Z0-9.@]+$/, 'Только английские буквы'),
    password: yup
      .string()
      .required('Введите пароль')
      .min(8, 'Пароль должен быть минимум 8 символов'),
  });
  

// export async function getServerSideProps(context) {
//     const cookies = parseCookies(context);
//     const token = cookies.token;

//     if (token) {
//         return {
//         redirect: {
//             destination: '/',
//             permanent: false,
//         },
//         };
//     }

//     return {
//         props: {}, // Данные для страницы логина
//     };
// }

export default function Login({ context }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema),
      });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const cookies = parseCookies(context);
    const [isTwoFA, setIsTwoFA] = useState(false); // состояние для 2FA
    const [qrCode, setQrCode] = useState(null); // для отображения QR-кода
    const [manualCode, setManualCode] = useState(''); // код для ручной привязки
    const [twofaRequired, setTwofaRequired] = useState(false);
    const [welcomeMessage, setWelcomMessage] = useState('')
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([])
    const router = useRouter();
    const [userIdServer, setUserIdServer] = useState(null);
    const [isAuthTwoFA, setIsAuthTwoFA] = useState(false)
    const user = useUser();
    
    const changeLoginValue = () => {
      setErrorMessage(''); // очищаем сообщение об ошибке
    };
    
    const changePasswordValue = () => {
      setErrorMessage(''); // очищаем сообщение об ошибке
    };
        
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    
    const onSubmit = async (data) => {
        setIsLoading(true);
    
        try {
            const response = await authenticateUser(data.emailOrLogin, data.password);
    
            if (response.success) {
                if (response.data.twofaRequired) {
                    setTwofaRequired(true);
                    setIsTwoFA(true);
                    setQrCode(response.data.qrcode);
                    setManualCode(response.data.manualCode);
                    setWelcomMessage(response.data.message);
                    setUserIdServer(response.data.userId); // сохраняем userId
    
                } else if (response.data.twofaEnable) {
                    setIsTwoFA(true);
                    setIsAuthTwoFA(true);
                    setUserIdServer(response.data.userId); // сохраняем userId
                    setWelcomMessage('Введите 6-ти значный код из приложения.');
                } else {
                    // В случае, если оба условия ложны, значит, произошла ошибка
                    throw new Error('Неизвестное состояние авторизации. Пожалуйста, попробуйте позже.');
                }
            } else {
                // Если авторизация не успешна, обработаем сообщение об ошибке
                setErrorMessage(response.error || 'Ошибка авторизации. Проверьте данные и попробуйте снова.');
            }
        } catch (error) {
            console.error('Ошибка при выполнении авторизации:', error);
            setErrorMessage(error.message || 'Произошла ошибка на сервере. Пожалуйста, попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleChange = (index, value) => {
        setErrorMessage('');
        if (!isNaN(value) && value.length <= 1) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Если есть следующая ячейка и значение введено, переключаемся на следующий input
            if (value && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        setErrorMessage('');
        if (e.key === 'Backspace') {
            // Если удаляем символ, очищаем текущий input
            const newCode = [...code];
            newCode[index] = '';
            setCode(newCode);

            // Если есть предыдущий input, переключаемся на него
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const submitVerify = async (code) => {
        setIsLoading(true);
        console.log(userIdServer)
        const verificationCode = Array.isArray(code) ? code.join('') : code;
        const response = await verifyTwoFA(userIdServer, verificationCode); // Передаем userId в функцию verifyTwoFA
        console.log(response)
        if (response.success) {
            router.push('/');
            setIsLoading(false);
        } else {
            setIsLoading(false);
            setErrorMessage(response.message);
        }
    };
    
    return (
        <>
        <Head>
            <title>Войти в WebConnect</title>
        </Head>
        <div className="w-full h-screen relative">
            
            <Image src="/assets/img/logo_main.svg" alt="WebConnect" width={200} height={18} className="top-5 left-5 absolute"/>
            <div className={`flex flex-col items-center justify-start h-screen w-full max-w-md mx-auto gap-6 pt-36 px-6 ${isAuthTwoFA ? 'justify-center pt-0 gap-0' : ''}`}>
            <div className={`flex items-center justify-center  ${welcomeMessage ? '' : 'mb-20' } flex-col gap-6`}>
                {!welcomeMessage ? ( 
                    <Image src="/assets/img/wavingHand.svg" alt="welcome back" width={75} height={75}/>
                ) : ( 
                    <Image src="/assets/img/LockedWithKey.svg" alt="welcome back" width={75} height={75}/>
                )}
            
            {!user ? (
                <span className="text-2xl font-bold text-white">
                    {!welcomeMessage ? "Добро пожаловать!" : <span className="flex items-center justify-center text-center"> {welcomeMessage} </span>}
                </span>
            ) : (
                <span className={`text-2xl font-bold text-white ${isAuthTwoFA ? 'text-center text-md' : ''}`}>{isAuthTwoFA ? ( `${welcomeMessage}` ) : ( `С Возвращением, ${user.username}` ) } </span>
            )}
            </div>
            {isTwoFA ? (
                <div className="flex flex-col gap-3 items-center">
                {isAuthTwoFA ? ( 
                    <div></div>
                ) : ( 
                    <>
                <span className="flex items-center text-white/50 text-center text-sm">Сканируйте QR-код </span>
                <div className="w-64 h-64 bg-white p-4 rounded-lg">
                    <img src={qrCode} alt="QR Code" className="flex items-center justify-center rounded-lg overlow-hidden pointer-events-none"/>
                </div>
                <span className="flex items-center text-white/50 text-center text-sm">или используйте ручной код для настройки 2FA </span>
                <button  className="bg-[#768A9E]/20 px-4 py-2 text-md font-semibold border border-[#768A9E]/20 w-full rounded-lg text-white duration-200 outline-none ring-0 flex items-center justify-center">  {manualCode} </button>
                    </>
                )}
                {errorMessage && (
                    <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className={`px-4 py-2 text-sm font-semibold bg-[#FF6270]/50 border-[#FF6270] border text-white rounded-xl w-full`}>
                    
                        <div className="flex items-center gap-3">
                            <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0ZM10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13ZM10 4C9.75507 4.00003 9.51866 4.08996 9.33563 4.25272C9.15259 4.41547 9.03566 4.63975 9.007 4.883L9 5V11C9.00028 11.2549 9.09788 11.5 9.27285 11.6854C9.44782 11.8707 9.68695 11.9822 9.94139 11.9972C10.1958 12.0121 10.4464 11.9293 10.6418 11.7657C10.8373 11.6021 10.9629 11.3701 10.993 11.117L11 11V5C11 4.73478 10.8946 4.48043 10.7071 4.29289C10.5196 4.10536 10.2652 4 10 4Z" fill="#FF6270"/>
                            </svg>
                            <div className="flex flex-col">
                                <span>Произошла ошибка</span>
                                <span className="text-[13px] text-white/70 font-light">
                                    {errorMessage}
                                </span>
                            </div>
                        </div>

                    </motion.div>
                    )}                                
                <div className="grid grid-cols-6 gap-6 mt-4">
                    {code.map((value, index) => (
                        <input
                            key={index}
                            ref={(el) => inputRefs.current[index] = el}
                            type="text"
                            maxLength="1"
                            disabled={isLoading}
                            value={value}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`${errorMessage ? ('hover:border-[#FF6270] border-[#FF6270] focus:ring-2 focus:ring-[#FF6270]') : ( '' )} disabled:pointer-events-none disabled:bg-[#768A9E]/20 hover:border-[#7177F8] focus:ring-2 focus:ring-[#7177F8] text-center text-3xl px-2 py-2 text-md font-semibold bg-transparent border border-[#768A9E]/20 w-full rounded-lg text-white duration-200 outline-none ring-0`}
                        />
                    ))}
                </div>
                <button 
                    disabled={isLoading} 
                    onClick={() => submitVerify(code)}  // Обернули в анонимную функцию
                    className="disabled:pointer-events-none disabled:opacity-80 mt-2 px-[20px] py-[10px] w-full text-md font-semibold flex items-center justify-center bg-[#7177F8] hover:bg-[#525AFF] duration-150 rounded-xl text-white text-sm">
                    {isLoading ? ( <Spinner size="sm"/> ) : ( 'Отправить' )}
                </button>
            </div>
            ) : (
                <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 w-full transition-all duration-300 ease-in-out"
                style={{
                maxHeight: 'auto', // Увеличиваем max-height в зависимости от количества ошибок
                }}
            >
                <div className="flex flex-col gap-3 relative">
                <div className="absolute -top-20 w-full ">
                <AnimatePresence>
                {errorMessage && (
                    <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className={`px-4 py-2 text-sm font-semibold bg-[#FF6270]/50 border-[#FF6270] border text-white rounded-xl w-full`}>
                    
                        <div className="flex items-center gap-3">
                            <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0ZM10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13ZM10 4C9.75507 4.00003 9.51866 4.08996 9.33563 4.25272C9.15259 4.41547 9.03566 4.63975 9.007 4.883L9 5V11C9.00028 11.2549 9.09788 11.5 9.27285 11.6854C9.44782 11.8707 9.68695 11.9822 9.94139 11.9972C10.1958 12.0121 10.4464 11.9293 10.6418 11.7657C10.8373 11.6021 10.9629 11.3701 10.993 11.117L11 11V5C11 4.73478 10.8946 4.48043 10.7071 4.29289C10.5196 4.10536 10.2652 4 10 4Z" fill="#FF6270"/>
                            </svg>
                            <div className="flex flex-col">
                                <span>Произошла ошибка</span>
                                <span className="text-[13px] text-white/70 font-light">
                                    {errorMessage}
                                </span>
                            </div>
                        </div>

                    </motion.div>
                    )}
                    </AnimatePresence>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-[#7F91A4] font-semibold text-[13px]">Логин или Email</span>
                        <input onChange={(e) => setLoginValue(e.target.value)} onKeyDown={changeLoginValue} disabled={isLoading} {...register("emailOrLogin")} className={`disabled:pointer-events-none disabled:bg-[#768A9E]/20 px-4 py-2 text-md font-semibold bg-transparent border border-[#768A9E]/20 w-full rounded-lg text-white duration-200 ${errors.emailOrLogin ? ('hover:border-[#FF6270] border-[#FF6270] focus:ring-2 focus:ring-[#FF6270]') : ('hover:border-[#7177F8] focus:ring-2 focus:ring-[#7177F8]')} outline-none ring-0`}/>
                        <AnimatePresence>
                        {errors.emailOrLogin && ( 
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        >
                        <span className={`text-sm text-[#FF6270]`}>Введите корректный логин</span>
                        </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-[#7F91A4] font-semibold text-[13px]">Пароль</span>
                        <div className="relative">
                            <input onChange={(e) => setPasswordValue(e.target.value)} onKeyDown={changePasswordValue} disabled={isLoading} {...register("password")} type={showPassword ? 'text' : 'password'} className={`disabled:pointer-events-none disabled:bg-[#768A9E]/20 px-4 pr-12 py-2 text-md font-semibold bg-transparent border border-[#768A9E]/20 w-full rounded-lg text-white duration-200 ${errors.password ? ('hover:border-[#FF6270] border-[#FF6270] focus:ring-2 focus:ring-[#FF6270]') : ('hover:border-[#7177F8] focus:ring-2 focus:ring-[#7177F8]')} outline-none ring-0`}/>
                            {isLoading ? ( 
                                ''
                            ) : ( 
                            <button type="button" onClick={handleShowPassword} className="flex items-center justify-center absolute right-3 top-[50%] -translate-y-[50%] group">
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
                            )}
                        </div>
                        <AnimatePresence>
                        {errors.password && ( 
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        >
                        <span className={`${errors.password ? '' : 'hidden' } text-sm text-[#FF6270]`}>Введите корректный пароль</span>
                        </motion.div>
                    )}
                    </AnimatePresence>
                    </div>
                </div>
                <button disabled={isLoading} type="submit" className="disabled:pointer-events-none disabled:opacity-80 mt-2 px-[20px] py-[10px] text-md font-semibold flex items-center justify-center bg-[#7177F8] hover:bg-[#525AFF] duration-150 rounded-xl text-white text-sm">
                    {isLoading ? ( <Spinner size="sm"/> ) : ( 'Войти в панель управления' ) }
                </button>
            </form>
            )}
            </div>
            </div>
        </>
    );
};

