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
  const [bimestreSelecionado, setBimestreSelecionado] = useState<number | null>(0);

  const [novaAula, setNovaAula] = useState("");
  const [dataAula, setDataAula] = useState("");
  const [frequencia, setFrequencia] = useState<number[]>([]);

  const [novoAviso, setNovoAviso] = useState("");
  const [tituloAviso, setTituloAviso] = useState("");
  const [turmaAviso, setTurmaAviso] = useState("");

  const [aulas, setAulas] = useState<Aula[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  const [notasTemp, setNotasTemp] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const res = await fetch("https://sage-1zk3.onrender.com/users?role=aluno");
        const data = await res.json();

        const listaUsuarios = Array.isArray(data)
          ? data
          : Array.isArray(data.users)
          ? data.users
          : [];

        setUsers(listaUsuarios);
      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
        setUsers([]);
      }
    };

    fetchAlunos();
  }, []);


  useEffect(() => {
    const lista = Array.isArray(users) ? users : [];
    setAlunosFiltrados(lista.filter(u => u.role === "aluno" && u.turma === turmaSelecionada));
    setFrequencia([]);
  }, [turmaSelecionada, users]);


  useEffect(() => {
    const fetchAvisos = async () => {
      try {
        const res = await fetch("https://sage-1zk3.onrender.com/avisos");
        const data: Aviso[] = await res.json();
        setAvisos(data);
      } catch (err) {
        console.error("Erro ao buscar avisos:", err);
      }
    };
    fetchAvisos();
  }, []);

  const listaUsuarios = Array.isArray(users) ? users : [];

  const turmas = Array.from(
    new Set(listaUsuarios.filter(u => u.role === "aluno").map(a => a.turma || ""))
  );

  const totalAlunos = listaUsuarios.filter(u => u.role === "aluno").length;

  const turmasAtivas = turmas.length;
  const totalAvisos = avisos.length;

  const handleChangeNota = (alunoId: number, value: string) => {
    setNotasTemp(prev => ({ ...prev, [alunoId]: value }));
  };

  const handleLancarNotas = async () => {
    if (!turmaSelecionada || !disciplinaSelecionada || bimestreSelecionado === null) {
      toast({ title: "Erro", description: "Selecione turma, disciplina e bimestre" });
      return;
    }

    const alunosSemNota = alunosFiltrados.filter(a => !notasTemp[a.id] || notasTemp[a.id] === "");
    if (alunosSemNota.length > 0) {
      toast({ title: "Erro", description: "Preencha todas as notas antes de enviar" });
      return;
    }

    try {
      const atualizados = [...users];

      for (const aluno of alunosFiltrados) {
        const nota = parseFloat(notasTemp[aluno.id]);
        if (!aluno.notas) aluno.notas = {};
        if (!aluno.notas[disciplinaSelecionada]) aluno.notas[disciplinaSelecionada] = [];
        aluno.notas[disciplinaSelecionada][bimestreSelecionado] = nota;

        await fetch(`https://sage-1zk3.onrender.com/users/${aluno.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aluno),
        });
      }

      setUsers(atualizados);
      setNotasTemp({});
      toast({ title: "Notas lançadas", description: `Notas da turma ${turmaSelecionada} registradas com sucesso` });
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao registrar notas" });
    }
  };

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
      const res = await fetch("https://sage-1zk3.onrender.com/aulas", {
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
      const res = await fetch("https://sage-1zk3.onrender.com/avisos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aviso),
      });

      if (!res.ok) throw new Error("Erro ao salvar aviso");

      const savedAviso = await res.json();
      setAvisos(prev => [...prev, savedAviso]);
      setNovoAviso("");
      setTituloAviso("");
      setTurmaAviso("");
      toast({ title: "Aviso enviado", description: `Turma ${aviso.turma}` });
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao enviar aviso" });
      console.error(err);
    }
  };

  const toggleFrequencia = (id: number) => {
    setFrequencia(prev =>
      prev.includes(id)
        ? prev.filter(alunoId => alunoId !== id)
        : [...prev, id]
    );
  };

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

        {/* Notas */}
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
                  value={bimestreSelecionado ?? 0}
                  onChange={e => setBimestreSelecionado(parseInt(e.target.value))}
                >
                  {bimestres.map((b, i) => <option key={i} value={i}>{b}</option>)}
                </select>
              </div>

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
                            value={notasTemp[aluno.id] ?? aluno.notas?.[disciplinaSelecionada]?.[bimestreSelecionado] ?? ""}
                            onChange={e => handleChangeNota(aluno.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleLancarNotas}
                >
                  Lançar Notas
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aulas */}
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

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Frequência da Turma</CardTitle>
                  <CardDescription>Marque a presença dos alunos da turma selecionada</CardDescription>
                </CardHeader>
                <CardContent>
                  {turmaSelecionada ? (
                    <>
                      <div className="flex justify-end mb-2">
                        <button
                          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                          onClick={() => {
                            if (frequencia.length === alunosFiltrados.length) {
                              // desmarca todos
                              setFrequencia([]);
                            } else {
                              // marca todos
                              setFrequencia(alunosFiltrados.map(a => a.id));
                            }
                          }}
                        >
                          {frequencia.length === alunosFiltrados.length ? "Deselecionar Todos" : "Selecionar Todos"}
                        </button>
                      </div>

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
                    </>
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

        {/* Avisos */}
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
