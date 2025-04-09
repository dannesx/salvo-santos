import { useAppContext } from "@/contexts/app-context" // Atualizado para usar AppContext

export default function RankingPage() {
  const { equipes } = useAppContext() // Usando AppContext para obter as equipes

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10">
      <h2 className="text-4xl font-bold">Ranking das Equipes</h2>

      {equipes.length === 0 ? (
        <p className="text-xl text-gray-500">
          Nenhuma equipe disponível no momento.
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row gap-8">
          {equipes.map((equipe, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 w-64 h-40 text-white flex flex-col items-center justify-center shadow-xl ring-4 ring-primary bg-secondary`}
            >
              <h3 className="text-2xl font-bold mb-2">{equipe.nome}</h3>
              <p className="text-4xl font-mono">{equipe.pontuacao}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
