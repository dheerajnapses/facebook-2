"use client"
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePostStore } from '@/Store/usePostStore'
import StoryCard from './StoryCard'

const StorySection = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const containerRef = useRef(null)
  const { fetchStoryPosts, storyPosts } = usePostStore()

  useEffect(() => {
    fetchStoryPosts()
  }, [fetchStoryPosts])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      // Update max scroll when container size or story posts change
      const updateMaxScroll = () => {
        setMaxScroll(container.scrollWidth - container.offsetWidth)
        setScrollPosition(container.scrollLeft) // Initialize scroll position
      }
      updateMaxScroll()
      window.addEventListener('resize', updateMaxScroll)
      return () => window.removeEventListener('resize', updateMaxScroll)
    }
  }, [storyPosts])

  const scroll = (direction) => {
    const container = containerRef.current
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      // No need to manually set scrollPosition here, it will be updated via the event listener
    }
  }

  const handleScroll = () => {
    const container = containerRef.current
    if (container) {
      setScrollPosition(container.scrollLeft)
    }
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        onScroll={handleScroll}
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
      {/* Left scroll button */}
      {scrollPosition > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {/* Right scroll button */}
      {scrollPosition < maxScroll && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default StorySection
