import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/components/UserContext';
import { fetchAllDivisions } from '@/utils/api';
import LoadingComponent from '@/components/Loading';
import EquipmentTable from './Equipment/equipmentTable';

export default function Equipment() {
    const user = useUser();
    const [isLoading, setIsLoading] = useState(null);
    const [divisions, setDivisions] = useState([]);
    const [activeDivisionId, setActiveDivisionId] = useState('');
    const [activeStatus, setActiveStatus] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const [isActiveGrid, setIsActiveGrid] = useState({ grid: true, list: false });
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await fetchAllDivisions();
                setDivisions(data);
                if (data.length > 0) {
                    setActiveDivisionId(data[0]._id); // Устанавливаем первый элемент как активный
                }
                setIsLoading(false);
                console.log(divisions)
            } catch (error) {
                console.error('Ошибка при загрузке данных о подразделениях:', error);
            }
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        // Триггерим анимацию при изменении `activeDivisionId`
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 300); // Убираем анимацию после 300ms

        return () => clearTimeout(timer); // Очищаем таймер при размонтировании
    }, [activeDivisionId]);

    const handleDivisionChange = (divisionId) => {
        setAnimate(true); // запускаем анимацию исчезновения
        setTimeout(() => {
            setActiveDivisionId(divisionId);
            setAnimate(false); // запускаем анимацию появления после обновления
        }, 300); // тайм-аут должен совпадать с длительностью анимации
    };
    
    const handleStatusClick = (status) => {
        setActiveStatus(status);
    };

    const handleDivClick = () => {
        inputRef.current?.focus();
    };

    const handleGridButton = (layout) => {
        setIsActiveGrid({
            grid: layout === 'grid',
            list: layout === 'list',
        });
    };

    const activeDivision = divisions.find((division) => division._id === activeDivisionId);


    return (
        <>
        {isLoading ? ( 
            <LoadingComponent />
        ) : ( 
            <div className="w-full flex justify-start max-w-[1216px] mx-auto py-8 px-6 gap-12">
            <div className="w-[30%] ">
                <div className="bg-[#242F3D] rounded-xl p-4">
                <div className="flex flex-col justify-start items-start gap-3">
                    {divisions.map((division) => (
                    <button
                        key={division._id}
                        onClick={() => handleDivisionChange(division._id)}
                        className={`font-semibold text-[#7F91A4] relative w-full py-2 text-left group hover:pl-3 duration-300 hover:text-white ${
                            activeDivisionId === division._id ? 'text-white' : ''
                        }`}
                    >
                        {division.rusName}
                        <span
                            className={`h-[40px] w-[5px] bg-[#525AFF] absolute top-0 -right-4 rounded-l-lg group-hover:opacity-100 opacity-0 duration-300 ${
                                activeDivisionId === division._id ? 'opacity-100' : 'opacity-0'
                            }`}
                        ></span>
                        <div
                            className="text-white py-0.5 px-3 absolute right-0 top-[50%] max-w-[35px] w-full flex items-center justify-center bg-[#525AFF] text-sm rounded-lg -translate-y-[50%]"
                        >
                            {division.count}
                        </div>
                    </button>
                ))}
                </div>
                </div>
            </div>
            
            <div className="w-full flex flex-col gap-6">
                <div className="flex justify-between w-full items-center mb-4">
                    <span className="text-3xl font-bold text-white">Оборудование</span>
                </div>
                <div className="w-full pb-4 border-b border-b-white/10 ">
                    <button
                        className={`text-[#7F91A4] font-semibold relative hover:text-white mr-6 ${activeStatus === true ? 'text-white' : ''}`}
                        onClick={() => handleStatusClick(true)}
                    >
                        В сети
                        <span className={`w-full h-[1px] flex absolute -bottom-[17px] ${activeStatus === true ? 'bg-white' : 'bg-transparent'}`}></span>
                    </button>

                    <button
                        className={`text-[#7F91A4] font-semibold relative hover:text-white mr-6 ${activeStatus === false ? 'text-white' : ''}`}
                        onClick={() => handleStatusClick(false)}
                    >
                        Не в сети
                        <span className={`w-full h-[1px] flex absolute -bottom-[17px] ${activeStatus === false ? 'bg-white' : 'bg-transparent'}`}></span>
                    </button>
                </div>
                <div className="flex gap-3 w-full">
                    <div 
                        className={`flex items-center p-2 px-4 py-2 bg-[#242F3D] border rounded-lg w-full gap-3 duration-300 cursor-text hover:border-[#7177F8] ${isFocused ? 'border-[#7177F8] ring-2 ring-[#7177F8]' : 'border-[#242F3D]'}`} 
                        onClick={handleDivClick} // Устанавливаем фокус на input при клике на div
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm7.5 1.5-3-3" stroke="#7F91A4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input 
                            ref={inputRef} // Привязываем input к ref
                            className="bg-transparent text-sm w-full outline-none text-white" 
                            placeholder="Поиск"
                            onFocus={() => setIsFocused(true)} 
                            onBlur={() => setIsFocused(false)}
                        />
                    </div>
                    <div className="bg-[#242F3D] rounded-xl py-2 px-3 flex items-center gap-3 cursor-pointer hover:bg-[#39495E] duration-300">
                        <button 
                            onClick={() => handleGridButton('grid')}
                            className={`${isActiveGrid.grid ? '*:fill-white duration-300' : '*:fill-[#7F91A4]/50 *:duration-300'}`}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 13H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1Zm-1 5H6v-3h3v3ZM19 4h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Zm-1 5h-3V6h3v3Zm1 4h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1Zm-1 5h-3v-3h3v3ZM10 4H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1ZM9 9H6V6h3v3Z"></path>
                            </svg>
                        </button>
                        <button 
                            onClick={() => handleGridButton('list')}
                            className={`${isActiveGrid.list ? '*:fill-white duration-300' : '*:fill-[#7F91A4]/50 *:duration-300'}`}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 8h14a1 1 0 1 0 0-2H5a1 1 0 0 0 0 2Zm14 8H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Zm0-5H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z"></path>
                            </svg>
                        </button>
                    </div>

                </div>
                <div className="w-full py-4 border-b border-b-white/10 font-bold text-white text-xl flex items-center gap-1">
                {activeDivision && (
                    <>
                        <span
                            className={`transition-opacity duration-300 transform ${
                                animate ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            Оборудование {activeDivision.rusName}
                        </span>
                        <span
                            className={`text-[#7F91A4] transition-opacity duration-300 transform ${
                                animate ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            {activeDivision.count}
                        </span>
                        </>
                )}
                </div>

                <div>
                <EquipmentTable
                    activeDivisionId={activeDivisionId}
                    activeStatus={activeStatus}
                    isActiveGrid={isActiveGrid}
                />
                </div>
            </div>  
        </div>
        )}
        </>
    )
}


