import React from 'react'

function Home() {
  return (
    //main div
    <div className='bg-[#1a1a1a] h-auto w-100% text-white rounded-[40px] m-10'>
    {/* latest products div start here */}
      <div className='flex items-start justify-start flex-col'>
        <p className='self-center text-3xl mt-10 static font-semibold'>Latest Products</p>
      {/* cards upper div */}
       <div className="w-full overflow-x-auto scrollbar-hide mr-10" style={{scrollbarWidth: 'none', /* Firefox */ msOverflowStyle: 'none', /* Internet Explorer 10+ */}}>
          <div className='flex items-center justify-start p-16 pt-10 space-x-10 '>
            {/* cards div */}

            <div className='flex flex-col items-center justify-center bg-[#2a2a2a] hover:bg-[#252736] p-10 rounded-[15px]'>
              <div className='w-60 h-56'>
                <img className='rounded-[12px] w-60 h-56 object-fit' src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSTuSu2tNRI28NFlnaZ587anT2Wb7IXU2KeNueT56xeqWgNymOkzsVzcn6opEXZhuEP97gneuV96f0jSVxBrzot-O3Bke8rJH9Vy9T957UtAqtThP-C3RHgqQ" alt="" />
              </div>
              <p className='text-xl mb-5'>Pigeon Deluxe Pressure Cooker</p>
              <button className='bg-[#3b82f6] py-2 px-4 rounded-[10px]'>
                More Info
              </button>
            </div>
            <div className='flex flex-col items-center justify-center bg-[#2a2a2a] hover:bg-[#252736] p-10 rounded-[15px]'>
              <div className='w-60 h-56'>
                <img className='rounded-[12px] w-60 h-56 object-fit' src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSTuSu2tNRI28NFlnaZ587anT2Wb7IXU2KeNueT56xeqWgNymOkzsVzcn6opEXZhuEP97gneuV96f0jSVxBrzot-O3Bke8rJH9Vy9T957UtAqtThP-C3RHgqQ" alt="" />
              </div>
              <p className='text-xl mb-5'>Pigeon Deluxe Pressure Cooker</p>
              <button className='bg-[#3b82f6] py-2 px-4 rounded-[10px]'>
                More Info
              </button>
            </div>
            <div className='flex flex-col items-center justify-center bg-[#2a2a2a] hover:bg-[#252736] p-10 rounded-[15px]'>
              <div className='w-60 h-56 '>
                <img className='rounded-[12px]  w-60 h-56 object-fit' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY-ZLqU4CWTDg3QJDQYIdF3gYEankmK3UjFQ&s" alt="" />
              </div>
              <p className='text-xl mb-5'>Pigeon Deluxe Pressure Cooker</p>
              <button className='bg-[#3b82f6] py-2 px-4 rounded-[10px]'>
                More Info
              </button>
            </div>
            <div className='flex flex-col items-center justify-center bg-[#2a2a2a] hover:bg-[#252736] p-10 rounded-[15px]'>
              <div className='w-60 h-56'>
                <img className='rounded-[12px]  w-60 h-56 object-fit' src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSTuSu2tNRI28NFlnaZ587anT2Wb7IXU2KeNueT56xeqWgNymOkzsVzcn6opEXZhuEP97gneuV96f0jSVxBrzot-O3Bke8rJH9Vy9T957UtAqtThP-C3RHgqQ" alt="" />
              </div>
              <p className='text-xl mb-5'>Pigeon Deluxe Pressure Cooker</p>
              <button className='bg-[#3b82f6] py-2 px-4 rounded-[10px]'>
                More Info
              </button>
            </div>
            <div className='flex flex-col items-center justify-center bg-[#2a2a2a] hover:bg-[#252736] p-10 rounded-[15px]'>
              <div className='w-60 h-56'>
                <img className='rounded-[12px] w-60 h-56 object-fit' src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSTuSu2tNRI28NFlnaZ587anT2Wb7IXU2KeNueT56xeqWgNymOkzsVzcn6opEXZhuEP97gneuV96f0jSVxBrzot-O3Bke8rJH9Vy9T957UtAqtThP-C3RHgqQ" alt="" />
              </div>
              <p className='text-xl mb-5'>Pigeon Deluxe Pressure Cooker</p>
              <button className='bg-[#3b82f6] py-2 px-4 rounded-[10px]'>
                More Info
              </button>
            </div>
            <div className='flex flex-col items-center justify-center bg-[#2a2a2a] hover:bg-[#252736] p-10 rounded-[15px]'>
              <div className='w-60 h-56'>
                <img className='rounded-[12px] w-60 h-56 object-fit' src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSTuSu2tNRI28NFlnaZ587anT2Wb7IXU2KeNueT56xeqWgNymOkzsVzcn6opEXZhuEP97gneuV96f0jSVxBrzot-O3Bke8rJH9Vy9T957UtAqtThP-C3RHgqQ" alt="" />
              </div>
              <p className='text-xl mb-5'>Pigeon Deluxe Pressure Cooker</p>
              <button className='bg-[#3b82f6] py-2 px-4 rounded-[10px]'>
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    {/* latest products div ends here */}
    {/*  */}
    </div>
  )
}

export default Home