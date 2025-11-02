'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SmilePlus } from 'lucide-react';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉'];

interface MessageReactionsProps {
  reactions?: Record<string, number>;
  onReact?: (emoji: string) => void;
}

export function MessageReactions({
  reactions = {},
  onReact,
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<
    Array<{ id: string; emoji: string }>
  >([]);

  const handleReaction = (emoji: string) => {
    onReact?.(emoji);
    setShowPicker(false);

    // Add floating emoji animation
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingEmojis((prev) => [...prev, { id, emoji }]);

    // Remove floating emoji after animation
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 1000);
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <AnimatePresence>
        {Object.entries(reactions).map(([emoji, count]) => (
          <motion.button
            key={emoji}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleReaction(emoji)}
            className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
          >
            <span>{emoji}</span>
            {count > 1 && <span className="ml-1 text-xs">{count}</span>}
          </motion.button>
        ))}
      </AnimatePresence>

      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full"
          >
            <SmilePlus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="grid grid-cols-4 gap-2">
            {EMOJI_REACTIONS.map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReaction(emoji)}
                className="text-2xl p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Floating emoji animations */}
      <div className="fixed pointer-events-none">
        <AnimatePresence>
          {floatingEmojis.map(({ id, emoji }) => (
            <motion.div
              key={id}
              initial={{ y: 0, opacity: 1, scale: 1 }}
              animate={{ y: -50, opacity: 0, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-2xl"
            >
              {emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
