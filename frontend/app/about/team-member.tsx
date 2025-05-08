'use client'

import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { Motion } from '@/components/ui/motion'
import { Twitter, Linkedin, Github } from 'lucide-react'

interface TeamMemberProps {
  name: string
  role: string
  imageUrl: StaticImageData
  socialLinks: {
    twitter?: string
    linkedin?: string
    github?: string
  }
  isReversed: boolean
}

export function TeamMember({ name, role, imageUrl, socialLinks, isReversed }: TeamMemberProps) {
  const contentClass = isReversed ? 'md:text-left' : 'md:text-right'
  const flexDirection = isReversed ? 'md:flex-row-reverse' : 'md:flex-row'

  return (
    <Motion
      initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`flex flex-col ${flexDirection} items-center justify-between space-y-6 md:space-y-0 md:space-x-8`}
    >
      <div className={`md:w-2/3 ${contentClass}`}>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-lg text-gray-600 mb-4">{role}</p>
        <div className={`flex space-x-4 ${isReversed ? "justify-start": "justify-end"}`}>
          {socialLinks.linkedin && (
            <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
              <Linkedin size={24} />
            </Link>
          )}
          {socialLinks.github && (
            <Link href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
              <Github size={24} />
            </Link>
          )}
          {socialLinks.twitter && (
            <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
              <Twitter size={24} />
            </Link>
          )}
        </div>
      </div>
      <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
        <Image
          src={imageUrl}
          alt={name}
          width={192}
          height={192}
          className="object-cover"
        />
      </div>
    </Motion>
  )
}

