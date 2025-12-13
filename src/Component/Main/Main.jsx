import React, { useState, useEffect, useRef } from 'react'
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
    // lastPrompt holds the prompt that produced the currently-displayed response.
    // We keep it separate from `prompt` (the input box) so the input can be cleared
    // while the prompt text remains shown above the response.
    const [lastPrompt, setLastPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([])
    const fileInputRef = useRef(null);

    const handleSend = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError('');
        setResponse('');        
        // remember the prompt that is being sent so we can display it above
        // the response even after clearing the input box
        setLastPrompt(prompt);
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
            // clear the input box but keep lastPrompt so it stays visible above response
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
        setLastPrompt(suggestionText);
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
                // when user selects a past entry, we want the input box to show it
                // and also display it above the response
                setPrompt(item.prompt);
                setLastPrompt(item.prompt);
                setResponse(item.response || '');
            }
        }
        window.addEventListener('onions:selectHistory', onSelect);
        return () => window.removeEventListener('onions:selectHistory', onSelect);
    }, []);

    return (
        <div className="lg:w-[1300px] md:w-[700px] w-full mx-auto pl-30 flex flex-col">
            <nav className="flex gap-[10em] md:gap-[25em] lg:gap-[59em] items-center text-[#585858] px-10 py-5">
                <div className="flex items-center gap-1">
                    <p className='text-lg md:text-2xl bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 bg-clip-text text-transparent'>Onion </p>
                <span ><GiAtomicSlashes className='h-2 w-2 '/></span>
                </div>
                <img src="/assets/avater.png" alt="Avater" className='w-6 lg:w-10 h-6 lg:h-10'/>
            </nav>

            {/* Main content area */}
            <div className="flex-1 ">
                    {loading ? (
                        <div className="lg:px-40 py-6">
                            <div className="flex items-center gap-2 rounded-lg p-5 mb-3">
                                <img src="/assets/avater.png" alt="Avater" />
                                <p className="text-gray-800">{lastPrompt || prompt || 'Thinking...'}</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg p-5">
                                <span ><GiAtomicSlashes className='h-5 w-5 '/></span>
                                <div className="loader w-full flex flex-col gap-2">
                                    <div className="h-7 rounded bg-gradient-to-r from-blue-500 via-green-100 to-teal-500 animate-pulse" />
                                    <div className="h-7 rounded bg-gradient-to-r from-blue-500 via-green-100 to-teal-500 animate-pulse" />
                                    <div className="h-7 rounded bg-gradient-to-r from-blue-500 via-green-100 to-teal-500 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ) : response ? (
                        <div className="lg:px-40 py-6 overflow-y-auto">
                            <div className="flex items-center gap-2  rounded-lg p-5 mb-3">
                                <img src="/assets/avater.png" alt="Avater" />
                                <p className="text-gray-800">{lastPrompt || prompt}</p>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg p-5 ">
                                <span ><GiAtomicSlashes className='h-5 w-5 '/></span>
                                <p className="text-gray-700 mt-2 whitespace-pre-wrap ">{response}</p>
                            </div>
                        </div>
                    ) : (
                    <div className="py-20 px-5  lg:px-40">
                        <div className="greet text-gray-300 text-4xl font-bold">
                            <span className='text-[20px] font-extrabold bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 bg-clip-text text-transparent'>Hello, Hardy.</span>
                            <p className='text-[20px] lg:text-2xl'>How can I help you today?</p>
                        </div>
                        <div className="grid grid-cols-4 gap-2 md:gap-5 pt-5">
                            <div
                                onClick={() => handleSuggestion('Suggest beautiful places to see on an upcoming road trip')}
                                className="relative rounded-md h-30 md:h-40 p-2 md:p-5 bg-[#f0f4f9] hover:bg-[#dfe4ed] cursor-pointer transition"
                            >
                                <p className='text-[8px] md:text-[13px] lg:text-lg text-gray-500'>Suggest beautiful places to see on an upcoming road trip</p>
                                <BsCompass className='cursor-pointer absolute bottom-2 right-2' />
                            </div>
                            <div
                                onClick={() => handleSuggestion('Briefly summarize this concept: urban planning')}
                                className="relative rounded-md h-30 md:h-40 p-2 md:p-5 bg-[#f0f4f9] hover:bg-[#dfe4ed] cursor-pointer transition"
                            >
                                <p className='text-[8px] md:text-[13px] lg:text-lg text-gray-500'>Briefly summarize this concept: urban planning</p>
                                <HiOutlineLightBulb className='cursor-pointer absolute bottom-2 right-2' />
                            </div>
                            <div
                                onClick={() => handleSuggestion('Brainstorm team bonding activities for our work retreat')}
                                className="relative rounded-md h-30 md:h-40 p-2 md:p-5 bg-[#f0f4f9] hover:bg-[#dfe4ed] cursor-pointer transition"
                            >
                                <p className='text-[8px] md:text-[13px] lg:text-lg text-gray-500'>Brainstorm team bonding activities for our work retreat</p>
                                <FaRegMessage className='cursor-pointer absolute bottom-2 right-2' />
                            </div>
                            <div
                                onClick={() => handleSuggestion('Improve the readability of the following code')}
                                className="relative rounded-md h-30 md:h-40 p-2 md:p-5 bg-[#f0f4f9] hover:bg-[#dfe4ed] cursor-pointer transition"
                            >
                                <p className='text-[8px] md:text-[13px] lg:text-lg text-gray-500'>Improve the readability of the following code</p>
                                <LuCodeXml className='cursor-pointer absolute bottom-2 right-2' />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input area - fixed at bottom */}
                {/* Input area - stays at bottom of main column */}
                    <div className="fixed bottom-4 right-18 md:right-8 xl:right-40 2xl:left-80 w-[200px] md:w-[600px] mx-auto lg:min-w-[1000px] mt-30 px-0 md:px-10 py-3 bg-white">
                    <div className="w-[250px] md:w-lg lg:w-[850px] mx-auto flex justify-between px-5 rounded-2xl items-center bg-[#f0f4f9] overflow-hidden">
                    <textarea
                        placeholder='Ask me anything...'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className='flex-1 bg-transparent outline-none text-[10px] md:text-[17px] py-2 md:py-4 reize-none h-9 md:h-14 overflow-clip'
                        disabled={loading}
                    />
                    <div className="flex items-center gap-3">
                        {/* hidden file input used when the image icon is clicked */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="*/*"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                                const f = e.target.files && e.target.files[0];
                                if (!f) return;
                                setLoading(true);
                                setError('');
                                setResponse('');
                                // use file name (or prompt provided in input) as lastPrompt
                                const filePrompt = prompt || f.name;
                                setLastPrompt(filePrompt);
                                try {
                                    const result = await callGenAI(f, { prompt: prompt });
                                    setResponse(result);
                                    const entry = { id: Date.now(), prompt: filePrompt, response: result, fileName: f.name };
                                    setPrevPrompts((p) => [entry, ...p]);
                                } catch (err) {
                                    setError(err.message || 'Failed to get response for file');
                                } finally {
                                    setLoading(false);
                                    // clear the file input so same file can be selected again later
                                    e.target.value = null;
                                    setPrompt('');
                                }
                            }}
                        />

                        <IoIosImages
                            onClick={() => {
                                if (loading) return;
                                try { fileInputRef.current && fileInputRef.current.click(); } catch (e) {}
                            }}
                            className={loading ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer w-3 md:w-5 h-3 md:h-5'}
                            title="Upload a file"
                        />
                        <FaMicrophoneAlt className={loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer w-3 md:w-5 h-3 md:h-5'} />
                        <MdOutlineSend
                            onClick={handleSend}
                            className={loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-blue-500 w-3 md:w-5 h-3 md:h-5'}
                        />
                    </div>

                    
                </div>
                 {error && <p className="text-red-500 text-center text-sm mt-2">Error: {error}</p>}
                <p className='text-[7px] lg:text-[12px] my-3 text-center font-bold text-gray-400'>
                    Onions may display inaccurate info, including about people, so double-check its responses.
                </p>
               
            </div>
        </div>
    )
}

export default Main