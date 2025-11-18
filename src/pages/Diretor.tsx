import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, TrendingUp, AlertCircle } from "lucide-react";

const Diretor = () => {
  const professores = [
    { id: 1, nome: "Prof. João Silva", disciplina: "Matemática", turmas: 3, cargaHoraria: "40h" },
    { id: 2, nome: "Profa. Maria Santos", disciplina: "Português", turmas: 4, cargaHoraria: "40h" },
    { id: 3, nome: "Prof. Carlos Oliveira", disciplina: "Física", turmas: 2, cargaHoraria: "20h" },
    { id: 4, nome: "Profa. Ana Costa", disciplina: "Química", turmas: 2, cargaHoraria: "20h" },
  ];

  const alunosDesempenho = [
    { nome: "Ana Silva", turma: "3º Ano A", media: 9.2, faltas: 2, status: "Excelente" },
    { nome: "Carlos Santos", turma: "3º Ano A", media: 7.8, faltas: 5, status: "Bom" },
    { nome: "Maria Oliveira", turma: "2º Ano B", media: 6.5, faltas: 8, status: "Regular" },
    { nome: "João Costa", turma: "2º Ano A", media: 5.2, faltas: 12, status: "Atenção" },
  ];

  const estatisticas = {
    totalAlunos: 450,
    totalProfessores: 25,
    mediaGeral: 7.8,
    taxaAprovacao: 92,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excelente":
        return "bg-green-100 text-green-800 border-green-300";
      case "Bom":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Regular":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Atenção":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Layout title="Painel do Diretor" userType="Diretor">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total Alunos</CardTitle>
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{estatisticas.totalAlunos}</div>
            <p className="text-sm text-muted-foreground mt-1">Estudantes matriculados</p>
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
            <div className="text-4xl font-bold text-accent">{estatisticas.totalProfessores}</div>
            <p className="text-sm text-muted-foreground mt-1">Corpo docente ativo</p>
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
            <div className="text-4xl font-bold text-primary">{estatisticas.mediaGeral}</div>
            <p className="text-sm text-muted-foreground mt-1">Desempenho da escola</p>
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
            <div className="text-4xl font-bold text-secondary">{estatisticas.taxaAprovacao}%</div>
            <p className="text-sm text-muted-foreground mt-1">Taxa de aprovação</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="professores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="professores">Corpo Docente</TabsTrigger>
          <TabsTrigger value="alunos">Desempenho dos Alunos</TabsTrigger>
        </TabsList>

        <TabsContent value="professores">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Informações dos Professores
              </CardTitle>
              <CardDescription>Acompanhe o corpo docente da instituição</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold">Disciplina</th>
                      <th className="text-center py-3 px-4 font-semibold">Turmas</th>
                      <th className="text-center py-3 px-4 font-semibold">Carga Horária</th>
                      <th className="text-center py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professores.map((prof) => (
                      <tr key={prof.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4 font-medium">{prof.nome}</td>
                        <td className="py-4 px-4">{prof.disciplina}</td>
                        <td className="text-center py-4 px-4">{prof.turmas}</td>
                        <td className="text-center py-4 px-4">{prof.cargaHoraria}</td>
                        <td className="text-center py-4 px-4">
                          <Badge className="bg-green-100 text-green-800 border-green-300">Ativo</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alunos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Desempenho dos Alunos
              </CardTitle>
              <CardDescription>Monitore o rendimento acadêmico dos estudantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Aluno</th>
                      <th className="text-left py-3 px-4 font-semibold">Turma</th>
                      <th className="text-center py-3 px-4 font-semibold">Média</th>
                      <th className="text-center py-3 px-4 font-semibold">Faltas</th>
                      <th className="text-center py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosDesempenho.map((aluno, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4 font-medium">{aluno.nome}</td>
                        <td className="py-4 px-4">{aluno.turma}</td>
                        <td className="text-center py-4 px-4 font-semibold">{aluno.media.toFixed(1)}</td>
                        <td className="text-center py-4 px-4">{aluno.faltas}</td>
                        <td className="text-center py-4 px-4">
                          <Badge className={getStatusColor(aluno.status)}>{aluno.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Alunos que Necessitam Atenção</h4>
                    <p className="text-sm text-yellow-800">
                      1 aluno com média abaixo de 6.0 e/ou mais de 10 faltas requer acompanhamento especial.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Diretor;
