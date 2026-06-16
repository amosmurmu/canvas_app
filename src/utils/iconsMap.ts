import JavaIcon from '@/assets/images/Java.svg?react'
import GoIcon from '@/assets/images/Go.svg?react'
import PythonIcon from '@/assets/images/Python.svg?react'
import RubyIcon from '@/assets/images/Ruby.svg?react'
import TypeScriptIcon from '@/assets/images/TypeScript.svg?react'
import PostgresIcon from '@/assets/images/PostgresSQL.svg?react'
import RedisIcon from '@/assets/images/Redis.svg?react'
import MongoDBIcon from '@/assets/images/MongoDB.svg?react'
import PuzzleIcon from '@/assets/images/puzzle.svg?react'
import SettingsIcon from '@/assets/images/settings.svg?react'

import type React from 'react'

export const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  java: JavaIcon,
  golang: GoIcon,
  python: PythonIcon,
  ruby: RubyIcon,
  typescript: TypeScriptIcon,
  postgresql: PostgresIcon,
  redis: RedisIcon,
  mongodb: MongoDBIcon,
  puzzle: PuzzleIcon,
  settings: SettingsIcon,
}
