import Header from "@/components/header"
import Score from "@/components/score"
import { Outlet } from "react-router"
import { useAppContext } from "@/contexts/app-context" // Usando AppContext

const AppLayout = () => {
  const { equipes } = useAppContext() // Obtendo equipes do AppContext

  return (
    <main className="w-screen container mx-auto px-4 relative min-h-screen">
      <Header />

      <Outlet />

      {/* Exibe os placares das equipes */}
      <Score side="left" name={equipes[0]?.nome} score={equipes[0]?.pontuacao || 0} />
      <Score side="right" name={equipes[1]?.nome} score={equipes[1]?.pontuacao || 0} />
    </main>
  )
}

export default AppLayout
