interface Props {
  filme: any;
  onDelete: () => void;
}

export default function FilmeCard({ filme, onDelete }: Props) {

  if (!filme) return null; // evita tela branca

  return (
    <div className="card p-3 shadow-sm">
      <h5>{filme.titulo}</h5>
      <p className="mb-1"><strong>Gênero:</strong> {filme.genero?.nome ?? "-"}</p>
      <p className="mb-1"><strong>Classificação:</strong> {filme.classificacaoEtaria}</p>
      <p className="mb-0"><strong>Duração:</strong> {filme.duracao} min</p>

      <div className="d-flex justify-content-between mt-3">
        <a href={`/filmes/editar/${filme.id}`} className="btn btn-primary">
          Editar
        </a>

        <button
          className="btn btn-danger"
          onClick={onDelete}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
