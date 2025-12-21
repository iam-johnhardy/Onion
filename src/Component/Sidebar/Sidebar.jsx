import React, { useEffect, useState } from 'react';
import { BsPlusLg } from "react-icons/bs";
import { FaRegMessage } from "react-icons/fa6";
import { LuHistory } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import { LuBadgeHelp } from "react-icons/lu";
import { GiAtomicSlashes } from "react-icons/gi";

const Sidebar = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [extended, setExtended] = useState(window.innerWidth >= 768);
    const [history, setHistory] = useState([]);

    function toggleSidebar(){
        setExtended(!extended);
    }

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setExtended(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('onions_prompt_history');
            if (raw) setHistory(JSON.parse(raw));
        } catch (e) {
            setHistory([]);
        }
    }, []);

    // keep history in sync if other code updates localStorage
    useEffect(() => {
        function onStorage() {
            try {
                const raw = localStorage.getItem('onions_prompt_history');
                setHistory(raw ? JSON.parse(raw) : []);
            } catch (e) {
                setHistory([]);
            }
        }
        window.addEventListener('storage', onStorage);
        // also listen for custom in-window updates
        function onHistoryUpdated(e) {
            try {
                const data = e.detail;
                setHistory(Array.isArray(data) ? data : []);
            } catch (err) {
                
            }
        }
        window.addEventListener('onions:historyUpdated', onHistoryUpdated);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('onions:historyUpdated', onHistoryUpdated);
        };
    }, []);

    const handleSelect = (item) => {
        // notify the main view that a history item was selected
        window.dispatchEvent(new CustomEvent('onions:selectHistory', { detail: item }));
    };

    return (
        <>
        {!isMobile && (
        <div className="min-h-screen max-w-[200px] inline-flex flex-col justify-between bg-[#f0f4f9] p-4  text-gray-800">
            <div className="">
                <GiAtomicSlashes onClick={toggleSidebar} className='cursor-pointer w-5 md:w-7 h-5 md:h-7'/>
                <div className="text-gray-400 flex items-center mt-6 p-2 bg-[#e6eaf1] rounded-2xl gap-2">
                    <BsPlusLg  className='cursor-pointer w-3 h-3 '/>
                    {extended ? <p className='text-[7px] md:text-[12px]'>New Chat</p> : null}
                </div>
                {extended ?
                <div className=" flex flex-col mt-6 gap-4">
                    <p className="mt-4">Recent</p>
                    {history.length === 0 ? (
                        <div className="text-sm text-gray-400">No history yet</div>
                    ) : (
                        history.map((item) => (
                            <div key={item.id} className=" flex items-center gap-2 cursor-pointer text-[#282828] rounded-md hover:bg-gray-200 p-2" onClick={() => handleSelect(item)}>
                                <FaRegMessage className='cursor-pointer'/>
                                <p className="text-[7px] md:text-[13px] truncate">{item.prompt}</p>
                            </div>
                        ))
                    )}
                </div>
                : null}
            </div>

            <div className=" mt-4">
                <div className="cursor-pointer flex items-center mb-4 p-2 hover:bg-[#e6eaf1] hover:text-gray-900 rounded-2xl gap-2 text-gray-400">
                    <LuBadgeHelp className='cursor-pointer'/>
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="cursor-pointer flex items-center mb-4 p-2 hover:bg-[#e6eaf1] hover:text-gray-900 rounded-2xl gap-2 text-gray-400">
                    <LuHistory className='cursor-pointer'/>
                    {extended ? <p>Activity</p>: null}
                </div>
                <div className="cursor-pointer flex items-center p-2 hover:bg-[#e6eaf1] hover:text-gray-900 rounded-2xl gap-2 text-gray-400">
                    <MdOutlineSettings className='cursor-pointer'/>
                    {extended ?<p>Settings</p>: null}
                </div>

            </div>

        </div>
        )}
        </>
    )
}

export default Sidebar