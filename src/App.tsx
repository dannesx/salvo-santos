import { RouterProvider } from "react-router"
import { router } from "./Router"
import { PlacarProvider } from "./contexts/placar-context"
import { AppProvider } from "./contexts/app-context"

const App = () => {
  return (
    <>
      <AppProvider>
        <PlacarProvider>
          <RouterProvider router={router} />
        </PlacarProvider>
      </AppProvider>
    </>
  )
}
export default App
