import Header from "@/components/header"
import Score from "@/components/score"
import { Outlet, useLocation } from "react-router"
import { useAppContext } from "@/contexts/app-context" // Usando AppContext

const AppLayout = () => {
  const { equipes, equipeAtual } = useAppContext() // Obtendo equipes e equipeAtual do AppContext
  const location = useLocation()

  const hide = ["/", "/ranking", "/config", "/jogos/musica"].includes(
    location.pathname
  )

  return (
    <main className="w-screen container mx-auto px-4 relative min-h-screen">
      <Header />

      <Outlet />

      {/* Exibe os placares das equipes */}
      <Score
        side="left"
        name={equipes[0]?.nome}
        score={equipes[0]?.pontuacao || 0}
      />
      {/* Exibe a vez da equipe */}
      <div
        className="text-2xl font-semibold text-primary absolute bottom-4 left-1/2 -translate-x-1/2 uppercase data-[hidden=true]:hidden"
        data-hidden={hide}
      >
        {equipeAtual}
      </div>
      <Score
        side="right"
        name={equipes[1]?.nome}
        score={equipes[1]?.pontuacao || 0}
      />
    </main>
  )
}

export default AppLayout
