import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-red shadow-sm">

      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          <i className="bi bi-film me-2" />
          Cinema
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Alternar navegação"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/filmes">
                Filmes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/salas">
                Salas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sessoes">
                Sessões
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ingressos">
                Ingressos
              </NavLink>
            </li>
             <li className="nav-item">
              <NavLink className="nav-link" to="/combos">Combos</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
