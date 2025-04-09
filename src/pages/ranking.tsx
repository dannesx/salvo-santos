import { usePlacar } from "@/contexts/placar-context"

export default function RankingPage() {
  const { equipes } = usePlacar()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10">
      <h2 className="text-4xl font-bold">Ranking das Equipes</h2>

      <div className="flex flex-col sm:flex-row gap-8">
        {equipes.map((equipe, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 w-64 h-40 text-white flex flex-col items-center justify-center shadow-xl ring-4 ring-white ${index === 0 ? 'bg-chart-1' : 'bg-chart-2'}`}
          >
            <h3 className="text-2xl font-bold mb-2">{equipe.nome}</h3>
            <p className="text-4xl font-mono">{equipe.pontuacao}</p>
          </div>
        ))}
      </div>
    </div>
  )
}