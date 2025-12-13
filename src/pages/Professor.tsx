import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, BookOpen, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bimestres = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];
const disciplinas = ["Matemática", "Português", "História", "Geografia", "Ciências", "Física"];

interface Usuario {
  id: number;
  role: "aluno" | "professor" | "diretor" | "secretaria";
  name: string;
  turma?: string;
  notas?: Record<string, number[]>;
}

interface Aula {
  id: number;
  turma: string;
  data: string;
  conteudo: string;
  frequencia: number[];
}

interface Aviso {
  id: number;
  turma: string;
  titulo: string;
  mensagem: string;
  data: string;
}

const Professor = () => {
  const { toast } = useToast();

  const [users, setUsers] = useState<Usuario[]>([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState<Usuario[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [bimestreSelecionado, setBimestreSelecionado] = useState(0);

  const [novaAula, setNovaAula] = useState("");
  const [dataAula, setDataAula] = useState("");
  const [frequencia, setFrequencia] = useState<number[]>([]);

  const [novoAviso, setNovoAviso] = useState("");
  const [tituloAviso, setTituloAviso] = useState("");
  const [turmaAviso, setTurmaAviso] = useState("");

  const [aulas, setAulas] = useState<Aula[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  // Buscar alunos do backend
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const res = await fetch("http://localhost:3333/users");
        const data: Usuario[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
      }
    };
    fetchAlunos();
  }, []);

  // Atualiza alunos filtrados por turma
  useEffect(() => {
    setAlunosFiltrados(users.filter(u => u.role === "aluno" && u.turma === turmaSelecionada));
    setFrequencia([]); // resetar frequência ao trocar de turma
  }, [turmaSelecionada, users]);

  useEffect(() => {
    const fetchAvisos = async () => {
      try {
        const res = await fetch("http://localhost:3333/avisos");
        const data: Aviso[] = await res.json();
        setAvisos(data); // inicializa com os avisos existentes
      } catch (err) {
        console.error("Erro ao buscar avisos:", err);
      }
    };
    fetchAvisos();
  }, []);
  

  const turmas = Array.from(new Set(users.filter(u => u.role === "aluno").map(a => a.turma || "")));

  // Cards do topo
  const totalAlunos = users.filter(u => u.role === "aluno").length;
  const turmasAtivas = turmas.length;
  const totalAvisos = avisos.length;

  // Lançar nota e salvar no backend
  const handleLancarNota = async (alunoId: number, nota: string) => {
    const aluno = users.find(a => a.id === alunoId);
    if (!aluno) return;

    if (!aluno.notas) aluno.notas = {};
    if (!aluno.notas[disciplinaSelecionada]) aluno.notas[disciplinaSelecionada] = [];
    aluno.notas[disciplinaSelecionada][bimestreSelecionado] = parseFloat(nota);

    try {
      const res = await fetch(`http://localhost:3333/users/${aluno.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno),
      });

      if (!res.ok) throw new Error("Erro ao atualizar nota");

      setUsers([...users]);
      toast({ title: "Nota registrada", description: `${aluno.name} - ${disciplinaSelecionada}` });
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao salvar a nota" });
    }
  };

  // Registrar aula
  const handleRegistrarAula = async () => {
    if (!turmaSelecionada || !dataAula || !novaAula) {
      toast({ title: "Erro", description: "Preencha todos os campos da aula" });
      return;
    }

    const aula: Aula = {
      id: Date.now(),
      turma: turmaSelecionada,
      data: dataAula,
      conteudo: novaAula,
      frequencia,
    };

    try {
      const res = await fetch("http://localhost:3333/aulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aula),
      });

      if (!res.ok) throw new Error("Erro ao salvar aula");

      const savedAula = await res.json();
      setAulas(prev => [...prev, savedAula]);
      setNovaAula("");
      setDataAula("");
      setFrequencia([]);
      toast({ title: "Aula registrada", description: `Turma ${turmaSelecionada}` });
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao registrar aula" });
    }
  };

  // Enviar aviso
  const handleEnviarAviso = async () => {
    if (!tituloAviso || !novoAviso || !turmaAviso) {
      toast({ title: "Erro", description: "Preencha todos os campos do aviso" });
      return;
    }
  
    const aviso: Aviso = {
      id: Date.now(),
      turma: turmaAviso,
      titulo: tituloAviso,
      mensagem: novoAviso,
      data: new Date().toISOString(),
    };
  
    try {
      const res = await fetch("http://localhost:3333/avisos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aviso),
      });
  
      if (!res.ok) throw new Error("Erro ao salvar aviso");
  
      const savedAviso = await res.json();
      setAvisos(prev => [...prev, savedAviso]); // adiciona o aviso salvo
      setNovoAviso("");
      setTituloAviso("");
      setTurmaAviso("");
      toast({ title: "Aviso enviado", description: `Turma ${aviso.turma}` });
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao enviar aviso" });
      console.error(err);
    }
  };
  

  function toggleFrequencia(id: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Layout title="Painel do Professor" userType="Professor">
      {/* Cards do topo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Turmas Ativas</CardTitle>
          </CardHeader>
          <CardContent>{turmasAtivas}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>{totalAlunos}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avisos Enviados</CardTitle>
          </CardHeader>
          <CardContent>{totalAvisos}</CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="notas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notas">Lançar Notas</TabsTrigger>
          <TabsTrigger value="aulas">Registrar Aulas</TabsTrigger>
          <TabsTrigger value="avisos">Enviar Avisos</TabsTrigger>
        </TabsList>

        {/* Lançamento de Notas */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                >
                  <option value="">Selecione turma</option>
                  {turmas.map(t => <option key={t}>{t}</option>)}
                </select>

                <select
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                  value={disciplinaSelecionada}
                  onChange={e => setDisciplinaSelecionada(e.target.value)}
                >
                  <option value="">Selecione disciplina</option>
                  {disciplinas.map(d => <option key={d}>{d}</option>)}
                </select>

                <select
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                  value={bimestreSelecionado}
                  onChange={e => setBimestreSelecionado(parseInt(e.target.value))}
                >
                  {bimestres.map((b, i) => <option key={i} value={i}>{b}</option>)}
                </select>
              </div>

              {/* Tabela de Notas */}
              <div className="border border-border rounded-lg overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold">Matrícula</th>
                      <th className="text-center py-3 px-4 font-semibold">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...alunosFiltrados].sort((a, b) => a.name.localeCompare(b.name)).map(aluno => (
                      <tr key={aluno.id} className="border-b border-border">
                        <td className="py-3 px-4">{aluno.name}</td>
                        <td className="py-3 px-4">{aluno.id}</td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            step={0.1}
                            placeholder="0.0"
                            className="max-w-[100px] mx-auto text-center"
                            defaultValue={aluno.notas?.[disciplinaSelecionada]?.[bimestreSelecionado] || ""}
                            onBlur={e => handleLancarNota(aluno.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Registrar Aulas */}
        <TabsContent value="aulas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Registrar Aulas
              </CardTitle>
              <CardDescription>Registre aulas ministradas e controle frequência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                value={turmaSelecionada}
                onChange={e => setTurmaSelecionada(e.target.value)}
              >
                <option value="">Selecione turma</option>
                {turmas.map(t => <option key={t}>{t}</option>)}
              </select>

              <Input
                type="date"
                value={dataAula}
                onChange={e => setDataAula(e.target.value)}
              />

              <Textarea
                placeholder="Conteúdo ministrado"
                value={novaAula}
                onChange={e => setNovaAula(e.target.value)}
              />

              {/* Frequência*/}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Frequência da Turma</CardTitle>
                  <CardDescription>Marque a presença dos alunos da turma selecionada</CardDescription>
                </CardHeader>
                <CardContent>
                  {turmaSelecionada ? (
                    <div className="space-y-1 max-h-80 overflow-y-auto">
                      {[...alunosFiltrados].sort((a, b) => a.name.localeCompare(b.name)).map(aluno => (
                        <div key={aluno.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={frequencia.includes(aluno.id)}
                            onChange={() => toggleFrequencia(aluno.id)}
                          />
                          <span>{aluno.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Selecione uma turma para marcar presença</p>
                  )}
                  <div className="mt-2 font-medium">
                    Presentes: {frequencia.length} / {alunosFiltrados.length}
                  </div>
                </CardContent>
              </Card>


              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleRegistrarAula}
              >
                Registrar Aula
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enviar Avisos */}
        <TabsContent value="avisos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Enviar Avisos
              </CardTitle>
              <CardDescription>Envie avisos para turmas específicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                value={turmaAviso}
                onChange={e => setTurmaAviso(e.target.value)}
              >
                <option value="">Selecione turma</option>
                {turmas.map(t => <option key={t}>{t}</option>)}
              </select>

              <Input
                placeholder="Título do Aviso"
                value={tituloAviso}
                onChange={e => setTituloAviso(e.target.value)}
              />

              <Textarea
                placeholder="Mensagem do Aviso"
                value={novoAviso}
                onChange={e => setNovoAviso(e.target.value)}
              />

              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleEnviarAviso}
              >
                Enviar Aviso
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Professor;
