import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, TrendingUp, AlertCircle } from "lucide-react";

interface Usuario {
  id: string;
  name: string;
  role: "aluno" | "professor" | "secretaria";
  disciplina?: string;
  cargaHoraria?: string;
  turmas?: number;
  turma?: string;
  notas?: Record<string, number[]>; // notas por disciplina
  media?: number; // média geral do aluno
}

const disciplinas = ["Matemática", "Português", "História", "Geografia", "Ciências", "Física"];

const Diretor = () => {
  const [alunos, setAlunos] = useState<Usuario[]>([]);
  const [professores, setProfessores] = useState<Usuario[]>([]);
  const [turmaFiltro, setTurmaFiltro] = useState<string>("");
  const [disciplinaFiltro, setDisciplinaFiltro] = useState<string>("");

  useEffect(() => {
    const fetchDados = async () => {
      const res = await fetch("https://sage-1zk3.onrender.com/users");
      const data: Usuario[] = await res.json();
      setAlunos(data.filter(u => u.role === "aluno"));
      setProfessores(data.filter(u => u.role === "professor"));
    };
    fetchDados();
  }, []);

  // Média geral do aluno (todas as disciplinas)
  const calcularMediaGeralAluno = (aluno: Usuario) => {
    const todasNotas = Object.values(aluno.notas ?? {})
      .flat()
      .filter(n => typeof n === "number");
    if (todasNotas.length === 0) return null;
    return todasNotas.reduce((acc, n) => acc + n, 0) / todasNotas.length;
  };

  // Adiciona média geral do aluno
  const alunosComMedia = alunos.map(a => ({
    ...a,
    media: calcularMediaGeralAluno(a),
  }));

  // Média geral da escola
  const mediaGeralEscola = alunosComMedia.length > 0
    ? (
        alunosComMedia.reduce((acc, a) => acc + (a.media ?? 0), 0) /
        alunosComMedia.length
      ).toFixed(1)
    : "-";

  // Taxa de aprovação (baseada na média geral)
  const aprovados = alunosComMedia.filter(a => (a.media ?? 0) >= 7).length;
  const taxaAprovacao = alunosComMedia.length > 0
    ? Math.round((aprovados / alunosComMedia.length) * 100)
    : 0;

  // Função para calcular média de um aluno em uma disciplina específica
  const calcularMediaDisciplina = (aluno: Usuario, disciplina: string) => {
    const notas = aluno.notas?.[disciplina] ?? [];
    if (notas.length === 0) return null;
    return notas.reduce((acc, n) => acc + n, 0) / notas.length;
  };

  // Status do aluno baseado na média (disciplina específica ou geral)
  const getStatusAluno = (aluno: Usuario) => {
    let mediaParaStatus: number | null = null;

    if (disciplinaFiltro) {
      mediaParaStatus = calcularMediaDisciplina(aluno, disciplinaFiltro);
    } else {
      mediaParaStatus = aluno.media ?? null;
    }

    if (mediaParaStatus === null) return "-";
    if (mediaParaStatus >= 7) return "Aprovado";
    if (mediaParaStatus >= 4) return "Prova Final";
    return "Reprovado";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800 border-green-300";
      case "Prova Final":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Reprovado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Filtrar alunos por turma
  const alunosFiltrados = alunosComMedia.filter(a =>
    turmaFiltro ? a.turma === turmaFiltro : true
  );

  // Ordenar alunos: se todas as turmas selecionadas, ordena por turma e depois nome; senão, apenas por nome
  const alunosOrdenados = [...alunosFiltrados].sort((a, b) => {
    if (!turmaFiltro) {
      if ((a.turma || "") < (b.turma || "")) return -1;
      if ((a.turma || "") > (b.turma || "")) return 1;
    }
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  });

  const turmas = Array.from(new Set(alunos.map(a => a.turma || "")));

  return (
    <Layout title="Painel do Diretor" userType="Diretor">
      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total Alunos</CardTitle>
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{alunos.length}</div>
            <p className="text-sm text-muted-foreground">Estudantes matriculados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Professores</CardTitle>
              <Users className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent">{professores.length}</div>
            <p className="text-sm text-muted-foreground">Corpo docente ativo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Média Geral</CardTitle>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{mediaGeralEscola}</div>
            <p className="text-sm text-muted-foreground">Desempenho da escola</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Aprovação</CardTitle>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-secondary">{taxaAprovacao}%</div>
            <p className="text-sm text-muted-foreground">Taxa de aprovação</p>
          </CardContent>
        </Card>
      </div>

      {/* TABS */}
      <Tabs defaultValue="professores">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="professores">Corpo Docente</TabsTrigger>
          <TabsTrigger value="alunos">Desempenho dos Alunos</TabsTrigger>
        </TabsList>

        {/* PROFESSORES */}
        <TabsContent value="professores">
          <Card>
            <CardHeader>
              <CardTitle>Informações dos Professores</CardTitle>
              <CardDescription>Acompanhe o corpo docente da instituição</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Nome</th>
                    <th className="text-left p-3">Disciplina</th>
                    <th className="text-center p-3">Turmas</th>
                    <th className="text-center p-3">Carga Horária</th>
                    <th className="text-center p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {professores.map(prof => (
                    <tr key={prof.id} className="border-b">
                      <td className="p-3 font-medium">{prof.name}</td>
                      <td className="p-3">{prof.disciplina || "-"}</td>
                      <td className="text-center p-3">{prof.turmas ?? "-"}</td>
                      <td className="text-center p-3">{prof.cargaHoraria || "-"}</td>
                      <td className="text-center p-3">
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALUNOS */}
        <TabsContent value="alunos">
          <div className="flex gap-4 mb-4">
            <select
              className="border p-2 rounded"
              value={turmaFiltro}
              onChange={e => setTurmaFiltro(e.target.value)}
            >
              <option value="">Todas as turmas</option>
              {turmas.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select
              className="border p-2 rounded"
              value={disciplinaFiltro}
              onChange={e => setDisciplinaFiltro(e.target.value)}
            >
              <option value="">Todas as disciplinas</option>
              {disciplinas.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho dos Alunos</CardTitle>
              <CardDescription>Monitore o rendimento acadêmico</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Aluno</th>
                    <th className="text-left p-3">Turma</th>
                    {disciplinaFiltro && <th className="text-center p-3">Notas ({disciplinaFiltro})</th>}
                    <th className="text-center p-3">Média</th>
                    <th className="text-center p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosOrdenados.map(aluno => {
                    const mediaDisciplina = disciplinaFiltro
                      ? calcularMediaDisciplina(aluno, disciplinaFiltro)
                      : aluno.media;

                    const notasDisciplina = disciplinaFiltro
                      ? aluno.notas?.[disciplinaFiltro] ?? []
                      : [];

                    const status = getStatusAluno(aluno);

                    return (
                      <tr key={aluno.id} className="border-b">
                        <td className="p-3 font-medium">{aluno.name}</td>
                        <td className="p-3">{aluno.turma || "-"}</td>
                        {disciplinaFiltro && (
                          <td className="text-center p-3">
                            {notasDisciplina.length > 0
                              ? notasDisciplina.join(", ")
                              : "-"}
                          </td>
                        )}
                        <td className="text-center p-3">
                          {mediaDisciplina !== null ? mediaDisciplina.toFixed(1) : "-"}
                        </td>
                        <td className="text-center p-3">
                          <Badge className={getStatusColor(status)}>{status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Aviso de atenção */}
              {alunosOrdenados.some(a => (disciplinaFiltro ? calcularMediaDisciplina(a, disciplinaFiltro) ?? 0 : a.media ?? 0) < 7) && (
                <div className="mt-6 p-4 bg-yellow-50 border rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Alguns alunos estão com média abaixo de 7 e requerem acompanhamento.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Diretor;
