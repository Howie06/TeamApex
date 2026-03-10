import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>SunSafe Victoria Prototype</strong>
        <p>
          A routed front-end concept for live UV awareness, education, and practical protection
          planning.
        </p>
      </div>

      <div className="footer-links">
        <Link to="/uv-index">Check UV</Link>
        <Link to="/protection-planner">Plan protection</Link>
        {/* <Link to="/about">About the project</Link> */}
      </div>
    </footer>
  )
}

export default Footer
