import FilmeForm from "../components/FilmeForm";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function NovoFilme() {
  const nav = useNavigate();

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

    const r = await api.post("/filmes", payload);

    console.log("SALVO:", r.data);

    nav("/filmes");
  }

  return (
    <>
      <h3>Novo Filme</h3>
      <FilmeForm onSubmit={salvar} />
    </>
  );
}
