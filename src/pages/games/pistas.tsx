import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom" // Importação do hook useNavigate
import confetti from "canvas-confetti" // Importação do confetti
import { useAppContext } from "@/contexts/app-context" // Importação do contexto da aplicação

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
  // Estado para controlar se a vez foi passada (removido porque não é utilizado)
  const navigate = useNavigate() // Inicialização do hook useNavigate
  const { equipeAtual, alternarEquipe, setRodadaAtual, pontuar } = useAppContext() // Adicionado pontuar do contexto

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
    const pontos = [10, 9, 8, 7]
    setRodadaAtual(pontos[pistaAtual] || 0) // Atualiza rodadaAtual diretamente no contexto
  }, [pistaAtual, setRodadaAtual])

  const rodada = rodadas[indice]

  const proximaRodada = () => {
    audioNext.current?.play() // Toca o som de próxima rodada
    setRevelar(false)
    setPistaAtual(0)
    // Reseta o estado de vez passada (removido porque não é utilizado)

    if (indice + 1 < rodadas.length) {
      setIndice((prev) => prev + 1)
    } else {
      navigate("/ranking") // Redireciona para /ranking ao final das rodadas
    }
    alternarEquipe() // Alterna a vez da equipe
  }

  const mostrarProximaPista = () => {
    if (pistaAtual < 2) {
      audioSelect.current?.play() // Toca o som de seleção
      setPistaAtual((prev) => prev + 1)
      alternarEquipe() // Alterna a vez da equipe
    }
  }

  const passarVez = () => {
    if (pistaAtual < 2) {
      setPistaAtual((prev) => prev + 1) // Avança para a próxima pista
    } else {
      // Marca que a vez foi passada na última pista (removido porque não é utilizado)
      alternarEquipe() // Alterna a vez da equipe
    }
  }

  const revelarResposta = () => {
    audioWin.current?.play() // Toca o som de vitória
    setRevelar(true)
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } }) // Efeito de confetti
    pontuar(equipeAtual, pistaAtual) // Pontua a equipe atual
    // Reseta o estado de vez passada (removido porque não é utilizado)
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
        {!revelar && pistaAtual < 2 && (
          <Button variant="secondary" onClick={mostrarProximaPista}>
            Mostrar próxima pista
          </Button>
        )}
        {!revelar && pistaAtual === 2 && (
          <Button variant="secondary" onClick={passarVez}>
            Passar vez
          </Button>
        )}
        <Button onClick={handleBotaoPrincipal}>
          {revelar ? "Próxima rodada" : "Revelar resposta"}
        </Button>
      </div>
    </div>
  )
}
