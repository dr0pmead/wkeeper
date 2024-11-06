import { useEffect, useState } from 'react';
import { fetchSingleEqipment } from '@/utils/api';
import LoadingComponent from '@/components/Loading';
import Head from 'next/head';
import { FaInfoCircle } from "react-icons/fa";
import { MdStorage } from "react-icons/md";
import { GrConnect } from "react-icons/gr";
import { CgComponents } from "react-icons/cg";
import { IoIosBuild } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import Image from 'next/image';

export default function EquipmentView({ equipmentId, onClose, activeDivisionId }) {
    const [isLoading, setIsLoading] = useState(null);
    const [equipment, setEquipment] = useState(equipmentId || null); // используем equipmentId, если он передан
    const [equipmentData, setEquipmentData] = useState(null);
    const [animate, setAnimate] = useState(false);

    // Проверяем URL при загрузке компонента и устанавливаем equipment ID, если он есть
    useEffect(() => {
        if (!equipment) { // Если equipmentId не установлен, проверяем URL
            const path = window.location.pathname;
            const match = path.match(/\/equipment\/([^/]+)\/view/);
            if (match && match[1]) {
                setEquipment(match[1]); // Устанавливаем equipment ID из URL
            }
        }
    }, []);

    const tabs = [
        { id: 'summary', name: 'Краткая информация', icon: <FaInfoCircle /> },
        { id: 'storage', name: 'Хранилище', icon: <MdStorage /> },
        { id: 'connection', name: 'Подключение', icon: <GrConnect /> },
        { id: 'components', name: 'Комплектующие', icon: <CgComponents /> },
        { id: 'buildData', name: 'Данные сборки', icon: <IoIosBuild /> },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0]);

    const handleTabChange = (tab) => {
        setAnimate(true);
        setTimeout(() => {
            setActiveTab(tab);
            setAnimate(false);
        }, 300);
    };

    useEffect(() => {
        setIsLoading(true)
        if (equipment) { // Только если equipment установлен
            const loadData = async () => {
                try {
                    const data = await fetchSingleEqipment(equipment); // Загружаем данные по ID
                    setEquipmentData(data);
                    
                    setIsLoading(false);
                } catch (error) {
                    console.error('Ошибка при загрузке данных оборудования:', error);
                }
            };

            loadData();
        }
    }, [equipment]);

    if (!equipmentData) return <LoadingComponent width="100%" height="20vh" />;
    if (isLoading) return <LoadingComponent width="100%" height="20vh" />;

    return (
        <>
        <Head>
            <title>{equipmentData.equipment.name} | WebConnect</title>
        </Head>
            <div className="w-full flex justify-start max-w-[1216px] mx-auto py-8 px-6 gap-12">
            <div className="w-[30%] ">
                <div className="bg-[#242F3D] rounded-xl p-4 flex flex-col gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab)}
                        className={`flex items-center gap-2 font-semibold text-[#7F91A4] relative w-full py-2 text-left group  duration-300 hover:text-white ${
                            activeTab?.id === tab.id ? 'text-white' : ''
                        }`}
                    >
                        <span className="text-lg">{tab.icon}</span>
                        <span
                            className={`h-[40px] w-[5px] bg-[#525AFF] absolute top-0 -right-4 rounded-l-lg group-hover:opacity-100 opacity-0 duration-300 ${
                                activeTab?.id === tab.id ? 'opacity-100' : 'opacity-0'
                            }`}
                        ></span>
                        <span className="duration-150 group-hover:pl-3">{tab.name}</span>


                    </button>
                ))}
            </div>
            </div>
            <div className="w-full flex flex-col gap-6">
                <div className="pb-4 justify-between flex items-start border-b border-b-white/10 flex-col gap-6">
                    <div className="w-full justify-between flex">
                        <a href="/equipment" className="flex items-center gap-3 text-[#7F91A4] hover:text-white duration-300"><FaArrowLeft /> Назад</a>
                        <div className="flex gap-3 items-center ">
                        <span className={`h-[8px] w-[8px] rounded-full ${equipmentData.equipment.online ? 'bg-[#6DBC06]' : 'bg-[#BC0606]'}`}></span>
                        <span className="text-[#7F91A4] ">{equipmentData.equipment.name}</span>   
                        </div>
                    </div>
                    <span
                    className={`transition-opacity duration-300 transform ${
                            animate ? 'opacity-0' : 'opacity-100'
                    }`}
                    >
                        <span className="text-xl text-white font-bold">{activeTab?.name} </span>
                    </span>
                </div>
                
                <div className="grid grid-cols-3 bg-[#242F3D] rounded-xl p-4 gap-3">
                
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-md text-white pb-2 border-b border-b-white/10"> О Компьютере</span>
                        <div className="flex flex-col gap-1">
                            <span className="text-white text-sm">Имя компьютера: <span className="text-sm text-[#7F91A4]">{equipmentData.equipment.name}</span></span>
                            <span className="text-white text-sm">Операционная система: <span className="text-sm text-[#7F91A4]">{equipmentData.equipment.osVersion}</span></span>
                            <span className="text-white text-sm">Подразделение: <span className="text-sm text-[#7F91A4]">{equipmentData.division.rusName}</span></span>
                            <span className="text-white text-sm">Отдел: <span className="text-sm text-[#7F91A4]">{equipmentData.equipment.department}</span></span>
                            <span className="text-white text-sm">Принтер: <span className="text-sm text-[#7F91A4]">{equipmentData.equipment.printer.Name}</span></span>
                            <span className="text-white text-sm">Оценка проивзодительности: <span className="text-sm text-[#7F91A4]">{equipmentData.equipment.estimation}</span></span>
                            <span className="text-white text-sm flex flex-col gap-2 mt-2">Владелец:
                            <input className="disabled:pointer-events-none disabled:bg-[#768A9E]/20 hover:border-[#7177F8] focus:ring-2 focus:ring-[#7177F8] text-sm px-2 py-2 text-md bg-transparent border border-[#768A9E]/20 w-full rounded-lg text-[#7F91A4] duration-200 outline-none ring-0" value={equipmentData.equipment.owner}/></span>
                            <span className="text-white text-sm flex flex-col gap-2">Инвентарный номер: 
                            <input className="disabled:pointer-events-none disabled:bg-[#768A9E]/20 hover:border-[#7177F8] focus:ring-2 focus:ring-[#7177F8] text-sm px-2 py-2 text-md bg-transparent border border-[#768A9E]/20 w-full rounded-lg text-[#7F91A4] duration-200 outline-none ring-0" value={equipmentData.equipment.inventoryNumber ? equipmentData.equipment.inventoryNumber : 'Неизвестен'}/></span>
                        </div>
                    
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-md text-white pb-2 border-b border-b-white/10"> IP Адреса</span>
                        
                        <div className="flex flex-col gap-1">
                            <span className="text-white text-sm">Основной: <span className="text-sm text-[#7F91A4]">{equipmentData.equipment.ipAddress.main}</span></span>
                                
                            {equipmentData.equipment.ipAddress.secondary.length > 0 && (
                                <>
                                    {equipmentData.equipment.ipAddress.secondary.map((ip, index) => (
                                        <span key={index} className="text-white text-sm pb-2">Доп. адрес: <span className="text-sm text-[#7F91A4]">{ip}</span></span>
                                    ))}
                                </>
                            )}
                                
                        </div>
                    
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-md text-white pb-2 border-b border-b-white/10"> QR код</span>
                        <div className="flex items-center rounded-xl overflow-hidden w-full">
                            <Image src={equipmentData.equipment.qrcode} width={200} height={200} alt={equipmentData.equipment.name} className="w-full pointer-events-none"/>
                        </div>
                        <button className="text-sm font-bold text-white rounded-xl px-4 py-2 bg-[#7177F8] hover:bg-[#525AFF] duration-300 ">Скачать</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
