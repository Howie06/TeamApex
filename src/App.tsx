import { SunSafetyProvider } from './context/SunSafetyContext'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <SunSafetyProvider>
      <AppRouter />
    </SunSafetyProvider>
  )
}

export default App
