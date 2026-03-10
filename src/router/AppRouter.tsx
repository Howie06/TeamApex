import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageLayout from '../layouts/PageLayout'
// import AboutPage from '../pages/AboutPage'
import EducationPage from '../pages/EducationPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/ProfilePage'
import ProtectionPlannerPage from '../pages/ProtectionPlannerPage'
import UVIndexPage from '../pages/UVIndexPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<HomePage />} path="/" />
          <Route element={<UVIndexPage />} path="/uv-index" />
          <Route element={<EducationPage />} path="/education" />
          <Route element={<ProtectionPlannerPage />} path="/protection-planner" />
          <Route element={<ProfilePage />} path="/profile" />
          {/* <Route element={<AboutPage />} path="/about" /> */}
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
