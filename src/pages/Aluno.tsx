import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, TrendingUp } from "lucide-react";

const Aluno = () => {
  const boletim = [
    { disciplina: "Matemática", nota1: 8.5, nota2: 9.0, nota3: 8.0, media: 8.5, faltas: 2 },
    { disciplina: "Português", nota1: 9.0, nota2: 8.5, nota3: 9.5, media: 9.0, faltas: 1 },
    { disciplina: "História", nota1: 7.5, nota2: 8.0, nota3: 7.0, media: 7.5, faltas: 3 },
    { disciplina: "Geografia", nota1: 8.0, nota2: 8.5, nota3: 8.0, media: 8.2, faltas: 1 },
    { disciplina: "Ciências", nota1: 9.5, nota2: 9.0, nota3: 9.0, media: 9.2, faltas: 0 },
  ];

  const agenda = [
    { data: "15/11/2025", disciplina: "Matemática", titulo: "Prova de Álgebra", tipo: "Avaliação" },
    { data: "18/11/2025", disciplina: "Português", titulo: "Entrega de Redação", tipo: "Trabalho" },
    { data: "20/11/2025", disciplina: "História", titulo: "Seminário Segunda Guerra", tipo: "Apresentação" },
    { data: "22/11/2025", disciplina: "Ciências", titulo: "Prática Laboratório", tipo: "Aula Prática" },
  ];

  const getStatusColor = (media: number) => {
    if (media >= 9) return "bg-green-100 text-green-800 border-green-300";
    if (media >= 7) return "bg-blue-100 text-blue-800 border-blue-300";
    if (media >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <Layout title="Painel do Aluno" userType="Aluno">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Média Geral</CardTitle>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">8.5</div>
            <p className="text-sm text-muted-foreground mt-1">Desempenho Excelente</p>
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
            <div className="text-4xl font-bold text-secondary">7</div>
            <p className="text-sm text-muted-foreground mt-1">Presença Regular</p>
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
            <div className="text-4xl font-bold text-accent">5</div>
            <p className="text-sm text-muted-foreground mt-1">Em Andamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Boletim Escolar
            </CardTitle>
            <CardDescription>Acompanhe suas notas e frequência</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Disciplina</th>
                    <th className="text-center py-3 px-4 font-semibold">1º Bim</th>
                    <th className="text-center py-3 px-4 font-semibold">2º Bim</th>
                    <th className="text-center py-3 px-4 font-semibold">3º Bim</th>
                    <th className="text-center py-3 px-4 font-semibold">Média</th>
                    <th className="text-center py-3 px-4 font-semibold">Faltas</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {boletim.map((item, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{item.disciplina}</td>
                      <td className="text-center py-3 px-4">{item.nota1.toFixed(1)}</td>
                      <td className="text-center py-3 px-4">{item.nota2.toFixed(1)}</td>
                      <td className="text-center py-3 px-4">{item.nota3.toFixed(1)}</td>
                      <td className="text-center py-3 px-4 font-semibold">{item.media.toFixed(1)}</td>
                      <td className="text-center py-3 px-4">{item.faltas}</td>
                      <td className="text-center py-3 px-4">
                        <Badge className={getStatusColor(item.media)}>
                          {item.media >= 6 ? "Aprovado" : "Recuperação"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Agenda Escolar
            </CardTitle>
            <CardDescription>Próximas atividades e avaliações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agenda.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 text-center min-w-[70px]">
                    <div className="text-xs font-semibold">{item.data.split("/")[0]}</div>
                    <div className="text-lg font-bold">{item.data.split("/")[1]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{item.disciplina}</Badge>
                      <Badge className="bg-secondary text-secondary-foreground">{item.tipo}</Badge>
                    </div>
                    <h4 className="font-semibold text-foreground">{item.titulo}</h4>
                  </div>
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
