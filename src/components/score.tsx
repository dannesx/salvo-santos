import { usePlacar } from "@/contexts/placar-context"
import { useState } from "react"

type Props = {
  name: string
  side: "left" | "right"
}

const Score = ({ name, side }: Props) => {
  const { equipes, pontuar } = usePlacar()
  const equipe = equipes.find((e) => e.nome === name)
  const [animar, setAnimar] = useState(false)

  if (!equipe) return null

  const handleClick = () => {
    pontuar(name)
    setAnimar(true)
    setTimeout(() => setAnimar(false), 300)
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition-transform duration-300 active:scale-95 absolute bottom-4 p-3 data-[side=left]:left-4 data-[side=right]:right-4 bg-secondary rounded text-white flex flex-col items-center w-28 gap-1 ring-4 ring-primary ${
        animar ? "animate-pulse" : ""
      }`}
      data-side={side}
    >
      <h3 className="leading-none text-lg">{equipe.nome}</h3>
      <p className="leading-none text-2xl">{equipe.pontuacao}</p>
    </div>
  )
}

export default Score
