import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react" // Adicionado useRef
import confetti from "canvas-confetti" // Importação do confetti

const valores = ["Passa a vez", 2, 2, 2, 3, 3, 4, 4, 5, 10]
const anguloPorSetor = 360 / valores.length

interface RoletaModalProps {
  onClose: () => void
  onResultado: (valor: number | string) => void
}

export function RoletaModal({ onClose, onResultado }: RoletaModalProps) {
  const [angulo, setAngulo] = useState(0)
  const [resultado, setResultado] = useState<number | string | null>(null)
  const [somTocado, setSomTocado] = useState(false) // Estado para controlar o som
  const [roletaGirou, setRoletaGirou] = useState(false) // Estado para controlar se a roleta já girou
  const audioRoleta = useRef<HTMLAudioElement | null>(null) // Referência para o áudio
  const audioVitoria = useRef<HTMLAudioElement | null>(null) // Referência para o áudio de vitória
  const audioErro = useRef<HTMLAudioElement | null>(null) // Referência para o áudio de erro

  useEffect(() => {
    audioRoleta.current = new Audio("/sounds/roleta.ogg") // Inicializa o áudio da roleta
    audioRoleta.current.loop = true // Configura o áudio para tocar em loop
    audioVitoria.current = new Audio("/sounds/win.ogg") // Inicializa o áudio de vitória
    audioErro.current = new Audio("/sounds/wrong.ogg") // Inicializa o áudio de erro
  }, [])

  useEffect(() => {
    if (roletaGirou || resultado !== null) return // Impede que a roleta gire novamente

    const indiceSorteado = Math.floor(Math.random() * valores.length)
    const valor = valores[indiceSorteado]
    const giros = 5
    const deslocamento = anguloPorSetor / 2 // Deslocamento para centralizar o ponteiro
    const anguloFinal =
      giros * 360 + indiceSorteado * anguloPorSetor + deslocamento

    if (!somTocado) {
      // Verifica se o som já foi tocado
      audioRoleta.current?.play() // Toca o som da roleta em loop
      setSomTocado(true) // Marca o som como tocado
    }

    setAngulo(anguloFinal)
    setRoletaGirou(true) // Marca que a roleta já girou

    const timeout = setTimeout(() => {
      audioRoleta.current?.pause() // Para o som da roleta
      audioRoleta.current!.currentTime = 0 // Reseta o áudio da roleta
      setResultado(valor) // O valor sorteado já corresponde ao índice correto
      onResultado(valor)
      if (valor === 100) {
        // Verifica se o resultado é 100
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }) // Dispara confetti
        audioVitoria.current?.play() // Toca o som de vitória
      } else if (valor === "Passa a vez") {
        // Verifica se o resultado é "Passa a vez"
        audioErro.current?.play() // Toca o som de erro
      }
    }, 4000) // após giro

    return () => {
      clearTimeout(timeout) // Limpa o timeout ao desmontar ou reiniciar
      audioRoleta.current?.pause() // Garante que o som da roleta pare
      audioRoleta.current!.currentTime = 0 // Reseta o áudio da roleta
    }
  }, [onResultado, somTocado, roletaGirou, resultado])

  useEffect(() => {
    if (resultado !== null) {
      setRoletaGirou(true) // Garante que a roleta não gire novamente após parar
    } else {
      setRoletaGirou(false) // Reseta o estado quando o modal é reaberto
      setSomTocado(false) // Reseta o som para permitir tocar novamente
    }
  }, [resultado])

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={() => resultado !== null && onClose()}
    >
      <div className="relative w-[500px] h-[500px]">
        {/* Ponteiro */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 text-6xl">
          🔻
        </div>

        {/* Roleta girando */}
        <motion.div
          className="rounded-full border-4 border-white w-full h-full bg-white shadow-xl overflow-hidden"
          animate={{ rotate: angulo }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 rotate-[-90deg]">
            <svg width="100%" height="100%" viewBox="0 0 200 200">
              {valores.map((_, i) => {
                const start = i * anguloPorSetor
                const end = start + anguloPorSetor
                const x1 = 100 + 100 * Math.cos((Math.PI * start) / 180)
                const y1 = 100 + 100 * Math.sin((Math.PI * start) / 180)
                const x2 = 100 + 100 * Math.cos((Math.PI * end) / 180)
                const y2 = 100 + 100 * Math.sin((Math.PI * end) / 180)
                const largeArc = anguloPorSetor > 180 ? 1 : 0

                return (
                  <g key={i}>
                    <path
                      d={`M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`}
                      fill={i % 2 === 0 ? "#1f56d7" : "#8f0cf5"}
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </motion.div>

        {/* Resultado final no centro */}
        {resultado !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center text-8xl font-extrabold text-white z-20 data-[string=true]:text-7xl"
            data-string={typeof resultado === "string" ? true : false} // Adiciona o atributo data-string se for string
          >
            {resultado}
          </motion.div>
        )}
      </div>
    </div>
  )
}
