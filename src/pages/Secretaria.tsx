import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Search, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Secretaria = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const alunos = [
    { id: 1, nome: "Ana Silva", matricula: "2023001", turma: "3º Ano A", status: "Ativo" },
    { id: 2, nome: "Carlos Santos", matricula: "2023002", turma: "3º Ano A", status: "Ativo" },
    { id: 3, nome: "Maria Oliveira", matricula: "2023003", turma: "2º Ano B", status: "Ativo" },
  ];

  const professores = [
    { id: 1, nome: "Prof. João Silva", cpf: "123.456.789-00", disciplina: "Matemática" },
    { id: 2, nome: "Profa. Maria Santos", cpf: "987.654.321-00", disciplina: "Português" },
  ];

  const handleCadastrar = (tipo: string) => {
    toast({
      title: "Cadastro Realizado",
      description: `${tipo} cadastrado(a) com sucesso no sistema.`,
    });
  };

  const handleEditar = (tipo: string, nome: string) => {
    toast({
      title: "Edição Iniciada",
      description: `Editando informações de ${nome}.`,
    });
  };

  return (
    <Layout title="Painel da Secretaria" userType="Secretaria">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Alunos Cadastrados</CardTitle>
              <Users className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">450</div>
            <p className="text-sm text-muted-foreground mt-1">Total de estudantes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Professores Cadastrados</CardTitle>
              <Users className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent">25</div>
            <p className="text-sm text-muted-foreground mt-1">Corpo docente</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cadastrar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cadastrar">Cadastrar</TabsTrigger>
          <TabsTrigger value="gerenciar">Gerenciar</TabsTrigger>
        </TabsList>

        <TabsContent value="cadastrar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Cadastrar Aluno
                </CardTitle>
                <CardDescription>Registre um novo estudante no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input placeholder="Digite o nome do aluno" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Nascimento</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF</label>
                    <Input placeholder="000.000.000-00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsável</label>
                  <Input placeholder="Nome do responsável" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Turma</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background">
                    <option>Selecione uma turma</option>
                    <option>1º Ano A</option>
                    <option>2º Ano A</option>
                    <option>3º Ano A</option>
                  </select>
                </div>
                <Button onClick={() => handleCadastrar("Aluno")} className="w-full">
                  Cadastrar Aluno
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Cadastrar Professor
                </CardTitle>
                <CardDescription>Registre um novo professor no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input placeholder="Digite o nome do professor" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Nascimento</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF</label>
                    <Input placeholder="000.000.000-00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Formação</label>
                  <Input placeholder="Ex: Licenciatura em Matemática" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Disciplina</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background">
                    <option>Selecione uma disciplina</option>
                    <option>Matemática</option>
                    <option>Português</option>
                    <option>História</option>
                    <option>Geografia</option>
                    <option>Ciências</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Carga Horária</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background">
                    <option>20 horas</option>
                    <option>40 horas</option>
                  </select>
                </div>
                <Button onClick={() => handleCadastrar("Professor")} className="w-full">
                  Cadastrar Professor
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gerenciar">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Gerenciar Alunos
                </CardTitle>
                <CardDescription>Busque e edite informações dos alunos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar por nome ou matrícula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">Matrícula</th>
                        <th className="text-left py-3 px-4 font-semibold">Nome</th>
                        <th className="text-left py-3 px-4 font-semibold">Turma</th>
                        <th className="text-center py-3 px-4 font-semibold">Status</th>
                        <th className="text-center py-3 px-4 font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alunos.map((aluno) => (
                        <tr key={aluno.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{aluno.matricula}</td>
                          <td className="py-3 px-4 font-medium">{aluno.nome}</td>
                          <td className="py-3 px-4">{aluno.turma}</td>
                          <td className="text-center py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {aluno.status}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Button
                              onClick={() => handleEditar("Aluno", aluno.nome)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Gerenciar Professores
                </CardTitle>
                <CardDescription>Busque e edite informações dos professores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Buscar por nome ou CPF..." className="flex-1" />
                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">Nome</th>
                        <th className="text-left py-3 px-4 font-semibold">CPF</th>
                        <th className="text-left py-3 px-4 font-semibold">Disciplina</th>
                        <th className="text-center py-3 px-4 font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professores.map((prof) => (
                        <tr key={prof.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{prof.nome}</td>
                          <td className="py-3 px-4">{prof.cpf}</td>
                          <td className="py-3 px-4">{prof.disciplina}</td>
                          <td className="text-center py-3 px-4">
                            <Button
                              onClick={() => handleEditar("Professor", prof.nome)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Secretaria;
