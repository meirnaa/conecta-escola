# Sistema de Gestão Escolar

## 1. Introdução

Este trabalho apresenta o desenvolvimento do SAGE - **Sistema de Gestão Escolar**, criado com o objetivo de informatizar e otimizar os processos acadêmicos e administrativos de uma instituição de ensino.

O SAGE foi projetado para atender diferentes perfis de usuários — **Professor, Aluno, Secretaria e Diretor** — cada um com permissões específicas, garantindo organização, segurança e eficiência no gerenciamento das informações escolares.

Nosso site está hospedado aqui: https://conecta-escola-zeta.vercel.app/
---

## 2. Objetivos

### 2.1 Objetivo Geral

Desenvolver um sistema web capaz de gerenciar atividades acadêmicas e administrativas de uma escola, promovendo maior controle, transparência e acessibilidade às informações.

### 2.2 Objetivos Específicos
* Facilitar o lançamento e acompanhamento de **notas e frequência**;
* Permitir o gerenciamento de **matrículas, turmas e disciplinas**;
* Disponibilizar aos alunos o acesso ao **boletim e atividades**;
* Gerar **relatórios gerenciais** para a direção;
* Aplicar controle de acesso conforme o perfil do usuário.

---

## 3. Tecnologias Utilizadas
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- NodeJS e Express
- Lovable
- Firebase Firestore

---

## 4. Perfis de Usuários e Funcionalidades

### 4.1 Professor

 perfil de professor é responsável pelo acompanhamento pedagógico das turmas.

Funcionalidades:

* Lançamento e edição de **notas**;
* Registro de **aulas ministradas**;
* Controle de **frequência**;
* Publicação de **avisos**;
* Criação e gerenciamento de **tarefas e atividades**.

---

### 4.2 Aluno

O aluno possui acesso às informações acadêmicas individuais.

Funcionalidades:

* Visualização do **boletim escolar**;
* Acompanhamento da **frequência**;
* Visualização de **avisos e atividades**;

---

### 4.3 Secretaria

A secretaria é responsável pela gestão administrativa e acadêmica.

Funcionalidades:

* **Matrícula de alunos**;
* Cadastro de **professores**;
* **Alocação de professores** às disciplinas e turmas.

---

### 4.4 Diretor

O diretor possui acesso amplo ao sistema, com foco em gestão e tomada de decisão.

Funcionalidades:

* Visualização de **relatórios acadêmicos e administrativos**;
* Acompanhamento geral do desempenho institucional.
---

## 5. Execução do Projeto

### 5.1 Requisitos

* Node.js instalado
* Gerenciador de pacotes (npm ou yarn)

### 5.2 Passos para Execução

- Clonar o repositório:
git clone https://github.com/meirnaa/conecta-escola.git

- Acessar a pasta do projeto:
cd conecta-escola

- Executar o projeto:
npm run dev

- Acessar a pasta do backend do projeto:
cd conecta-escola/

- Executar o projeto:
node server.js

- Para testes, utilizar os seguintes perfis:
    "email": "maria@gmail.com",
    "password": "12312312",
    "role": "secretaria"

    "email": "fred@gmail.com",
    "password": "12312312",
    "role": "diretor"

    "email": "pedrohenrique@sousa",
    "password": "12312312",
    "role": "aluno"

    "email": "santana@laura",
    "password": "12312312",
    "role": "professor"

O sistema implementa **autenticação e autorização por perfil**, garantindo que cada usuário tenha acesso apenas às funcionalidades correspondentes ao seu papel dentro da instituição.

A aplicação estará disponível em:
http://localhost:3000


---

## 6. Considerações Finais

O SAGE atende aos objetivos propostos, oferecendo uma solução funcional e organizada para o controle acadêmico e administrativo.

---

## 7. Slide e Documento de Visão
https://www.canva.com/design/DAG3yAJhLCs/fpPcF4ijUxUXwAMxX-idpg/edit?utm_content=DAG3yAJhLCs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

https://docs.google.com/document/d/1MuozxsMA1AD6Cw5MufXfFkup8Oq-jtMN/edit?usp=sharing&ouid=103506852068100565558&rtpof=true&sd=true

## 8. Componentes
- Lina Gabrielly
- Teresa
- Meir Naã
- Luana
