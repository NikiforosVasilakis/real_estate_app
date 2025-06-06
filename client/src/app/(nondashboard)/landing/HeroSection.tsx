"use client"

import Image from 'next/image'
import React from 'react'
import {motion} from "framer-motion"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const HeroSection = () => {
  return (
    <div className='relative h-screen'>
        <Image src="/landing-splash.jpg" alt='rentiful rental platform' fill className='object-cover object-center' priority />
        <div className='absolute inset-0 bg-black bg-opacity-60'>
            <motion.div className='absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 w-full text-center' initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration:0.8}}>
                <div className='max-w-4xl mx-auto px-16 sm:px-12'>
                    <h1 className='text-5xl font-bold text-white mb-4'>
                        Start your journey to finding your perfect place to call home
                    </h1>
                    <p className='text-xl text-white mb-8'>
                        This is a dummy text that has no reason to exist pls i need phycological help this is no joke
                    </p>
                    <div className='flex justify-center'>
                        <Input className='w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12' type="text" value="search query" onChange={()=>{}} placeholder='Search by city, place, idk js search' />
                        <Button className="bg-secondary-500 text-white rounded-none rounded-r-xl border-none hover:bg-secondary-600 h-12 " onClick={() => {}}>
                            Search
                        </Button>
                    </div>
                </div>
           </motion.div>
        </div>
    </div>
  )
}

export default HeroSection
