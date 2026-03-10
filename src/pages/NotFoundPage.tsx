import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'

function NotFoundPage() {
  return (
    <div className="page-view">
      <PageIntro
        eyebrow="Page not found"
        title="This route does not exist in the current prototype."
        description="Use the main navigation to return to one of the routed product pages."
        actions={<Link className="header-action" to="/">Back to home</Link>}
      />
    </div>
  )
}

export default NotFoundPage
