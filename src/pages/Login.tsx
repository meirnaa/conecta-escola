import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, UserCog, FileText } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<string>("");

  const profiles = [
    {
      id: "aluno",
      title: "Aluno",
      description: "Acesse seu boletim e agenda",
      icon: GraduationCap,
      path: "/aluno",
    },
    {
      id: "professor",
      title: "Professor",
      description: "Registre notas e aulas",
      icon: BookOpen,
      path: "/professor",
    },
    {
      id: "diretor",
      title: "Diretor",
      description: "Acompanhe professores e alunos",
      icon: UserCog,
      path: "/diretor",
    },
    {
      id: "secretaria",
      title: "Secretaria",
      description: "Gerencie cadastros",
      icon: FileText,
      path: "/secretaria",
    },
  ];

  const handleLogin = () => {
    if (selectedProfile) {
      const profile = profiles.find((p) => p.id === selectedProfile);
      if (profile) {
        navigate(profile.path);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-4 rounded-2xl">
              <BookOpen className="w-12 h-12" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">SAE</CardTitle>
          <CardDescription className="text-lg">
            Sistema de Administração Escolar
          </CardDescription>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Modernizando a gestão escolar com praticidade e segurança
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                    selectedProfile === profile.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedProfile === profile.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{profile.title}</h3>
                      <p className="text-sm text-muted-foreground">{profile.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            onClick={handleLogin}
            disabled={!selectedProfile}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            Entrar no Sistema
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
