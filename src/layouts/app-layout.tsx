import Header from "@/components/header"
import Score from "@/components/score"
import { Outlet } from "react-router"
import { useAppContext } from "@/contexts/app-context"
import { usePlacar } from "@/contexts/placar-context"

const AppLayout = () => {
  const { equipes: nomesEquipes } = useAppContext()
  const { equipes } = usePlacar()

  return (
    <main className="w-screen container mx-auto px-4 relative min-h-screen">
      <Header />

      <Outlet />

      {/* Exibe os placares das equipes */}
      <Score side="left" name={nomesEquipes[0]} score={equipes[0]?.pontuacao || 0} />
      <Score side="right" name={nomesEquipes[1]} score={equipes[1]?.pontuacao || 0} />
    </main>
  )
}

export default AppLayout
