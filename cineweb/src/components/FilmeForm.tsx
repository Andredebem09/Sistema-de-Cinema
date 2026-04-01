import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const filmeSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  classificacaoEtaria: z.string().min(1, "Classificação etária é obrigatória"),
  duracao: z.number().positive("Duração deve ser maior que 0"),
  generoNome: z.string().min(1, "Gênero é obrigatório")
});

type FilmeInput = z.infer<typeof filmeSchema>;

export default function FilmeForm({ onSubmit, defaultValues }: { onSubmit: (f: FilmeInput) => void, defaultValues?: Partial<FilmeInput> }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FilmeInput>({
    resolver: zodResolver(filmeSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <label>Título</label>
        <input className={`form-control ${errors.titulo ? "is-invalid" : ""}`} {...register("titulo")} />
        <div className="invalid-feedback">{errors.titulo?.message}</div>
      </div>

      <div className="row">
        <div className="col">
          <label>Classificação Etária</label>
          <input className={`form-control ${errors.classificacaoEtaria ? "is-invalid" : ""}`} {...register("classificacaoEtaria")} />
          <div className="invalid-feedback">{errors.classificacaoEtaria?.message}</div>
        </div>
        <div className="col">
          <label>Duração (min)</label>
          <input type="number" className={`form-control ${errors.duracao ? "is-invalid" : ""}`} {...register("duracao", { valueAsNumber: true })} />
          <div className="invalid-feedback">{errors.duracao?.message}</div>
        </div>
      </div>

      <div className="mb-2 mt-3">
        <label>Gênero</label>
        <input className={`form-control ${errors.generoNome ? "is-invalid" : ""}`} {...register("generoNome")} />
        <div className="invalid-feedback">{errors.generoNome?.message}</div>
      </div>

      <button className="btn btn-cine">Salvar</button>
    </form>
  );
}
