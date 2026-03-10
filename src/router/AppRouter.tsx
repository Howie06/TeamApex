import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageLayout from '../layouts/PageLayout'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import PreventionPage from '../pages/PreventionPage'
import SkinPage from '../pages/SkinPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<HomePage />} path="/" />
          <Route element={<SkinPage />} path="/skin-guide" />
          <Route element={<PreventionPage />} path="/prevention" />
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
