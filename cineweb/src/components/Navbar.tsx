import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "var(--primary)" }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* <img src="/logo.png" alt="logo" style={{ width: 36, marginRight: 8 }} /> */}
          CineWeb
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/generos"> Gêneros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/filmes"> Filmes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/salas"> Salas</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/sessoes"> Sessões</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/ingressos"> Ingressos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/lanches"> Lanches</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
