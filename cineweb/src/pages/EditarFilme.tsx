import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import FilmeForm from "../components/FilmeForm";

export default function EditarFilme() {
  const { id } = useParams();
  const nav = useNavigate();

  const [filme, setFilme] = useState<any | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const r = await api.get(`/filmes/${id}`);
    setFilme(r.data);
  }

  async function salvar(d: any) {
    const generosRes = await api.get("/generos");
    const generoExistente = generosRes.data.find(
      (g: any) => g.nome.toLowerCase() === String(d.generoNome).toLowerCase(),
    );

    const generoId = generoExistente
      ? generoExistente.id
      : (await api.post("/generos", { nome: d.generoNome })).data.id;

    const payload = {
      titulo: d.titulo,
      classificacaoEtaria: d.classificacaoEtaria,
      duracao: Number(d.duracao),
      generoId,
    };

    await api.patch(`/filmes/${id}`, payload);
    nav("/filmes");
  }

  if (!filme) return <p>Carregando...</p>;

  return (
    <>
      <h3>Editar Filme</h3>
      <FilmeForm
        defaultValues={{
          titulo: filme.titulo,
          classificacaoEtaria: filme.classificacaoEtaria,
          duracao: filme.duracao,
          generoNome: filme.genero?.nome ?? "",
        }}
        onSubmit={salvar}
      />
    </>
  );
}
