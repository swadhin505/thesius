'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView, useAnimation } from 'framer-motion'
import Image from 'next/image'
import thumbnail from '@/assets/Home/demo/thumbnail.png'
import Link from 'next/link'

export default function ThumbnailCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: false, amount: 0.2 })
  const buttonControls = useAnimation()
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -45])
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-45, 0, 45])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  React.useEffect(() => {
    if (isInView) {
      buttonControls.start({
        scale: [1, 1.1, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        },
      })
    } else {
      buttonControls.stop()
    }
  }, [isInView, buttonControls])

  return (
    <div className="flex items-center justify-center p-4 rounded-lg my-20 md:my-32" ref={cardRef}>
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden md:w-[60%] relative"
        style={{
          rotateX,
          rotateY,
          scale,
          perspective: 1000
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
          <Link href={"https://youtu.be/QMNjI8mBBXI?feature=shared"} target='blank' className=''>
            <motion.button
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full text-md shadow-xl"
              animate={buttonControls}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch demo
            </motion.button>
          </Link>
        </div>
        <Image
          src={thumbnail}
          alt="demo video"
          className="w-full object-cover brightness-90 border-2 border-green-500"
        />
      </motion.div>
    </div>
  )
}

