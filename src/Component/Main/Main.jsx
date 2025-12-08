import React, { useState, useEffect } from 'react'
import { HiOutlineLightBulb } from "react-icons/hi2";
import { FaRegMessage } from "react-icons/fa6";
import { BsCompass } from "react-icons/bs";
import { LuCodeXml } from "react-icons/lu";
import { MdOutlineSend } from "react-icons/md";
import { IoIosImages } from "react-icons/io";
import { GiAtomicSlashes } from "react-icons/gi";
import { FaMicrophoneAlt } from "react-icons/fa";
import { callGenAI } from '../../utils/genai';


const Main = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([])

    const handleSend = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError('');
        setResponse('');        

        try {
            const result = await callGenAI(prompt);
            setResponse(result);
            // save to history (most recent first)
            const entry = { id: Date.now(), prompt: prompt, response: result };
            setPrevPrompts((p) => [entry, ...p]);
            console.log(result)
        } catch (err) {
            setError(err.message || 'Failed to get response');
        } finally {
            setLoading(false);
            setPrompt('')
            
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestion = async (suggestionText) => {
        setPrompt(suggestionText);
        // Trigger the API call with the suggestion
        setLoading(true);
        setError('');
        setResponse('');

        try {
            const result = await callGenAI(suggestionText);
            setResponse(result);
            const entry = { id: Date.now(), prompt: suggestionText, response: result };
            setPrevPrompts((p) => [entry, ...p]);
        } catch (err) {
            setError(err.message || 'Failed to get response');
        } finally {
            setLoading(false);
        }
    };

    // persist history to localStorage so prompts are accessible later
    useEffect(() => {
        try {
            const raw = localStorage.getItem('onions_prompt_history');
            if (raw) setPrevPrompts(JSON.parse(raw));
        } catch (e) {
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('onions_prompt_history', JSON.stringify(prevPrompts));
            // notify other parts of the app (Sidebar) that history changed
            try { window.dispatchEvent(new CustomEvent('onions:historyUpdated', { detail: prevPrompts })); } catch (e) {}
        } catch (e) {
        }
    }, [prevPrompts]);

    // listen for selections from the Sidebar (dispatched via window CustomEvent)
    useEffect(() => {
        function onSelect(e) {
            const item = e.detail;
            if (item && item.prompt) {
                setPrompt(item.prompt);
                setResponse(item.response || '');
            }
        }
        window.addEventListener('onions:selectHistory', onSelect);
        return () => window.removeEventListener('onions:selectHistory', onSelect);
    }, []);

    return (
        <div className="w-full flex flex-col">
            <nav className="flex gap-[70em] items-center text-[#585858] px-10 py-5">
                <div className="flex items-center gap-1">
                    <p className=' text-2xl bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 bg-clip-text text-transparent'>Onion </p>
                <span ><GiAtomicSlashes className='h-2 w-2 '/></span>
                </div>
                <img src="/assets/avater.png" alt="Avater" />
            </nav>

            {/* Main content area */}
            <div className="flex-1 ">
                    {loading ? (
                        <div className="px-60 py-6">
                            <div className="flex items-center gap-2 rounded-lg p-5 mb-3">
                                <img src="/assets/avater.png" alt="Avater" />
                                <p className="text-gray-800">{prompt || 'Thinking...'}</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg p-5">
                                <span ><GiAtomicSlashes className='h-5 w-5 '/></span>
                                <div className="w-full flex flex-col gap-2">
                                    <div className="h-7 rounded bg-gradient-to-r from-blue-500 via-green-100 to-teal-500 animate-pulse" />
                                    <div className="h-7 rounded bg-gradient-to-r from-blue-500 via-green-100 to-teal-500 animate-pulse" />
                                    <div className="h-7 rounded bg-gradient-to-r from-blue-500 via-green-100 to-teal-500 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ) : response ? (
                        <div className="px-60 py-6">
                            <div className="flex items-center gap-2  rounded-lg p-5 mb-3">
                                <img src="/assets/avater.png" alt="Avater" />
                                <p className="text-gray-800">{prompt}</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg p-5 ">
                                <span ><GiAtomicSlashes className='h-5 w-5 '/></span>
                                <p className="text-gray-700 mt-2 whitespace-pre-wrap ">{response}</p>
                            </div>
                        </div>
                    ) : (
                    <div className="py-20 px-60">
                        <div className="greet text-gray-300 text-4xl font-bold">
                            <span className='font-extrabold bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 bg-clip-text text-transparent'>Hello, Hardy.</span>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="grid grid-cols-4 gap-5 pt-5">
                            <div
                                onClick={() => handleSuggestion('Suggest beautiful places to see on an upcoming road trip')}
                                className="relative rounded-md h-40 p-5 bg-[#f0f4f9] hover:bg-[#dfe4ed] cursor-pointer transition"
                            >
                                <p className='text-lg text-gray-500'>Suggest beautiful places to see on an upcoming road trip</p>
                                <BsCompass className='cursor-pointer absolute bottom-2 right-2' />
                            </div>
                            <div
                                onClick={() => handleSuggestion('Briefly summarize this concept: urban planning')}
                                className="relative rounded-md h-40 p-5 bg-[#f0f4f9] hover:bg-[#dfe4ed] cursor-pointer transition"
                            >
                                <p className='text-lg text-gray-500'>Briefly summarize this concept: urban planning</p>
                                <HiOutlineLightBulb className='cursor-pointer absolute bottom-2 right-2' />
                            </div>
                            <div
                                onClick={() => handleSuggestion('Brainstorm team bonding activities for our work retreat')}
                                className="relative rounded-md h-40 p-5 bg-[#f0f4f9] hover:bg-[#dfe4ed] cursor-pointer transition"
                            >
                                <p className='text-lg text-gray-500'>Brainstorm team bonding activities for our work retreat</p>
                                <FaRegMessage className='cursor-pointer absolute bottom-2 right-2' />
                            </div>
                            <div
                                onClick={() => handleSuggestion('Improve the readability of the following code')}
                                className="relative rounded-md h-40 p-5 bg-[#f0f4f9] hover:bg-[#dfe4ed] cursor-pointer transition"
                            >
                                <p className='text-lg text-gray-500'>Improve the readability of the following code</p>
                                <LuCodeXml className='cursor-pointer absolute bottom-2 right-2' />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input area - fixed at bottom */}
                {/* Input area - stays at bottom of main column */}
                <div className="px-10 py-3 ">
                    <div className=" max-w-4xl mx-auto flex justify-between px-5 rounded-2xl items-center bg-[#f0f4f9]">
                    <textarea
                        placeholder='Ask me anything...'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className='flex-1 bg-transparent outline-none text-md py-4 resize-none max-h-14'
                        disabled={loading}
                    />
                    <div className="flex items-center gap-3">
                        <IoIosImages className={loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} />
                        <FaMicrophoneAlt className={loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} />
                        <MdOutlineSend
                            onClick={handleSend}
                            className={loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-blue-500'}
                        />
                    </div>

                    
                </div>
                 {error && <p className="text-red-500 text-center text-sm mt-2">Error: {error}</p>}
                <p className='text-[12px] my-2 text-center font-bold text-gray-400'>
                    Onions may display inaccurate info, including about people, so double-check its responses.
                </p>
               
            </div>
        </div>
    )
}

export default Main