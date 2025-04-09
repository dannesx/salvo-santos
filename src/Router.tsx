import { createBrowserRouter } from "react-router"
import AppLayout from "./layouts/app-layout"
import MenuPage from "./pages/menu"
import RankingPage from "./pages/ranking"
import ConfigPage from "./pages/config"
import QualEMusica from "./pages/games/qual-e-a-musica"
import JogoDas3Pistas from "./pages/games/pistas"
import RodaARoda from "./pages/games/roda-a-roda"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <MenuPage />,
      },
      {
        path: "ranking",
        element: <RankingPage />,
      },
      {
        path: "config",
        element: <ConfigPage />,
      },
      {
        path: "jogos/musica",
        element: <QualEMusica />,
      },
      {
        path: "jogos/pistas",
        element: <JogoDas3Pistas />,
      },
      {
        path: "jogos/roda",
        element: <RodaARoda />,
      },
    ],
  },
])
