import { usePlacar } from "@/contexts/placar-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ConfigPage() {
  const { equipes, atualizarPontuacao, resetar } = usePlacar()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10">
      <h2 className="text-4xl font-bold">Painel de Controle</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {equipes.map((equipe, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label htmlFor={equipe.nome} className="font-semibold">
              {equipe.nome}
            </label>
            <Input
              id={equipe.nome}
              type="number"
              value={equipe.pontuacao}
              onChange={(e) =>
                atualizarPontuacao(equipe.nome, parseInt(e.target.value) || 0)
              }
            />
          </div>
        ))}
      </div>

      <Button variant="destructive" onClick={resetar}>
        Resetar Pontuações
      </Button>
    </div>
  )
}
