import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Props = {
  name: string
  score: number
  side: "left" | "right"
}

const Score = ({ name, score, side }: Props) => {
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    setHighlight(true) // Ativa o efeito
    const timeout = setTimeout(() => setHighlight(false), 1000) // Remove o efeito após 1 segundo
    return () => clearTimeout(timeout)
  }, [score]) // Reexecuta o efeito quando o score muda

  return (
    <motion.div
      className={`absolute bottom-4 p-3 data-[side=left]:left-4 data-[side=right]:right-4 bg-secondary rounded text-white flex flex-col items-center w-28 gap-1 ring-4 ring-primary`}
      data-side={side}
      animate={highlight ? { scale: 1.2 } : { scale: 1 }} // Animação de escala
      transition={{ duration: 0.3 }} // Duração da animação
    >
      <h3 className="leading-none text-lg">{name}</h3>
      <p className="leading-none text-2xl">{score}</p>
    </motion.div>
  )
}

export default Score
