import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="intro">
      <h1>Not found</h1>
      <p className="lede">
        That page doesn't exist. <Link to="/">Back to projects</Link>.
      </p>
    </section>
  );
}
