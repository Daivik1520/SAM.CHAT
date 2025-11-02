'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Palette } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  gradient?: string;
}

const CONVERSATION_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    bgColor: 'bg-white dark:bg-gray-950',
    textColor: 'text-gray-900 dark:text-white',
    accentColor: 'bg-blue-500',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bgColor: 'bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950 dark:to-pink-950',
    textColor: 'text-gray-900 dark:text-white',
    accentColor: 'bg-orange-500',
    gradient: 'from-orange-400 to-pink-400',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950',
    textColor: 'text-gray-900 dark:text-white',
    accentColor: 'bg-cyan-500',
    gradient: 'from-blue-400 to-cyan-400',
  },
  {
    id: 'forest',
    name: 'Forest',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
    textColor: 'text-gray-900 dark:text-white',
    accentColor: 'bg-green-500',
    gradient: 'from-green-400 to-emerald-400',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950',
    textColor: 'text-gray-900 dark:text-white',
    accentColor: 'bg-purple-500',
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    bgColor: 'bg-gradient-to-br from-slate-900 to-slate-800',
    textColor: 'text-white',
    accentColor: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-blue-400',
  },
];

interface ConversationThemesProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
}

export function ConversationThemes({
  currentTheme = 'default',
  onThemeChange,
}: ConversationThemesProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeChange?.(themeId);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Conversation Themes</h3>
          <div className="grid grid-cols-2 gap-3">
            {CONVERSATION_THEMES.map((theme) => (
              <motion.button
                key={theme.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThemeChange(theme.id)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  selectedTheme === theme.id
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div
                  className={`h-16 rounded-md mb-2 ${theme.bgColor} ${
                    theme.gradient ? `bg-gradient-to-br ${theme.gradient}` : ''
                  }`}
                />
                <p className="text-xs font-medium text-center">{theme.name}</p>
              </motion.button>
            ))}
          </div>

          {/* Theme Preview */}
          <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold mb-3">Preview</p>
            <div
              className={`p-4 rounded-lg space-y-2 ${
                CONVERSATION_THEMES.find((t) => t.id === selectedTheme)?.bgColor
              }`}
            >
              <div className="flex justify-end">
                <div
                  className={`px-4 py-2 rounded-lg text-white text-sm ${
                    CONVERSATION_THEMES.find((t) => t.id === selectedTheme)
                      ?.accentColor
                  }`}
                >
                  Your message
                </div>
              </div>
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white text-sm">
                  Other&apos;s message
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Hook to apply theme to conversation
export function useConversationTheme(themeId: string) {
  const theme = CONVERSATION_THEMES.find((t) => t.id === themeId);
  return theme || CONVERSATION_THEMES[0];
}
