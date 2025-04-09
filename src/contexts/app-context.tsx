import { createContext, useContext, useState, ReactNode } from "react"

type AppContextType = {
  revelados: boolean[]
  setRevelados: (value: boolean[]) => void
}

export const AppContext = createContext<AppContextType>({
  revelados: [],
  setRevelados: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [revelados, setRevelados] = useState<boolean[]>(
    Array(4).fill(false) // 4 jogos
  )

  return (
    <AppContext.Provider value={{ revelados, setRevelados }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
