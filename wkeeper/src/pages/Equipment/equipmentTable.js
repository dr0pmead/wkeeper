import React, { useState, useEffect, useRef } from 'react';
import { fetchEquipment } from '@/utils/api';

export default function EquipmentTable({ activeDivisionId, activeStatus, isActiveGrid }) {

    const [equipmentData, setEquipmentData] = useState([]);
    
    useEffect(() => {
        // Проверяем, что значения определены перед выполнением запроса
        if (activeDivisionId && activeStatus !== undefined) {
            const loadEquipment = async () => {
                try {
                    const division = activeDivisionId; // Используем rusName только когда есть значение
                    const data = await fetchEquipment(division, activeStatus);
                    setEquipmentData(data);
                } catch (error) {
                    console.error('Ошибка при получении оборудования:', error);
                }
            };
    
            loadEquipment();
        }
    }, [activeDivisionId, activeStatus]);

    return (
        <div className={`w-full ${isActiveGrid.grid ? 'grid grid-cols-3' : 'flex flex-col'}`}>
            {equipmentData.map((item) => (
            <a href={`/equipment/${item._id} `} key={item._id} className="bg-[#242F3D] rounded-xl flex flex-col p-6 hover:bg-[#39495E] duration-300 group " >
                <div className="flex justify-between mb-6">
                    <span className="w-12 h-12 flex items-center rounded-full bg-[#7177F8] p-2">
                    {item.type === 'Компьютер' ? ( 
                            <svg viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 1C2.89688 1 2 1.89688 2 3V11H4V3H16V11H18V3C18 1.89688 17.1031 1 16 1H4ZM0.6 12C0.26875 12 0 12.2688 0 12.6C0 13.925 1.075 15 2.4 15H17.6C18.925 15 20 13.925 20 12.6C20 12.2688 19.7312 12 19.4 12H0.6Z" fill="white"/>
                            </svg>
                    ) : ( 
                        <svg viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3V10H2V3H12ZM2 1C0.896875 1 0 1.89688 0 3V10C0 11.1031 0.896875 12 2 12H5.66563L5.33125 13H3C2.44687 13 2 13.4469 2 14C2 14.5531 2.44687 15 3 15H11C11.5531 15 12 14.5531 12 14C12 13.4469 11.5531 13 11 13H8.66562L8.33125 12H12C13.1031 12 14 11.1031 14 10V3C14 1.89688 13.1031 1 12 1H2ZM16.5 1C15.6719 1 15 1.67188 15 2.5V13.5C15 14.3281 15.6719 15 16.5 15H18.5C19.3281 15 20 14.3281 20 13.5V2.5C20 1.67188 19.3281 1 18.5 1H16.5ZM17 3H18C18.275 3 18.5 3.225 18.5 3.5C18.5 3.775 18.275 4 18 4H17C16.725 4 16.5 3.775 16.5 3.5C16.5 3.225 16.725 3 17 3ZM16.5 5.5C16.5 5.225 16.725 5 17 5H18C18.275 5 18.5 5.225 18.5 5.5C18.5 5.775 18.275 6 18 6H17C16.725 6 16.5 5.775 16.5 5.5ZM17.5 10.5C17.7652 10.5 18.0196 10.6054 18.2071 10.7929C18.3946 10.9804 18.5 11.2348 18.5 11.5C18.5 11.7652 18.3946 12.0196 18.2071 12.2071C18.0196 12.3946 17.7652 12.5 17.5 12.5C17.2348 12.5 16.9804 12.3946 16.7929 12.2071C16.6054 12.0196 16.5 11.7652 16.5 11.5C16.5 11.2348 16.6054 10.9804 16.7929 10.7929C16.9804 10.6054 17.2348 10.5 17.5 10.5Z" fill="white"/>
                        </svg>
                    )}

                    </span>
                    <div className="flex gap-3 justify-start items-start">
                    <span className="opacity-0 text-sm text-[#7F91A4] group-hover:opacity-100 duration-300">
                        {item.ipAddress.main}
                    </span>
                    <button className="">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_296_87)">
                        <path d="M19.2 11.4C19.2 10.7635 19.4529 10.153 19.9029 9.70294C20.353 9.25286 20.9635 9 21.6 9C22.2365 9 22.847 9.25286 23.2971 9.70294C23.7471 10.153 24 10.7635 24 11.4C24 12.0365 23.7471 12.647 23.2971 13.0971C22.847 13.5471 22.2365 13.8 21.6 13.8C20.9635 13.8 20.353 13.5471 19.9029 13.0971C19.4529 12.647 19.2 12.0365 19.2 11.4ZM9.6 11.4C9.6 10.7635 9.85286 10.153 10.3029 9.70294C10.753 9.25286 11.3635 9 12 9C12.6365 9 13.247 9.25286 13.6971 9.70294C14.1471 10.153 14.4 10.7635 14.4 11.4C14.4 12.0365 14.1471 12.647 13.6971 13.0971C13.247 13.5471 12.6365 13.8 12 13.8C11.3635 13.8 10.753 13.5471 10.3029 13.0971C9.85286 12.647 9.6 12.0365 9.6 11.4ZM0 11.4C0 10.7635 0.252856 10.153 0.702944 9.70294C1.15303 9.25286 1.76348 9 2.4 9C3.03652 9 3.64697 9.25286 4.09706 9.70294C4.54714 10.153 4.8 10.7635 4.8 11.4C4.8 12.0365 4.54714 12.647 4.09706 13.0971C3.64697 13.5471 3.03652 13.8 2.4 13.8C1.76348 13.8 1.15303 13.5471 0.702944 13.0971C0.252856 12.647 0 12.0365 0 11.4Z" fill="white"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_296_87">
                        <rect width="24" height="24" fill="white"/>
                        </clipPath>
                        </defs>
                        </svg>
                    </button>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                            <span className={`h-[8px] w-[8px] rounded-full ${item.online ? 'bg-[#6DBC06]' : 'bg-[#BC0606]'}`}></span>
                            <span className="font-bold text-white text-sm">{item.name}</span>
                        </div>
                        <div className="flex gap-2 items-center text-sm text-[#7F91A4]">
                            {item.owner}
                        </div>
                    </div>
                   
                </div>
            </a>
            ))}



        </div>
    );
}
