import { useEffect, useState } from 'react';
import { fetchSingleEqipment } from '@/utils/api';
import LoadingComponent from '@/components/Loading';
import Head from 'next/head';
import { FaInfoCircle } from "react-icons/fa";
import { MdStorage } from "react-icons/md";
import { GrConnect } from "react-icons/gr";
import { CgComponents } from "react-icons/cg";
import { IoIosBuild } from "react-icons/io";
import EquipmentSummary from './EquipmentSummary';
import EquipmentStorage from './EquipmentStorage';
import EquipmentConnection from './EquipmentConnection';
import { FaArrowLeft } from "react-icons/fa6";


export default function EquipmentView({ onClose, activeDivisionId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [owner, setOwner] = useState('');
    const [inventoryNumber, setInventoryNumber] = useState('');
    const [equipment, setEquipment] = useState(null);
    const [equipmentData, setEquipmentData] = useState(null);
    const [animate, setAnimate] = useState(false);


    const tabs = [
        { id: 'summary', name: 'Краткая информация', icon: <FaInfoCircle /> },
        { id: 'storage', name: 'Хранилище', icon: <MdStorage /> },
        { id: 'connection', name: 'Подключение', icon: <GrConnect /> },
        { id: 'components', name: 'Комплектующие', icon: <CgComponents /> },
        { id: 'buildData', name: 'Данные сборки', icon: <IoIosBuild /> },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0]);

    useEffect(() => {
        // Получаем ID оборудования из URL при первой загрузке
        const path = window.location.pathname;
        const match = path.match(/\/equipment\/([^/]+)\/view/);
        if (match && match[1]) {
            setEquipment(match[1]);
        }
    }, []);

    useEffect(() => {
        if (equipment) {
            setIsLoading(true);

            loadData();
        }
    }, [equipment]);

    const loadData = async () => {
        try {
            const data = await fetchSingleEqipment(equipment);
            if (data) {
                setEquipmentData(data);
                setOwner(data.equipment?.owner || 'Неизвестно');
                setInventoryNumber(data.equipment?.inventoryNumber || 'Неизвестен');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке данных оборудования:', error);
            setIsLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setAnimate(true);
        setTimeout(() => {
            setActiveTab(tab);
            setAnimate(false);
        }, 300);
    };

    if (isLoading || !equipmentData) return <LoadingComponent width="100%" height="20vh" />;



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

                {tabs.map((tab) => (
                    activeTab?.id === tab.id && (
                        <div
                            key={tab.id}
                            className={`transition-opacity duration-300 transform ${
                                animate ? 'opacity-0' : 'opacity-100'
                            }`}
                        >
                            {tab.id === 'summary' && (
                                <EquipmentSummary
                                    equipmentData={equipmentData}
                                    owner={owner}
                                    inventoryNumber={inventoryNumber}
                                    setInventoryNumber={setInventoryNumber}
                                    setOwner={setOwner}
                                    loadData={loadData}
                                />
                            )}
                            {tab.id === 'storage' && (
                                <EquipmentStorage
                                    equipmentData={equipmentData}
                                    // дополнительные пропсы, если нужно
                                />
                            )}
                            {tab.id === 'connection' && (
                                <EquipmentConnection
                                    equipmentData={equipmentData}
                                    // дополнительные пропсы, если нужно
                                />
                            )}
                            {/* {tab.id === 'components' && (
                                <EquipmentComponents
                                    equipmentData={equipmentData}
                                    // дополнительные пропсы, если нужно
                                />
                            )}
                            {tab.id === 'buildData' && (
                                <EquipmentBuildData
                                    equipmentData={equipmentData}
                                    // дополнительные пропсы, если нужно
                                />
                            )} */}
                        </div>
                    )
                ))}

            </div>



        </div>
        </>
    );
}
