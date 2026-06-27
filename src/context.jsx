import { createContext, useContext } from 'react'

export const ThemeContext = createContext({ isDark: true, toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)
