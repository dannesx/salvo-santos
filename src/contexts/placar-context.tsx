import { createContext, useContext, useState } from "react"

export type Equipe = {
  nome: string
  pontuacao: number
}

type PlacarContextType = {
  equipes: Equipe[]
  rodadaAtual: number
  setRodadaAtual: (valor: number) => void
  pontuar: (nome: string) => void
  atualizarPontuacao: (nome: string, novaPontuacao: number) => void
  resetar: () => void
}

const PlacarContext = createContext<PlacarContextType | undefined>(undefined)

const PlacarProvider = ({ children }: { children: React.ReactNode }) => {
  const [equipes, setEquipes] = useState<Equipe[]>([
    { nome: "Salvo", pontuacao: 0 },
    { nome: "Santos", pontuacao: 0 },
  ])
  const [rodadaAtual, setRodadaAtual] = useState<number>(100)

  const atualizarPontuacao = (nome: string, novaPontuacao: number) => {
    setEquipes((prev) =>
      prev.map((e) => (e.nome === nome ? { ...e, pontuacao: novaPontuacao } : e))
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
    <PlacarContext.Provider
      value={{ equipes, rodadaAtual, setRodadaAtual, pontuar, atualizarPontuacao, resetar }}
    >
      {children}
    </PlacarContext.Provider>
  )
}

const usePlacar = () => {
  const context = useContext(PlacarContext)
  if (!context) throw new Error("usePlacar precisa estar dentro do PlacarProvider")
  return context
}

export { PlacarProvider, usePlacar }