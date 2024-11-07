import { useEffect, useState } from 'react';
import { saveEditedEquipment } from '@/utils/api';
import { toast } from 'react-toastify';
import Image from 'next/image';
import LoadingComponent from '@/components/Loading';

export default function EquipmentSummary({ equipmentData, owner, inventoryNumber, setInventoryNumber, setOwner, loadData }) {

    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [isLocalLoading, setIsLocalLoading] = useState(false);

    const loadDisabledButton = (equipmentData) => {
        setIsSaveDisabled(
            (owner === (equipmentData.equipment?.owner || 'Неизвестно')) &&
            (inventoryNumber === (equipmentData.equipment?.inventoryNumber || 'Неизвестен'))
                ? true // Если значения равны, кнопка отключена
                : false // Если значения разные, кнопка активна
        );
    }

    useEffect(() => {
        if (equipmentData) {
            loadDisabledButton(equipmentData)
        }
        
    }, [owner, inventoryNumber, equipmentData]);

    const handleSave = async () => {

        setIsLocalLoading(true)
        // Создаем объект с данными и id
        const data = {
            id: equipmentData.equipment._id,
            owner,
            inventoryNumber,
        };

        console.log('Сохраняем данные', { data });
    
        try {
            // Передаем объект data в функцию сохранения
            const response = await saveEditedEquipment(data);
            toast.success('Данные успешно обновлены.', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            setIsLocalLoading(false)
            loadData();
        } catch (error) {
            toast.error(('Произошла ошибка при обновлении данных.', error), {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsLocalLoading(false)
        }

        setIsLocalLoading(false)
    };


    return ( 
        <>
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
                        <span className="text-[#7F91A4] text-sm flex flex-col gap-2 mt-2">
                            Владелец:
                            <input
                                className="disabled:pointer-events-none disabled:bg-[#768A9E]/20 hover:border-[#7177F8] focus:ring-2 focus:ring-[#7177F8] text-sm px-2 py-2 text-md bg-transparent border border-[#768A9E]/20 w-full rounded-lg text-white duration-200 outline-none ring-0"
                                value={owner}
                                disabled={isLocalLoading}
                                onChange={(e) => setOwner(e.target.value)}
                            />
                        </span>
                
                        <span className="text-[#7F91A4] text-sm flex flex-col gap-2 mt-2">
                            Инвентарный номер:
                            <input
                                className="disabled:pointer-events-none disabled:bg-[#768A9E]/20 hover:border-[#7177F8] focus:ring-2 focus:ring-[#7177F8] text-sm px-2 py-2 text-md bg-transparent border border-[#768A9E]/20 w-full rounded-lg text-white duration-200 outline-none ring-0"
                                value={inventoryNumber}
                                disabled={isLocalLoading}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Проверяем, чтобы были только цифры и длина не превышала 9 символов
                                    if (/^\d{0,9}$/.test(value)) {
                                        setInventoryNumber(value);
                                    }
                                }}
                            />
                        </span>
                        <button
                            className="disabled:pointer-events-none mt-2 flex justify-center items-center text-sm font-bold text-white rounded-xl px-4 py-2 bg-[#7177F8] hover:bg-[#525AFF] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaveDisabled}
                            onClick={handleSave}
                        >
                            {isLocalLoading ? (
                                <LoadingComponent width='20px' height='20px'/>
                             ) : ( 
                                <span> Сохранить </span>
                            )}
                           
                        </button>
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
        </>
    )
}

