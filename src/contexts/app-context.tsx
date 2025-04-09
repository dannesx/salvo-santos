import { createContext, useContext, useState, ReactNode } from "react"

type AppContextType = {
  revelados: boolean[]
  setRevelados: (value: boolean[]) => void
  equipeAtual: string
  alternarEquipe: () => void
  equipes: string[]
  setEquipes: (value: string[]) => void
}

export const AppContext = createContext<AppContextType>({
  revelados: [],
  setRevelados: () => {},
  equipeAtual: "",
  alternarEquipe: () => {},
  equipes: [],
  setEquipes: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [revelados, setRevelados] = useState<boolean[]>(Array(4).fill(false)) // 4 jogos
  const [equipes, setEquipes] = useState<string[]>(["Equipe 1", "Equipe 2"]) // Nomes padrão
  const [equipeAtual, setEquipeAtual] = useState<string>(equipes[0]) // Começa com a primeira equipe

  const alternarEquipe = () => {
    setEquipeAtual((prev) =>
      prev === equipes[0] ? equipes[1] : equipes[0]
    ) // Alterna entre as equipes
  }

  return (
    <AppContext.Provider
      value={{ revelados, setRevelados, equipeAtual, alternarEquipe, equipes, setEquipes }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
