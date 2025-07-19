import React, { useState } from 'react'
import { Icon } from "@iconify/react";

function Header() {

  const [dropdown,Setdropdown] = useState(false);

  const ToggleDropDown = ()=>{
    if(dropdown){
      Setdropdown(false)
    }else{
      Setdropdown(true);
    }
  }


  return (
    <div className='w-100% h-auto text-white bg-black flex flex-col'>
      <div className='flex justify-between px-24 max-[768px]:px-20 max-[426px]:px-10 py-3 items-center'>
        <div className='lg:pr-3'>
            <h1 className='text-6xl mr-5 max-[768px]:text-5xl'>Bhavya</h1>
        </div>
        <div className='bg-white flex text-black px-3 max-[1024px]:hidden  py-2 items-center rounded-lg'>
          <Icon icon="material-symbols-light:search" className='' width="28" height="28" />
          <input type="text" name='search' placeholder='search here' className='text-lg ml-3 focus:outline-none' />
          <button className='bg-black rounded-lg text-white   px-4 py-2'>search</button>
        </div>
        <div className='h-100% max-[1024px]:hidden  flex ml-5'>
            <div className='flex space-x-9 items-center justify-center'>
                <div><span>Home</span></div>
                <div><span>Products</span></div>
                <div><span>Contact Us</span></div>
                <div><span>Terms and Conditions</span></div>
            </div>
        </div>
        <div className='h-100%  flex ml-5 text-white min-[1025px]:hidden'>
            <div onClick={ToggleDropDown}>
              <Icon icon="octicon:three-bars-16" width="28" height="28" />
            </div>
        </div>
        </div>
        <div className={dropdown ? 'w-full min-[1025px]:hidden' : 'hidden max-[1024px]:hidden'} id='dropdown'>
          <div className='flex flex-col space-y-5 p-5 items-center justify-center'>
              <div className='bg-white flex text-black px-3  py-2 items-center rounded-lg'>
                <Icon icon="material-symbols-light:search" className='' width="28" height="28" />
                <input type="text" name='search' placeholder='search here' className='text-lg max-[425px]:text-sm ml-3x focus:outline-none' />
                <button className='bg-black rounded-lg text-white max-[425px]:ml-5 max-[425px]:text-sm ml-10 px-4 py-2'>search</button>
              </div>
              <div className='border-b-2  border-white w-11/12'><span>Home</span></div>
              <div className='border-b-2  border-white w-11/12'><span>Products</span></div>
              <div className='border-b-2  border-white w-11/12'><span>Contact Us</span></div>
              <div className='border-b-2  border-white w-11/12'><span>Terms and Conditions</span></div>
          </div>
        </div>
    </div>
  )
}

export default Header