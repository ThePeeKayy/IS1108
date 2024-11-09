'use client'
import React, { useState } from 'react';
import { IoMdSend } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { RiMentalHealthLine } from "react-icons/ri";
import { GiHealthNormal } from "react-icons/gi";
import Form from './Form';
import Image from 'next/image';

function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'bot', content: "Hi I am CalmConnect! Feel free to ask me anything!"}])
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false)

  const getBotResponse = async () => {
    try {
        const response = await fetch("https://peekay123.pythonanywhere.com/bot2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: inputValue,
            }),
        });
        
        if (!response.ok) {
            console.error("Server error:", response.statusText);
            return;
        }

        const data = await response.json();
        const advice = data.generated_advice
        setMessages([...messages, { role: 'user', content: inputValue }, { role: 'bot', content: advice }]);
        setInputValue('')
        return;
    } catch (error) {
        console.error("Request failed:", error);
    }
};

  
  return (
    <div className="flex flex-col h-screen">
      <Form setOpen={setOpen} open={open}/>
  {/* Header */}
  <div className="flex flex-row justify-between items-center px-4 pt-4 pb-3 bg-teal-800 ring-2 ">
    <div className="flex flex-row items-center">
      <Image width={70} height={70} src="/logoCalm.png" alt="" />
      <p className='pl-5 text-teal-100 font-bold text-[33px]'>CalmConnect</p>
    </div>
    <div className='flex flex-row sm:px-6 px-3 sm:gap-x-10 gap-x-2'>
      <FaUserAlt className='mt-1 hidden sm:block' size={38} color='white' />
      <RiMentalHealthLine onClick={()=>setOpen(true)} size={42} color='white' />
    </div>
  </div>

  {/* Messages Section */}
  <div className="flex-1 p-4 bg-white ring-2 ring-gray-300 overflow-auto">
    <div id="messagesquare" className="space-y-4 w-auto flex flex-col">
      {messages?.length > 0 && messages?.map((message, index) => (
        <div
          key={index}
          className={`${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
            message.content === 'user' && 'hidden'
          } p-2 px-4 rounded-md flex`}
        >
          {message.role !== 'user' && (
            <Image width={50} height={50} className="w-[50px] h-[50px]" src="/bot.png" alt=""/>
          )}
          <span
            className={`${message.role === 'user' ? 'bg-gray-200' : 'bg-gray-300'} rounded-md ml-2 px-4 p-2`}
          >
            {message.content}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Input Section */}
  <div className="flex flex-row items-center relative bg-white ring-2 ring-gray-300 rounded-b-lg">
    <input
      type="text"
      name="text"
      value={inputValue}
      autoComplete="off"
      onChange={(e) => {
        setInputValue(e.target.value)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          inputValue && getBotResponse();
        }
      }}
      id="text"
      className="w-full px-4 py-6 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
      placeholder="Type here..."
    />
    <IoMdSend className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={()=>{inputValue&&getBotResponse()}} size={35} />
  </div>
</div>

  );
}

export default ChatPage;