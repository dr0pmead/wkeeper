import React, { useState, useEffect } from 'react';

export default function Equipment() {


    return (
        <>
        <div className="w-full flex justify-start max-w-[1216px] mx-auto py-8 px-6 gap-12">
            <div className="w-[30%] bg-[#242F3D] rounded-xl p-4">
                
            </div>
            
            <div className="w-full flex flex-col gap-3">
                <div className="flex justify-between w-full items-center">
                    <span className="text-2xl font-bold text-white">Оборудование</span>
                    <button className="bg-[#7177F8] hover:bg-[#525AFF] duration-300 py-3 px-5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-3">
                        Создать
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.75C8.19891 1.75 8.38968 1.82902 8.53033 1.96967C8.67098 2.11032 8.75 2.30109 8.75 2.5V7.25H13.5C13.6989 7.25 13.8897 7.32902 14.0303 7.46967C14.171 7.61032 14.25 7.80109 14.25 8C14.25 8.19891 14.171 8.38968 14.0303 8.53033C13.8897 8.67098 13.6989 8.75 13.5 8.75H8.75V13.5C8.75 13.6989 8.67098 13.8897 8.53033 14.0303C8.38968 14.171 8.19891 14.25 8 14.25C7.80109 14.25 7.61032 14.171 7.46967 14.0303C7.32902 13.8897 7.25 13.6989 7.25 13.5V8.75H2.5C2.30109 8.75 2.11032 8.67098 1.96967 8.53033C1.82902 8.38968 1.75 8.19891 1.75 8C1.75 7.80109 1.82902 7.61032 1.96967 7.46967C2.11032 7.32902 2.30109 7.25 2.5 7.25H7.25V2.5C7.25 2.30109 7.32902 2.11032 7.46967 1.96967C7.61032 1.82902 7.80109 1.75 8 1.75Z" fill="white"/>
                        </svg>
                    </button>
                </div>
            </div>  
        </div>
        </>
    )
}