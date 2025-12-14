/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Search, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Secretaria = () => {
  const { toast } = useToast();

  // Estados para armazenar usuários
  const [alunos, setAlunos] = useState<any[]>([]);
  const [professores, setProfessores] = useState<any[]>([]);

  // useEffect para buscar usuários do backend
useEffect(() => {
  const fetchAlunos = async () => {
    try {
      const res = await fetch(
        "https://sage-1zk3.onrender.com/users?role=aluno"
      );
      if (!res.ok) throw new Error("Erro ao buscar alunos");
      const data = await res.json();
      setAlunos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
      setAlunos([]);
    }
  };

  const fetchProfessores = async () => {
    try {
      const res = await fetch(
        "https://sage-1zk3.onrender.com/users?role=professor"
      );
      if (!res.ok) throw new Error("Erro ao buscar professores");
      const data = await res.json();
      setProfessores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar professores:", err);
      setProfessores([]);
    }
  };

  fetchAlunos();
  fetchProfessores();
}, []);

const [alunoNome, setAlunoNome] = useState("");
const [alunoNascimento, setAlunoNascimento] = useState("");
const [alunoCPF, setAlunoCPF] = useState("");
const [alunoResponsavel, setAlunoResponsavel] = useState("");
const [alunoTelefone, setAlunoTelefone] = useState("");
const [alunoTurma, setAlunoTurma] = useState("");
const [alunoEmail, setAlunoEmail] = useState("");
const [alunoSenha, setAlunoSenha] = useState("");
const [error, setError] = useState<string | null>(null);

const handleCadastrarAluno = async (p0: string) => {
  try {
    const res = await fetch("https://sage-1zk3.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: alunoNome,
        email: alunoEmail,
        password: alunoSenha,
        role: "aluno",
        nascimento: alunoNascimento,
        cpf: alunoCPF,
        responsavel: alunoResponsavel,
        telefone: alunoTelefone,
        turma: alunoTurma,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao cadastrar aluno");
      return;
    }

    const novoAluno = await res.json();

    // Atualiza o state de alunos imediatamente
    setAlunos((prev) => [...prev, novoAluno]);

    toast({
      title: "Cadastro Realizado",
      description: `Aluno ${alunoNome} cadastrado com sucesso.`,
    });

    // Limpar campos
    setAlunoNome("");
    setAlunoNascimento("");
    setAlunoCPF("");
    setAlunoResponsavel("");
    setAlunoTelefone("");
    setAlunoTurma("");
    setAlunoEmail("");
    setAlunoSenha("");
    setError(null);
  } catch (err) {
    setError("Erro ao conectar com o servidor");
  }
};

// States do formulário
const [profNome, setProfNome] = useState("");
const [profNascimento, setProfNascimento] = useState("");
const [profCPF, setProfCPF] = useState("");
const [profFormacao, setProfFormacao] = useState("");
const [profDisciplina, setProfDisciplina] = useState("");
const [profCarga, setProfCarga] = useState("20 horas");
const [profEmail, setProfEmail] = useState("");
const [profSenha, setProfSenha] = useState("");


  const handleCadastrarProfessor = async (p0: string) => {
    try {
      const res = await fetch("https://sage-1zk3.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profNome,
          cpf: profCPF,
          dataNascimento: profNascimento,
          formacao: profFormacao,
          disciplina: profDisciplina,
          cargaHoraria: profCarga,
          email: profEmail,
          password: profSenha,
          role: "professor",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Erro ao cadastrar", description: err.error || "Erro desconhecido" });
        return;
      }

      const novoProfessor = await res.json();

      // Atualiza o state de professores imediatamente
      setProfessores((prev) => [...prev, novoProfessor]);

      toast({
        title: "Sucesso",
        description: "Professor cadastrado com sucesso!",
      });

      // Limpar formulário
      setProfNome("");
      setProfNascimento("");
      setProfCPF("");
      setProfFormacao("");
      setProfDisciplina("");
      setProfCarga("20 horas");
      setProfEmail("");
      setProfSenha("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha na comunicação com o servidor",
      });
    }
  };

  //EDIÇÃO

  const [editingAluno, setEditingAluno] = useState<any | null>(null);
  const [editingProfessor, setEditingProfessor] = useState<any | null>(null);

    const handleEditarAluno = (aluno: any) => {
    setEditingAluno(aluno); 
  };

  const handleEditarProfessor = (prof: any) => {
    setEditingProfessor(prof);
  };
  

const handleSalvarEdicaoAluno = async () => {
  if (!editingAluno) return;

  const res = await fetch(`https://sage-1zk3.onrender.com/users/${editingAluno.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editingAluno),
  });

  if (!res.ok) {
    const data = await res.json();
    toast({ title: "Erro", description: data.error || "Erro ao editar aluno" });
    return;
  }

  const updatedAluno = await res.json();
  setAlunos(prev =>
    prev.map(a => (a.id === updatedAluno.id ? updatedAluno : a))
  );
  setEditingAluno(null);
  toast({ title: "Sucesso", description: "Aluno atualizado!" });
};

const handleSalvarEdicaoProfessor = async () => {
  if (!editingProfessor) return;

  const res = await fetch(`https://sage-1zk3.onrender.com/users/${editingProfessor.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editingProfessor),
  });

  if (!res.ok) {
    const data = await res.json();
    toast({ title: "Erro", description: data.error || "Erro ao editar professor" });
    return;
  }

  const updatedProf = await res.json();
  setProfessores(prev =>
    prev.map(p => (p.id === updatedProf.id ? updatedProf : p))
  );
  setEditingProfessor(null);
  toast({ title: "Sucesso", description: "Professor atualizado!" });
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
          <div className="text-4xl font-bold text-primary">{alunos.length}</div>
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
          <div className="text-4xl font-bold text-accent">{professores.length}</div>
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
                  <Input value={alunoNome} onChange={(e) => setAlunoNome(e.target.value)} placeholder="Digite o nome do aluno" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Nascimento</label>
                    <Input value={alunoNascimento} onChange={(e) => setAlunoNascimento(e.target.value)}  type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF</label>
                    <Input value={alunoCPF} onChange={(e) => setAlunoCPF(e.target.value)}  placeholder="000.000.000-00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsável</label>
                  <Input value={alunoResponsavel} onChange={(e) => setAlunoResponsavel(e.target.value)}  placeholder="Nome do responsável" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input value={alunoTelefone} onChange={(e) => setAlunoTelefone(e.target.value)}  placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="Digite o email do aluno"
                    value={alunoEmail}
                    onChange={(e) => setAlunoEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <Input
                    type="password"
                    placeholder="Digite a senha do aluno"
                    value={alunoSenha}
                    onChange={(e) => setAlunoSenha(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Turma</label>
                  <select value={alunoTurma} onChange={(e) => setAlunoTurma(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-input bg-background">
                    <option>Selecione uma turma</option>
                    <option>1º Ano A</option>
                    <option>2º Ano A</option>
                    <option>3º Ano A</option>
                  </select>
                </div>
                <Button onClick={() => handleCadastrarAluno("Aluno")} className="w-full">
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
                  <Input value={profNome} onChange={(e) => setProfNome(e.target.value)} placeholder="Digite o nome do professor" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Nascimento</label>
                    <Input value={profNascimento} onChange={(e) => setProfNascimento(e.target.value)} type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF</label>
                    <Input value={profCPF} onChange={(e) => setProfCPF(e.target.value)} placeholder="000.000.000-00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Formação</label>
                  <Input value={profFormacao} onChange={(e) => setProfFormacao(e.target.value)} placeholder="Ex: Licenciatura em Matemática" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Disciplina</label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background" value={profDisciplina} onChange={(e) => setProfDisciplina(e.target.value)}>
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
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background" value={profCarga} onChange={(e) => setProfCarga(e.target.value)}>
                    <option>20 horas</option>
                    <option>40 horas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={profEmail} onChange={(e) => setProfEmail(e.target.value)} type="email"
                    placeholder="Digite o email do professor"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <Input
                    type="password"
                    placeholder="Digite a senha do professor"
                    value={profSenha}
                    onChange={(e) => setProfSenha(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleCadastrarProfessor("Professor")} className="w-full">
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
              <CardContent>
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
                          <td className="py-3 px-4">{aluno.id}</td>
                          <td className="py-3 px-4 font-medium">{aluno.name}</td>
                          <td className="py-3 px-4">{aluno.turma}</td>
                          <td className="text-center py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {aluno.status}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Button
                              onClick={() => handleEditarAluno(aluno)}
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

            {/* Formulário de edição de Aluno */}
            {editingAluno && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Editar Aluno: {editingAluno.name}</CardTitle>
                  <CardDescription>Atualize os dados do aluno</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    value={editingAluno.name}
                    onChange={(e) =>
                      setEditingAluno({ ...editingAluno, name: e.target.value })
                    }
                    placeholder="Nome do aluno"
                  />
                  <Input
                    value={editingAluno.email}
                    onChange={(e) =>
                      setEditingAluno({ ...editingAluno, email: e.target.value })
                    }
                    placeholder="Email"
                  />
                  <Input
                    value={editingAluno.nascimento}
                    onChange={(e) =>
                      setEditingAluno({ ...editingAluno, nascimento: e.target.value })
                    }
                    type="date"
                    placeholder="Data de nascimento"
                  />
                  <Input
                    value={editingAluno.cpf}
                    onChange={(e) =>
                      setEditingAluno({ ...editingAluno, cpf: e.target.value })
                    }
                    placeholder="CPF"
                  />
                  <Input
                    value={editingAluno.responsavel}
                    onChange={(e) =>
                      setEditingAluno({ ...editingAluno, responsavel: e.target.value })
                    }
                    placeholder="Responsável"
                  />
                  <Input
                    value={editingAluno.telefone}
                    onChange={(e) =>
                      setEditingAluno({ ...editingAluno, telefone: e.target.value })
                    }
                    placeholder="Telefone"
                  />
                  <select
                    value={editingAluno.turma}
                    onChange={(e) =>
                      setEditingAluno({ ...editingAluno, turma: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    <option value="">Selecione uma turma</option>
                    <option>1º Ano A</option>
                    <option>2º Ano A</option>
                    <option>3º Ano A</option>
                  </select>

                  <div className="flex gap-2">
                    <Button onClick={handleSalvarEdicaoAluno} className="flex-1">
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingAluno(null)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Gerenciar Professores
                </CardTitle>
                <CardDescription>Busque e edite informações dos professores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          <td className="py-3 px-4 font-medium">{prof.name}</td>
                          <td className="py-3 px-4">{prof.cpf}</td>
                          <td className="py-3 px-4">{prof.disciplina}</td>
                          <td className="text-center py-3 px-4">
                            <Button
                              onClick={() => handleEditarProfessor(prof)}
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

            {/* Formulário de edição de Professor */}
            {editingProfessor && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Editar Professor: {editingProfessor.name}</CardTitle>
                  <CardDescription>Atualize os dados do professor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    value={editingProfessor.name}
                    onChange={(e) =>
                      setEditingProfessor({ ...editingProfessor, name: e.target.value })
                    }
                    placeholder="Nome do professor"
                  />
                  <Input
                    value={editingProfessor.email}
                    onChange={(e) =>
                      setEditingProfessor({ ...editingProfessor, email: e.target.value })
                    }
                    placeholder="Email"
                  />
                  <Input
                    value={editingProfessor.dataNascimento}
                    onChange={(e) =>
                      setEditingProfessor({
                        ...editingProfessor,
                        dataNascimento: e.target.value,
                      })
                    }
                    type="date"
                    placeholder="Data de nascimento"
                  />
                  <Input
                    value={editingProfessor.cpf}
                    onChange={(e) =>
                      setEditingProfessor({ ...editingProfessor, cpf: e.target.value })
                    }
                    placeholder="CPF"
                  />
                  <Input
                    value={editingProfessor.formacao}
                    onChange={(e) =>
                      setEditingProfessor({ ...editingProfessor, formacao: e.target.value })
                    }
                    placeholder="Formação"
                  />
                  <Input
                    value={editingProfessor.disciplina}
                    onChange={(e) =>
                      setEditingProfessor({
                        ...editingProfessor,
                        disciplina: e.target.value,
                      })
                    }
                    placeholder="Disciplina"
                  />
                  <select
                    value={editingProfessor.cargaHoraria}
                    onChange={(e) =>
                      setEditingProfessor({
                        ...editingProfessor,
                        cargaHoraria: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    <option>20 horas</option>
                    <option>40 horas</option>
                  </select>

                  <div className="flex gap-2">
                    <Button onClick={handleSalvarEdicaoProfessor} className="flex-1">
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingProfessor(null)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

      </Tabs>
    </Layout>
  );
};

export default Secretaria;
