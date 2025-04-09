import { motion } from "framer-motion"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { AppContext } from "@/contexts/app-context"
import selectSound from "/sounds/select.ogg" // Certifique-se de que o caminho está correto

const jogos = [
  { nome: "Qual é a Música", emoji: "🎵", path: "/jogos/musica" },
  { nome: "Jogo das 3 Pistas", emoji: "3️⃣", path: "/jogos/pistas" },
  { nome: "Roda a Roda", emoji: "🎡", path: "/jogos/roda" },
]

export default function MenuJogos() {
  const { revelados, setRevelados } = useContext(AppContext)

  const playSound = () => {
    const audio = new Audio(selectSound)
    audio.play()
  }

  const handleRevelar = (index: number) => {
    const novos = [...revelados]
    novos[index] = true
    setRevelados(novos)
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-10">
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center"
      >
        Escolha um jogo
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 w-full max-w-xl">
        {jogos.map((jogo, index) => {
          const isRevelado = revelados[index]

          return (
            <motion.div
              key={index}
              whileHover={{ scale: isRevelado ? 1.05 : 1 }}
              whileTap={{ scale: isRevelado ? 0.95 : 1 }}
              onClick={() => handleRevelar(index)}
              data-revealed={isRevelado}
              className="bg-black text-white font-bold py-6 px-4 rounded shadow-xl text-xl flex items-center justify-center gap-4 cursor-pointer transition-colors duration-300 data-[revealed=true]:bg-primary data-[revealed=true]:text-background data-[revealed=true]:hover:bg-primary data-[revealed=false]:bg-gray-800 data-[revealed=false]:text-gray-400 data-[revealed=false]:hover:bg-gray-700 data-[revealed=false]:hover:text-white"
            >
              {isRevelado ? (
                <Link
                  to={jogo.path}
                  onClick={playSound} // Adicionado evento para tocar o som
                  className="flex gap-4 items-center w-full h-full justify-center"
                >
                  <span className="text-3xl">{jogo.emoji}</span>
                  {jogo.nome}
                </Link>
              ) : (
                <span className="text-3xl">???</span>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
