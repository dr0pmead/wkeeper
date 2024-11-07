import { useEffect, useState } from 'react';
import { saveEditedEquipment } from '@/utils/api';
import { toast } from 'react-toastify';
import Image from 'next/image';
import LoadingComponent from '@/components/Loading';

export default function EquipmentStorage({ equipmentData, owner, inventoryNumber, setInventoryNumber, setOwner, loadData }) {


    return (
        <>

        <div className="gap-3 grid grid-cols-2">
        {equipmentData.equipment.disks.map((disk) => {
            const freeSpace = ((disk.FreeSpace) * 10) / 10; // Округляем до десятых
            return (
                <div  className="bg-[#242F3D] p-4 rounded-xl flex flex-col gap-2 justify-between">
                    <span key={disk.id} className="text-white font-bold text-sm">{disk.Name}</span>
                    <div className="w-full flex-col gap-1">
                        <div className="w-full h-[10px] rounded-xl relative overflow-hidden bg-[#7F91A4]/50">
                            {(() => {
                                const usedSpace = disk.Size - disk.FreeSpace;
                                const percentageUsed = (usedSpace / disk.Size) * 100;
                                return (
                                    <span
                                        className="h-[10px] bg-[#525AFF] absolute rounded-xl"
                                        style={{ width: `${percentageUsed.toFixed(1)}%` }}
                                    ></span>
                                );
                            })()}
                        </div>
                        <span className="text-[#7F91A4] text-sm">
                            {disk.FreeSpace.toFixed(1)} ГБ свободно из {disk.Size.toFixed(1)} ГБ
                        </span>
                    </div>
                </div>
            );
        })}

        </div>
        
        </>
    )
}