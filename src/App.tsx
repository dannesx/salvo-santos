import { RouterProvider } from "react-router"
import { router } from "./Router"
import { AppProvider } from "./contexts/app-context"

const App = () => {
  return (
    <>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </>
  )
}
export default App
