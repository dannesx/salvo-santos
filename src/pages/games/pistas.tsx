import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { usePlacar } from "@/contexts/placar-context"
import { useNavigate } from "react-router-dom" // Importação do hook useNavigate
import confetti from "canvas-confetti" // Importação do confetti

interface Rodada {
  id: number
  resposta: string
  pistas: string[]
}

export default function JogoDas3Pistas() {
  const [rodadas, setRodadas] = useState<Rodada[]>([])
  const [indice, setIndice] = useState(0)
  const [pistaAtual, setPistaAtual] = useState(0)
  const [revelar, setRevelar] = useState(false)
  const { setRodadaAtual } = usePlacar()
  const navigate = useNavigate() // Inicialização do hook useNavigate

  // Referências para os áudios
  const audioSelect = useRef<HTMLAudioElement | null>(null)
  const audioWin = useRef<HTMLAudioElement | null>(null)
  const audioNext = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch("/data/pistas.json")
      .then((res) => res.json())
      .then((data) => setRodadas(data))
  }, [])

  useEffect(() => {
    const pontos = [10, 9, 8]
    setRodadaAtual(pontos[pistaAtual] || 0)
  }, [pistaAtual, setRodadaAtual])

  const rodada = rodadas[indice]

  const proximaRodada = () => {
    audioNext.current?.play() // Toca o som de próxima rodada
    setRevelar(false)
    setPistaAtual(0)

    if (indice + 1 < rodadas.length) {
      setIndice((prev) => prev + 1)
    } else {
      navigate("/ranking") // Redireciona para /ranking ao final das rodadas
    }
  }

  const mostrarProximaPista = () => {
    if (pistaAtual < 2) {
      audioSelect.current?.play() // Toca o som de seleção
      setPistaAtual((prev) => prev + 1)
    }
  }

  const revelarResposta = () => {
    audioWin.current?.play() // Toca o som de vitória
    setRevelar(true)
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } }) // Efeito de confetti
  }

  const handleBotaoPrincipal = () => {
    if (revelar) {
      proximaRodada()
    } else {
      revelarResposta()
    }
  }

  if (!rodada) return <p className="text-center mt-10">Carregando...</p>

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10 text-center">
      {/* Áudios */}
      <audio ref={audioSelect} src="/sounds/select.ogg" preload="auto" />
      <audio ref={audioWin} src="/sounds/win.ogg" preload="auto" />
      <audio ref={audioNext} src="/sounds/next.ogg" preload="auto" />

      <h2 className="text-2xl font-bold text-muted-foreground">
        Pista {pistaAtual + 1} de 3
      </h2>

      <div className="flex flex-col gap-4 max-w-2xl">
        {rodada.pistas.slice(0, pistaAtual + 1).map((pista, i) => (
          <p key={i} className="text-4xl font-medium">
            {pista}
          </p>
        ))}
      </div>

      {revelar && (
        <p className="text-green-400 text-4xl font-semibold">
          {rodada.resposta}
        </p>
      )}

      <div className="flex gap-4">
        {pistaAtual < 2 && !revelar && (
          <Button variant="secondary" onClick={mostrarProximaPista}>
            Mostrar próxima pista
          </Button>
        )}
        <Button onClick={handleBotaoPrincipal}>
          {revelar ? "Próxima rodada" : "Revelar resposta"}
        </Button>
      </div>
    </div>
  )
}
