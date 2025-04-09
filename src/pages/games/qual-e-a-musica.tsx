import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom" // Importação do hook useNavigate
import confetti from "canvas-confetti" // Importação do confetti
import winSound from "/sounds/win.ogg" // Certifique-se de que o caminho está correto
import { useAppContext } from "@/contexts/app-context" // Importação do contexto do aplicativo

interface Rodada {
  id: number
  trecho: string
  resposta: string
  pontos?: number
  audio: string // Caminho para o arquivo de áudio
}

export default function QualEMusica() {
  const [rodadas, setRodadas] = useState<Rodada[]>([])
  const [indice, setIndice] = useState(0)
  const [revelar, setRevelar] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [tocando, setTocando] = useState(false)
  const navigate = useNavigate() // Inicialização do hook useNavigate
  const { setRodadaAtual, equipes, pontuar } = useAppContext() // Adicionado equipes e pontuar do contexto

  useEffect(() => {
    fetch("/data/qual-e-a-musica.json")
      .then((res) => res.json())
      .then((data) => setRodadas(data))
  }, [])

  useEffect(() => {
    const rodada = rodadas[indice]
    if (rodada) {
      setRodadaAtual(rodada.pontos ?? 100) // Atualiza rodadaAtual no contexto
      if (audioRef.current) {
        audioRef.current.src = rodada.audio
      }
    }
  }, [indice, rodadas, setRodadaAtual])

  const rodada = rodadas[indice]

  const proximaRodada = () => {
    setRevelar(false)
    setTocando(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    if (indice + 1 < rodadas.length) {
      setIndice((prev) => prev + 1)
    } else {
      navigate("/ranking") // Redireciona para /ranking ao final das rodadas
    }
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (tocando) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setTocando(!tocando)
    }
  }

  const playWinSound = () => {
    const audio = new Audio(winSound)
    audio.play()
  }

  const handleRevelar = () => {
    setRevelar(true)
    playWinSound() // Toca o som ao revelar
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } }) // Efeito de confetti
  }

  const handlePontuarEquipe = (equipe: string) => {
    pontuar(equipe) // Pontua a equipe usando o contexto
    proximaRodada()
  }

  if (!rodada) return <p className="text-center mt-10">Carregando...</p>

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10 text-center">
      {/* Removida a exibição da vez da equipe */}
      <audio ref={audioRef} preload="auto" />

      <h2 className="text-3xl font-bold max-w-xl">
        {revelar ? `"${rodada.trecho}"` : "Ouça a melodia e tente adivinhar!"}
      </h2>

      {!revelar && (
        <Button
          onClick={toggleAudio}
          className="text-7xl py-4 h-16 bg-transparent hover:bg-transparent"
        >
          {tocando ? "⏸️" : "▶️"}
        </Button>
      )}

      {revelar ? (
        <>
          <p className="text-3xl font-semibold text-green-400">
            {rodada.resposta}
          </p>
          <div className="flex gap-4">
            <Button onClick={() => handlePontuarEquipe(equipes[0].nome)}>
              Pontuar {equipes[0].nome}
            </Button>
            <Button onClick={() => handlePontuarEquipe(equipes[1].nome)}>
              Pontuar {equipes[1].nome}
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={handleRevelar} className="mt-2">
          Revelar
        </Button>
      )}
    </div>
  )
}
