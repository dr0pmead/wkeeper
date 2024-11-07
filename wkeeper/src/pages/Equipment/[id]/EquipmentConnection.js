import { useEffect, useState } from 'react';
import { saveEditedEquipment } from '@/utils/api';
import { toast } from 'react-toastify';
import Image from 'next/image';
import LoadingComponent from '@/components/Loading';

export default function EquipmentConnection({ equipmentData, owner, inventoryNumber, setInventoryNumber, setOwner, loadData }) {


    return (
        <>
        <div className="gap-3 grid grid-cols-2">
            <div  className="bg-[#242F3D] p-4 rounded-xl flex gap-2">
                <div className="w-[20%]">
                <svg className="w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_298_4)">
                    <path d="M22.597 24H1.406C1.03343 23.9989 0.412974 23.587 0.412974 23.587C0.412974 23.587 0.00105544 22.9666 0 22.594L0 1.406C0.00105544 1.03343 0.412974 0.412974 0.412974 0.412974C0.412974 0.412974 1.03343 0.00105544 1.406 0L22.597 0C22.9696 0.00105544 23.3266 0.149526 23.59 0.412974C23.8535 0.676421 24.0019 1.03343 24.003 1.406V22.594C24.0019 22.9666 23.8535 23.3236 23.59 23.587C23.3266 23.8505 22.9696 23.9989 22.597 24ZM11.911 2.109C6.506 2.156 2.148 6.591 2.109 11.999C2.069 17.506 6.49 21.884 11.999 21.889C17.414 21.892 21.795 17.389 21.889 11.999C21.986 6.427 17.483 2.06 11.911 2.109ZM9.65 8.633L8.761 10.792H15.3L14.411 8.633L21.053 11.998L14.411 15.363L15.3 13.204H8.761L9.643 15.363L2.984 11.998L9.65 8.633Z" fill="#39495E"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_298_4">
                    <rect width="24" height="24" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>

                </div>
                <div className="w-full flex flex-col justify-center">
                    <span className="text-sm text-[#7F91A4]">AnyDesk</span>
                    <span className="text-2xl text-white font-bold">{equipmentData.equipment.anyDesk}</span>
                </div>
            </div>

            <div  className="bg-[#242F3D] p-4 rounded-xl flex gap-2">
            <div className="w-[20%]">
            <svg className="w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.322 3.677L0 12L8.322 20.323L16.645 12L8.322 3.677ZM15.693 3.687L13.844 5.537L20.334 11.993L13.844 18.483L15.694 20.3L24 11.993L15.693 3.687Z" fill="#39495E"/>
</svg>

                </div>
                <div className="w-full flex flex-col justify-center">
                    <span className="text-sm text-[#7F91A4]">AnyDesk</span>
                    <span className="text-2xl text-white font-bold">{equipmentData.equipment.anyDesk}</span>
                </div>
            </div>
        </div>
        </>
    )
}