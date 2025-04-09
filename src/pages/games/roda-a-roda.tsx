import { useEffect, useState, type JSX, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { RoletaModal } from "@/components/roleta"
import { useAppContext } from "@/contexts/app-context" // Atualizado para usar AppContext

interface Rodada {
  id: number
  palavra: string | string[]
  dica: string
  pontos?: number
}

export default function RodaARoda() {
  const [rodadas, setRodadas] = useState<Rodada[]>([])
  const [indice, setIndice] = useState(0)
  const [revelar, setRevelar] = useState(false)
  const [letrasVisiveis, setLetrasVisiveis] = useState<number[]>([])
  const [letra, setLetra] = useState("")
  const [erradas, setErradas] = useState<string[]>([])
  const [confeteAtivado, setConfeteAtivado] = useState(false)
  const [mostrarRoleta, setMostrarRoleta] = useState(false)
  const { setRodadaAtual, rodadaAtual, equipeAtual, alternarEquipe } = useAppContext() // Usando AppContext
  const navigate = useNavigate()

  // Sons
  const audioAcerto = useRef<HTMLAudioElement | null>(null)
  const audioErro = useRef<HTMLAudioElement | null>(null)
  const audioVitoria = useRef<HTMLAudioElement | null>(null)
  const audioNext = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch("/data/roda-a-roda.json")
      .then((res) => res.json())
      .then((data) => setRodadas(data))
  }, [])

  const rodada = rodadas[indice]
  const palavras = Array.isArray(rodada?.palavra)
    ? rodada.palavra
    : rodada?.palavra
    ? [rodada.palavra]
    : []
  const palavraCompleta = palavras.join(" ")

  useEffect(() => {
    setRodadaAtual(0)
  }, [setRodadaAtual])

  useEffect(() => {
    if (!palavraCompleta) return
    const letrasDescobertas = new Set(
      letrasVisiveis.map((i) => palavraCompleta[i]?.toUpperCase())
    )

    const letrasNecessarias = new Set(
      palavraCompleta
        .toUpperCase()
        .split("")
        .filter((char) => char !== " ")
    )

    const acertouTudo = [...letrasNecessarias].every((letra) =>
      letrasDescobertas.has(letra)
    )

    if (acertouTudo && !revelar) {
      setTimeout(() => setRevelar(true), 300)
      if (!confeteAtivado) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
        })
        setConfeteAtivado(true)
        audioVitoria.current?.play()
      }
    }
  }, [letrasVisiveis, palavraCompleta, revelar, confeteAtivado])

  const tentarLetra = () => {
    if (!rodada || letra.trim() === "") return
    const upper = letra.toUpperCase()
    if (
      letrasVisiveis.some((i) => palavraCompleta[i]?.toUpperCase() === upper) ||
      erradas.includes(upper)
    )
      return

    const indices = palavraCompleta
      .toUpperCase()
      .split("")
      .map((l, i) => (l === upper ? i : -1))
      .filter((i) => i !== -1)

    if (indices.length > 0) {
      setLetrasVisiveis((prev) => Array.from(new Set([...prev, ...indices])))
      audioAcerto.current?.play()
    } else {
      setErradas((prev) => [...prev, upper])
      audioErro.current?.play()
    }

    setLetra("")
    alternarEquipe() // Alterna a vez da equipe após a tentativa
  }

  const proximaRodada = () => {
    if (indice + 1 >= rodadas.length) {
      navigate("/ranking")
      return
    }
    setRevelar(false)
    setLetrasVisiveis([])
    setErradas([])
    setConfeteAtivado(false)
    setLetra("")
    setRodadaAtual(0)
    setIndice((prev) => prev + 1)
    audioNext.current?.play()
  }

  const handleRevelar = () => {
    setRevelar(true)
    if (!confeteAtivado) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      })
      setConfeteAtivado(true)
      audioVitoria.current?.play()
    }
  }

  if (!rodada) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 text-center">
      {/* Áudios */}
      <audio ref={audioAcerto} src="/sounds/correct.ogg" preload="auto" />
      <audio ref={audioErro} src="/sounds/wrong.ogg" preload="auto" />
      <audio ref={audioVitoria} src="/sounds/win.ogg" preload="auto" />
      <audio ref={audioNext} src="/sounds/next.ogg" preload="auto" />

      <h2 className="text-4xl font-bold uppercase text-primary">
        {rodada.dica}
      </h2>

      <div className="flex flex-col gap-4 text-4xl font-bold">
        {palavras
          .reduce<{ acc: JSX.Element[][]; index: number }>(
            (acc, palavra, palavraIdx) => {
              const row: JSX.Element[] = []
              for (let i = 0; i < palavra.length; i++) {
                const idx = acc.index
                const mostrar = revelar || letrasVisiveis.includes(idx)
                const conteudo = mostrar ? (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    data-invisible={palavra[i] === " "}
                  >
                    {palavra[i]}
                  </motion.span>
                ) : (
                  "_"
                )

                row.push(
                  <div
                    key={`char-${palavraIdx}-${i}`}
                    className="w-10 h-14 border-2 border-primary rounded flex items-center justify-center uppercase data-[invisible=true]:opacity-0"
                    data-invisible={palavra[i] === " "}
                  >
                    {conteudo}
                  </div>
                )
                acc.index++
              }
              acc.acc.push(row)
              acc.index++
              return acc
            },
            { acc: [], index: 0 }
          )
          .acc.map((row, i) => (
            <div key={`linha-${i}`} className="flex gap-2 flex-wrap">
              {row}
            </div>
          ))}
      </div>

      <div className="text-lg font-semibold text-yellow-400">
        Atual: {rodadaAtual} pontos
      </div>

      <div className="text-lg font-semibold text-blue-500">
        Vez da equipe: {equipeAtual}
      </div>

      <div className="flex gap-4 items-center">
        <Button
          onClick={() => {
            if (!mostrarRoleta) setMostrarRoleta(true) // Abre o modal apenas se não estiver aberto
          }}
        >
          Girar Roleta
        </Button>
        <Input
          autoFocus
          placeholder="Digite uma letra"
          maxLength={1}
          className="w-24 text-center text-lg uppercase"
          value={letra}
          onChange={(e) => setLetra(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              tentarLetra()
            }
          }}
        />
        <Button onClick={tentarLetra}>Tentar Letra</Button>
      </div>

      {erradas.length > 0 && (
        <div className="text-lg">Letras erradas: {erradas.join(", ")}</div>
      )}

      <div className="mt-4">
        {!revelar ? (
          <Button onClick={handleRevelar}>Revelar palavra</Button>
        ) : (
          <Button variant="default" onClick={proximaRodada}>
            Próxima rodada
          </Button>
        )}
      </div>

      {mostrarRoleta && (
        <RoletaModal
          onClose={() => setMostrarRoleta(false)} // Fecha o modal
          onResultado={(valor: number | string) => {
            if (typeof valor === "number") {
              setRodadaAtual(valor) // Define o valor da roleta
            } else {
              setRodadaAtual(0) // Se não for número, define como 0
            }
          }}
        />
      )}
    </div>
  )
}
