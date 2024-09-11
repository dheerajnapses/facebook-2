"use client"
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { usePostStore } from '@/Store/usePostStore'
import StoryCard from './StoryCard'




const StorySection = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef(null)
   const {fetchStoryPosts,storyPosts}= usePostStore()

   useEffect(() =>{
       fetchStoryPosts()
   },[fetchStoryPosts])

  const scroll = (direction) => {
    const container = containerRef.current
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      setScrollPosition(container.scrollLeft + scrollAmount)
    }
  }



  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="flex space-x-2 overflow-x-hidden py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <motion.div
          className="flex space-x-2"
          drag="x"
          dragConstraints={{ right: 0, left: -((storyPosts.length + 1) * 116) + containerRef.current?.offsetWidth }}
        >
          <StoryCard isAddStory={true} />
          {storyPosts?.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </motion.div>
      </div>
      {scrollPosition > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {scrollPosition < (storyPosts.length * 116) - (containerRef.current?.offsetWidth || 0) && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default StorySection