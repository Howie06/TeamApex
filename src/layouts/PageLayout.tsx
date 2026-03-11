import LocationToolbar from '../components/LocationToolbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function PageLayout() {
  return (
    <div className="app-shell">
      <div className="orb orb-left" aria-hidden="true" />
      <div className="orb orb-right" aria-hidden="true" />
      <Navbar />
      <LocationToolbar />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PageLayout
