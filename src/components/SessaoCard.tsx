import { Link } from "react-router-dom";

interface SessaoCardProps {
  filme: any;
  sala: string;
  horario: string;
}

const SessaoCard = ({ filme, sala, horario }: SessaoCardProps) => {
  return (
    <div className="card shadow-sm" style={{ width: "200px" }}>
      <img
        src={filme.foto}
        className="card-img-top"
        style={{ height: "260px", objectFit: "cover" }}
      />

      <div className="card-body">
        <h6 className="card-title text-center fw-bold">{filme.nome}</h6>

        <p className="text-center mb-1">
          <strong>Sala:</strong> {sala}
        </p>

        <p className="text-center mb-2">
          <strong>Horário:</strong> {horario}
        </p>

        <Link
          className="btn btn-primary w-100"
          to={`/sessao/${filme.id}`}
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default SessaoCard;
