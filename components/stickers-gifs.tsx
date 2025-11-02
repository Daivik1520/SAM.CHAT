'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Search } from 'lucide-react';

// Sample sticker packs
const STICKER_PACKS = {
  happy: ['😊', '😄', '😆', '😁', '🤣', '😃', '😀', '😉'],
  love: ['❤️', '💕', '💖', '💗', '💝', '💞', '💘', '💟'],
  cool: ['😎', '🤓', '😏', '🤨', '😌', '😒', '🙃', '😐'],
  party: ['🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🍾', '🥳'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌼', '🌴'],
};

// Sample GIFs (in real app, would fetch from Giphy API)
const SAMPLE_GIFS = [
  { id: '1', url: 'https://media.giphy.com/media/g9GWusSQpDL6qPjTmJ/giphy.gif', title: 'Dancing' },
  { id: '2', url: 'https://media.giphy.com/media/l0HlDtKPoYJhFtgQ4/giphy.gif', title: 'Laughing' },
  { id: '3', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', title: 'Celebration' },
  { id: '4', url: 'https://media.giphy.com/media/l0HlNaQ9FS8bL7lC0/giphy.gif', title: 'Thumbs Up' },
  { id: '5', url: 'https://media.giphy.com/media/l0HlQaQ9FS8bL7lC0/giphy.gif', title: 'Clapping' },
  { id: '6', url: 'https://media.giphy.com/media/l0HlTy9x8FZo0XO1i/giphy.gif', title: 'Heart' },
];

interface StickersGifsProps {
  onSelect?: (content: string, type: 'sticker' | 'gif') => void;
}

export function StickersGifs({ onSelect }: StickersGifsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPack, setSelectedPack] = useState<keyof typeof STICKER_PACKS>('happy');

  const filteredGifs = SAMPLE_GIFS.filter((gif) =>
    gif.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Tabs defaultValue="stickers" className="w-full">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="stickers" className="flex-1">
              Stickers
            </TabsTrigger>
            <TabsTrigger value="gifs" className="flex-1">
              GIFs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stickers" className="p-4 space-y-4">
            <div className="flex gap-2 flex-wrap">
              {Object.keys(STICKER_PACKS).map((pack) => (
                <Button
                  key={pack}
                  variant={selectedPack === pack ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPack(pack as keyof typeof STICKER_PACKS)}
                  className="capitalize"
                >
                  {pack}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              <AnimatePresence>
                {STICKER_PACKS[selectedPack].map((sticker) => (
                  <motion.button
                    key={sticker}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSelect?.(sticker, 'sticker')}
                    className="text-3xl p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {sticker}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="gifs" className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search GIFs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {filteredGifs.map((gif) => (
                  <motion.button
                    key={gif.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect?.(gif.url, 'gif')}
                    className="relative rounded overflow-hidden group"
                  >
                    <img
                      src={gif.url}
                      alt={gif.title}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {gif.title}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            {filteredGifs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No GIFs found for &quot;{searchQuery}&quot;
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
