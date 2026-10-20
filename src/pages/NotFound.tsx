import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-pad">
      <h1 className="page-title">Page not found</h1>
      <p className="muted">This page does not exist. <Link to="/">Go to Home</Link></p>
    </div>
  );
}
