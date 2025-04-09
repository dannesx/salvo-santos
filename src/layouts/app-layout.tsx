import Header from "@/components/header"
import Score from "@/components/score"
import { Outlet } from "react-router"

const AppLayout = () => {
  return (
    <main className="w-screen container mx-auto px-4 relative min-h-screen">
      <Header />

      <Outlet />

      <Score name="Salvo" score={100} side="left" />
      <Score name="Santos" score={200} side="right" />
    </main>
  )
}
export default AppLayout
