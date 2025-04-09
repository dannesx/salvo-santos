import { createContext, useContext, useState, ReactNode } from "react"

type Equipe = {
  nome: string
  pontuacao: number
}

type AppContextType = {
  revelados: boolean[]
  setRevelados: (value: boolean[]) => void
  equipeAtual: string
  alternarEquipe: () => void
  equipes: Equipe[]
  setEquipes: (value: Equipe[]) => void
  rodadaAtual: number
  setRodadaAtual: (valor: number) => void
  pontuar: (nome: string) => void
  atualizarPontuacao: (nome: string, novaPontuacao: number) => void
  resetar: () => void
}

export const AppContext = createContext<AppContextType>({
  revelados: [],
  setRevelados: () => {},
  equipeAtual: "",
  alternarEquipe: () => {},
  equipes: [],
  setEquipes: () => {},
  rodadaAtual: 0,
  setRodadaAtual: () => {},
  pontuar: () => {},
  atualizarPontuacao: () => {},
  resetar: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [revelados, setRevelados] = useState<boolean[]>(Array(4).fill(false)) // 4 jogos
  const [equipes, setEquipes] = useState<Equipe[]>([
    { nome: "Equipe 1", pontuacao: 0 },
    { nome: "Equipe 2", pontuacao: 0 },
  ]) // Nomes e pontuações padrão
  const [equipeAtual, setEquipeAtual] = useState<string>(equipes[0].nome) // Começa com a primeira equipe
  const [rodadaAtual, setRodadaAtual] = useState<number>(100)

  const alternarEquipe = () => {
    setEquipeAtual((prev) =>
      prev === equipes[0].nome ? equipes[1].nome : equipes[0].nome
    ) // Alterna entre as equipes
  }

  const atualizarPontuacao = (nome: string, novaPontuacao: number) => {
    setEquipes((prev) =>
      prev.map((e) =>
        e.nome === nome ? { ...e, pontuacao: novaPontuacao } : e
      )
    )
  }

  const pontuar = (nome: string) => {
    setEquipes((prev) =>
      prev.map((e) =>
        e.nome === nome ? { ...e, pontuacao: e.pontuacao + rodadaAtual } : e
      )
    )
  }

  const resetar = () => {
    setEquipes((prev) => prev.map((e) => ({ ...e, pontuacao: 0 })))
  }

  return (
    <AppContext.Provider
      value={{
        revelados,
        setRevelados,
        equipeAtual,
        alternarEquipe,
        equipes,
        setEquipes,
        rodadaAtual,
        setRodadaAtual,
        pontuar,
        atualizarPontuacao,
        resetar,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
