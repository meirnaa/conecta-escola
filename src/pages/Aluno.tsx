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
import { Calendar, BookOpen, TrendingUp } from "lucide-react";

/* 🔹 TIPOS */
type BoletimItem = {
  disciplina: string;
  nota1: number;
  nota2: number;
  nota3: number;
  media: number;
  faltas: number;
};

type AgendaItem = {
  id: string;
  data: string;
  disciplina: string;
  titulo: string;
  tipo: string;
};

const Aluno = () => {
  /* 🔹 STATES */
  const [boletim, setBoletim] = useState<BoletimItem[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 ID DO ALUNO (vem do login) */
  const alunoId = localStorage.getItem("userId");

  /* 🔹 BUSCAR DADOS NO BACKEND */
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const boletimRes = await fetch(
          `https://sage-1zk3.onrender.com/alunos/${alunoId}/boletim`
        );

        const agendaRes = await fetch(
          `https://sage-1zk3.onrender.com/alunos/${alunoId}/agenda`
        );

        const boletimData = await boletimRes.json();
        const agendaData = await agendaRes.json();

        setBoletim(boletimData);
        setAgenda(agendaData);
      } catch (error) {
        console.error("Erro ao carregar dados do aluno", error);
      } finally {
        setLoading(false);
      }
    };

    if (alunoId) {
      carregarDados();
    }
  }, [alunoId]);

  /* 🔹 LOADING */
  if (loading) {
    return (
      <Layout title="Painel do Aluno" userType="Aluno">
        <p className="text-center mt-10">Carregando dados...</p>
      </Layout>
    );
  }

  /* 🔹 FUNÇÃO DE STATUS */
  const getStatusColor = (media: number) => {
    if (media >= 9) return "bg-green-100 text-green-800 border-green-300";
    if (media >= 7) return "bg-blue-100 text-blue-800 border-blue-300";
    if (media >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  /* 🔹 CÁLCULOS */
  const mediaGeral =
    boletim.reduce((acc, item) => acc + item.media, 0) /
    (boletim.length || 1);

  const totalFaltas = boletim.reduce(
    (acc, item) => acc + item.faltas,
    0
  );

  return (
    <Layout title="Painel do Aluno" userType="Aluno">
      {/* 🔹 CARDS SUPERIORES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Média Geral</CardTitle>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {mediaGeral.toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Desempenho Geral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total de Faltas</CardTitle>
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-secondary">
              {totalFaltas}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Frequência
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Disciplinas</CardTitle>
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent">
              {boletim.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Em Andamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 BOLETIM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Boletim Escolar
            </CardTitle>
            <CardDescription>
              Acompanhe suas notas e frequência
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Disciplina</th>
                    <th className="text-center p-3">1º</th>
                    <th className="text-center p-3">2º</th>
                    <th className="text-center p-3">3º</th>
                    <th className="text-center p-3">Média</th>
                    <th className="text-center p-3">Faltas</th>
                    <th className="text-center p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {boletim.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.disciplina}</td>
                      <td className="text-center p-3">{item.nota1}</td>
                      <td className="text-center p-3">{item.nota2}</td>
                      <td className="text-center p-3">{item.nota3}</td>
                      <td className="text-center p-3 font-semibold">
                        {item.media.toFixed(1)}
                      </td>
                      <td className="text-center p-3">
                        {item.faltas}
                      </td>
                      <td className="text-center p-3">
                        <Badge className={getStatusColor(item.media)}>
                          {item.media >= 6
                            ? "Aprovado"
                            : "Recuperação"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 🔹 AGENDA */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Agenda Escolar
            </CardTitle>
            <CardDescription>
              Próximas atividades
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {agenda.map(item => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline">
                      {item.disciplina}
                    </Badge>
                    <Badge>{item.tipo}</Badge>
                  </div>
                  <p className="font-semibold">{item.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.data}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Aluno;
