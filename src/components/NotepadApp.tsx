'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ChevronRight, ChevronDown, Folder, File, Search, Menu, User, X, Grid, List } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type FileSystemItem = {
  name: string
  type: 'file' | 'folder'
  children?: FileSystemItem[]
}

const fileSystem: FileSystemItem[] = [
  {
    name: 'project',
    type: 'folder',
    children: [
      { name: 'src', type: 'folder', children: [
        { name: 'components', type: 'folder', children: [
          { name: 'Button.tsx', type: 'file' },
          { name: 'Card.tsx', type: 'file' },
        ]},
        { name: 'pages', type: 'folder', children: [
          { name: 'index.tsx', type: 'file' },
          { name: 'about.tsx', type: 'file' },
        ]},
        { name: 'styles', type: 'folder', children: [
          { name: 'globals.css', type: 'file' },
        ]},
      ]},
      { name: 'public', type: 'folder', children: [
        { name: 'favicon.ico', type: 'file' },
      ]},
      { name: 'package.json', type: 'file' },
      { name: 'tsconfig.json', type: 'file' },
    ],
  },
]

const FileSystemItem = ({ item, depth = 0 }: { item: FileSystemItem; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    if (item.type === 'folder') {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={toggleOpen}
      >
        {item.type === 'folder' && (
          isOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />
        )}
        {item.type === 'folder' ? (
          <Folder className="h-4 w-4 mr-2 text-blue-400" />
        ) : (
          <File className="h-4 w-4 mr-2 text-gray-400" />
        )}
        <span className="text-sm">{item.name}</span>
      </div>
      {item.type === 'folder' && isOpen && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileSystemItem key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

type CardItem = {
  id: number
  name: string
  postedTime: string
  text: string
  image: string
  date: Date
}

const ProductCard = ({ card, onClick }: { card: CardItem; onClick: () => void }) => {
  return (
    <Card className="bg-gray-800 text-white cursor-pointer" onClick={onClick}>
      <CardContent className="p-0 overflow-hidden">
        <img src={card.image} alt={card.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="font-bold mb-2">{card.name}</h3>
          <p className="text-sm text-gray-400">{card.postedTime}</p>
          <p className="text-sm mt-2">{card.text.substring(0, 100)}...</p>
        </div>
      </CardContent>
    </Card>
  )
}

const ExpandedCard = ({ card, onClose }: { card: CardItem; onClose: () => void }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80%] sm:h-[80%] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>{card.name}</DialogTitle>
          <DialogDescription>{card.postedTime}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 h-full">
          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
          <div className="overflow-y-auto">
            <p>{card.text}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onClose} className="absolute top-2 right-2">
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  )
}

const Timeline = ({ cards, onCardClick }: { cards: CardItem[]; onCardClick: (card: CardItem) => void }) => {
  const sortedCards = [...cards].sort((a, b) => b.date.getTime() - a.date.getTime())
  const groupedCards = sortedCards.reduce((acc, card) => {
    const month = card.date.toLocaleString('default', { month: 'long', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(card)
    return acc
  }, {} as Record<string, CardItem[]>)

  return (
    <div className="p-4">
      <div className="relative border-l-2 border-gray-600 ml-4">
        {Object.entries(groupedCards).map(([month, monthCards]) => (
          <div key={month} className="mb-8">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px]"></div>
            <h2 className="text-xl font-bold mb-4 ml-6">{month}</h2>
            {monthCards.map(card => (
              <div key={card.id} className="mb-4 ml-6 relative">
                <div className="absolute w-3 h-3 bg-gray-600 rounded-full -left-[25px] top-1"></div>
                <p className="text-sm text-gray-400 mb-1">{card.date.toLocaleDateString()}</p>
                <Card className="bg-gray-800 text-white cursor-pointer" onClick={() => onCardClick(card)}>
                  <CardContent className="p-4">
                    <h3 className="font-bold">{card.name}</h3>
                    <p className="text-sm text-gray-400">{card.postedTime}</p>
                    <p className="text-sm mt-2">{card.text.substring(0, 100)}...</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const GridView = ({ cards, onCardClick }: { cards: CardItem[]; onCardClick: (card: CardItem) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {cards.map((card) => (
        <ProductCard key={card.id} card={card} onClick={() => onCardClick(card)} />
      ))}
    </div>
  )
}

const Heatmap = ({ cards }: { cards: CardItem[] }) => {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)

  const contributionMap = cards.reduce((acc, card) => {
    const dateString = card.date.toISOString().split('T')[0]
    acc[dateString] = (acc[dateString] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-700'
    if (count < 3) return 'bg-green-900'
    if (count < 5) return 'bg-green-700'
    return 'bg-green-500'
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return (
    <div className="p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-x-auto">
      <div className="flex flex-col min-w-max">
        <div className="flex mb-1">
          {months.map((month, index) => (
            <div key={index} className="flex-1 text-center text-xs text-gray-400">
              {month}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {months.map((_, monthIndex) => {
            const date = new Date(today.getFullYear(), monthIndex, 1)
            const daysInMonth = new Date(today.getFullYear(), monthIndex + 1, 0).getDate()
            return (
              <div key={monthIndex} className="flex-1">
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const currentDate = new Date(date.getFullYear(), date.getMonth(), i + 1)
                    if (currentDate > today || currentDate < startOfYear) return null
                    const dateString = currentDate.toISOString().split('T')[0]
                    const count = contributionMap[dateString] || 0
                    return (
                      <div
                        key={i}
                        className={`w-3 h-3 ${getColor(count)} rounded-sm`}
                        title={`${currentDate.toDateString()}: ${count} contributions`}
                      ></div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedCard, setExpandedCard] = useState<CardItem | null>(null)
  const [isGridView, setIsGridView] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseEnter = () => setSidebarOpen(true)
    const handleMouseLeave = () => setSidebarOpen(false)

    const sidebar = sidebarRef.current
    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleMouseEnter)
      sidebar.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleMouseEnter)
        sidebar.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  const cards: CardItem[] = [
    { id: 1, name: "Card 1", postedTime: "2h ago", text: "This is the content of card 1. It provides more details about the item. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", image: "/placeholder.svg?height=300&width=300", date: new Date(2024, 9, 15) },
    { id: 2, name: "Card 2", postedTime: "3h ago", text: "This is the content of card 2. It describes the features of the product. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", image: "/placeholder.svg?height=300&width=300", date: new Date(2024, 9, 10) },
    { id: 3, name: "Card 3", postedTime: "4h ago", text: "This is the content of card 3. It highlights the benefits of the service. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", image: "/placeholder.svg?height=300&width=300", date: new Date(2024, 8, 25) },
    { id: 4, name: "Card 4", postedTime: "5h ago", text: "This is the content of card 4. It explains the usage of the item. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", image: "/placeholder.svg?height=300&width=300", date: new Date(2024, 8, 20) },
    { id: 5, name: "Card 5", postedTime: "6h ago", text: "This is the content of card 5. It showcases the unique aspects of the product. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", image: "/placeholder.svg?height=300&width=300", date: new Date(2024, 7, 5) },
    { id: 6, name: "Card 6", postedTime: "7h ago", text: "This is the content of card 6. It provides additional information about the service. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", image: "/placeholder.svg?height=300&width=300", date: new Date(2024, 6, 30) },
  ]

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold  mb-4">Explorer</h2>
          
          <div className="overflow-y-auto h-full">
            {fileSystem.map((item, index) => (
              <FileSystemItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-gray-800 shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4 text-white">
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative max-w-xl">
              <Input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-800 text-white border-gray-700">
              <DropdownMenuItem className="focus:bg-gray-700 focus:text-white">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-700 focus:text-white">
                About
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-700 focus:text-white">
                Login
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          {/* Heatmap */}
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <Heatmap cards={cards} />
          </div>

          <div className="bg-gray-800 p-2 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsGridView(!isGridView)}
              className="text-white"
            >
              {isGridView ? <List className="h-5 w-5 mr-2" /> : <Grid className="h-5 w-5 mr-2" />}
              {isGridView ? 'Timeline View' : 'Grid View'}
            </Button>
          </div>

          {/* Content */}
          {isGridView ? (
            <GridView cards={cards} onCardClick={setExpandedCard} />
          ) : (
            <Timeline cards={cards} onCardClick={setExpandedCard} />
          )}
        </div>
      </div>

      {expandedCard && <ExpandedCard card={expandedCard} onClose={() => setExpandedCard(null)} />}
    </div>
  )
}