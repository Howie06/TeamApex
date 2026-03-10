import { NavLink } from 'react-router-dom'
import { navItems } from '../data/siteData'

function Navbar() {
  return (
    <header className="masthead">
      <div className="brand-block">
        <span className="brand-pill">SunSafe Victoria</span>
        <span className="brand-caption">Three-epic UV safety prototype</span>
      </div>

      <nav className="top-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`.trim()
            }
            end={item.path === '/'}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
