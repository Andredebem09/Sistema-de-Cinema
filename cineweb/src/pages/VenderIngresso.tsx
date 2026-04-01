import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useForm } from "react-hook-form";

export default function VenderIngresso() {
  const { id } = useParams();
  const { register, handleSubmit } = useForm();
  const [sessao, setSessao] = useState<any>(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get(`/sessoes/${id}`).then(r => {
      setSessao(r.data);
    });
  }, []);

  async function vender(d: any) {
    const valorInteira = Number(sessao.valorIngresso);
    const valorPago = d.tipo === "MEIA" ? Number((valorInteira / 2).toFixed(2)) : valorInteira;

    await api.post("/ingressos", {
      tipo: d.tipo,
      sessaoId: Number(id),
      valorPago,
    });

    nav("/sessoes");
  }

  if (!sessao) return <p>Carregando...</p>;

  return (
    <>
      <h3>Vender Ingresso</h3>

      <p><strong>Filme:</strong> {sessao.filme?.titulo}</p>
      <p><strong>Sala:</strong> {sessao.sala?.numero}</p>
      <p><strong>Data/Hora:</strong> {new Date(sessao.horarioInicio).toLocaleString()}</p>
      <p><strong>Valor Inteira:</strong> R$ {Number(sessao.valorIngresso).toFixed(2)}</p>

      <form onSubmit={handleSubmit(vender)}>
        <label>Tipo</label>
        <select {...register("tipo")} className="form-control mb-3">
          <option value="INTEIRA">Inteira</option>
          <option value="MEIA">Meia</option>
        </select>

        <button className="btn btn-cine">Confirmar Venda</button>
      </form>
    </>
  );
}
