import { createContext, useContext } from 'react'

export const ThemeContext = createContext({ isDark: true, toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

export const NavContext = createContext({ navigate: () => {} })
export const useNav = () => useContext(NavContext)
