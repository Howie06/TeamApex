import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>SunSafe Victoria Prototype</strong>
        <p>A three-page front-end concept built around Track, Understand, and Prevent.</p>
      </div>

      <div className="footer-links">
        <Link to="/">Track on home</Link>
        <Link to="/skin-guide">Understand skin impact</Link>
        <Link to="/prevention">Plan prevention</Link>
      </div>
    </footer>
  )
}

export default Footer
