import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, ClipboardCheck, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Professor = () => {
  const { toast } = useToast();
  const [avisoTitulo, setAvisoTitulo] = useState("");
  const [avisoMensagem, setAvisoMensagem] = useState("");

  const turmas = [
    { id: 1, nome: "3º Ano A", disciplina: "Matemática", alunos: 32 },
    { id: 2, nome: "3º Ano B", disciplina: "Matemática", alunos: 28 },
    { id: 3, nome: "2º Ano A", disciplina: "Física", alunos: 30 },
  ];

  const alunos = [
    { id: 1, nome: "Ana Silva", matricula: "2023001", turma: "3º Ano A" },
    { id: 2, nome: "Carlos Santos", matricula: "2023002", turma: "3º Ano A" },
    { id: 3, nome: "Maria Oliveira", matricula: "2023003", turma: "3º Ano A" },
    { id: 4, nome: "João Costa", matricula: "2023004", turma: "3º Ano A" },
  ];

  const handleLancarNota = () => {
    toast({
      title: "Nota Registrada",
      description: "As notas foram registradas com sucesso.",
    });
  };

  const handleRegistrarAula = () => {
    toast({
      title: "Aula Registrada",
      description: "A aula foi registrada no sistema.",
    });
  };

  const handleEnviarAviso = () => {
    if (avisoTitulo && avisoMensagem) {
      toast({
        title: "Aviso Enviado",
        description: "O aviso foi enviado para todos os alunos.",
      });
      setAvisoTitulo("");
      setAvisoMensagem("");
    }
  };

  return (
    <Layout title="Painel do Professor" userType="Professor">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Turmas</CardTitle>
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{turmas.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Turmas Ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Alunos</CardTitle>
              <Users className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent">90</div>
            <p className="text-sm text-muted-foreground mt-1">Total de Alunos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Avisos</CardTitle>
              <Bell className="w-5 h-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-secondary">12</div>
            <p className="text-sm text-muted-foreground mt-1">Avisos Enviados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notas">Lançar Notas</TabsTrigger>
          <TabsTrigger value="aulas">Registrar Aulas</TabsTrigger>
          <TabsTrigger value="avisos">Enviar Avisos</TabsTrigger>
        </TabsList>

        <TabsContent value="notas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Lançamento de Notas
              </CardTitle>
              <CardDescription>Registre as notas dos alunos por avaliação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Turma</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background">
                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.nome} - {turma.disciplina}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bimestre</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background">
                    <option>1º Bimestre</option>
                    <option>2º Bimestre</option>
                    <option>3º Bimestre</option>
                    <option>4º Bimestre</option>
                  </select>
                </div>
              </div>

              <div className="border border-border rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Matrícula</th>
                      <th className="text-left py-3 px-4 font-semibold">Aluno</th>
                      <th className="text-center py-3 px-4 font-semibold">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map((aluno) => (
                      <tr key={aluno.id} className="border-b border-border">
                        <td className="py-3 px-4">{aluno.matricula}</td>
                        <td className="py-3 px-4">{aluno.nome}</td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            className="max-w-[100px] mx-auto text-center"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button onClick={handleLancarNota} className="w-full">
                Salvar Notas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aulas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Registro de Aulas
              </CardTitle>
              <CardDescription>Registre o conteúdo ministrado e a frequência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Turma</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background">
                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.nome} - {turma.disciplina}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data da Aula</label>
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Conteúdo Ministrado</label>
                <Textarea
                  placeholder="Descreva o conteúdo da aula..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Frequência dos Alunos</label>
                <div className="border border-border rounded-lg p-4 space-y-2">
                  {alunos.map((aluno) => (
                    <div key={aluno.id} className="flex items-center justify-between py-2">
                      <span>{aluno.nome}</span>
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800 cursor-pointer hover:bg-green-200">
                          Presente
                        </Badge>
                        <Badge className="bg-red-100 text-red-800 cursor-pointer hover:bg-red-200">
                          Ausente
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleRegistrarAula} className="w-full">
                Registrar Aula
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avisos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Enviar Avisos
              </CardTitle>
              <CardDescription>Comunique-se com os alunos e responsáveis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Turma</label>
                <select className="w-full h-10 px-3 rounded-lg border border-input bg-background">
                  <option>Todas as turmas</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome} - {turma.disciplina}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Título do Aviso</label>
                <Input
                  placeholder="Ex: Prova de Matemática"
                  value={avisoTitulo}
                  onChange={(e) => setAvisoTitulo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mensagem</label>
                <Textarea
                  placeholder="Escreva sua mensagem..."
                  className="min-h-[150px]"
                  value={avisoMensagem}
                  onChange={(e) => setAvisoMensagem(e.target.value)}
                />
              </div>

              <Button onClick={handleEnviarAviso} className="w-full">
                Enviar Aviso
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Professor;
