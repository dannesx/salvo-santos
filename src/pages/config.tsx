import { useAppContext } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ConfigPage() {
  const { equipes, setEquipes } = useAppContext()

  const atualizarNomeEquipe = (index: number, novoNome: string) => {
    const novasEquipes = [...equipes]
    novasEquipes[index] = novoNome
    setEquipes(novasEquipes)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10">
      <h2 className="text-4xl font-bold">Configuração de Equipes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {equipes.map((equipe, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label htmlFor={`equipe-${index}`} className="font-semibold">
              Nome da Equipe {index + 1}
            </label>
            <Input
              id={`equipe-${index}`}
              value={equipe}
              onChange={(e) => atualizarNomeEquipe(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <Button variant="default" onClick={() => alert("Configurações salvas!")}>
        Salvar Configurações
      </Button>
    </div>
  )
}
