"use client";

import { useState, useEffect } from "react";
import {
  TrashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type Tarefa = {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: "Alta" | "Normal" | "Baixa";
  prazo: string;
  coluna: "Backlog" | "Em Andamento" | "Concluído";
  tempoInicio?: number; // Tempo de início (timestamp)
  tempoFim?: number; // Tempo de conclusão (timestamp)
};

export default function Home() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState<
    Omit<Tarefa, "id" | "coluna" | "tempoInicio" | "tempoFim">
  >({
    titulo: "",
    descricao: "",
    prioridade: "Normal",
    prazo: "",
  });

  // Carregar tarefas do LocalStorage
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (tarefasSalvas) setTarefas(JSON.parse(tarefasSalvas));
  }, []);

  // Salvar tarefas no LocalStorage
  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (!novaTarefa.titulo) return;
    setTarefas([
      ...tarefas,
      { id: Date.now(), ...novaTarefa, coluna: "Backlog" },
    ]);
    setNovaTarefa({
      titulo: "",
      descricao: "",
      prioridade: "Normal",
      prazo: "",
    });
  };

  const moverTarefa = (
    id: number,
    novaColuna: "Backlog" | "Em Andamento" | "Concluído"
  ) => {
    setTarefas((prevTarefas) =>
      prevTarefas.map((tarefa) =>
        tarefa.id === id
          ? {
              ...tarefa,
              coluna: novaColuna,
              tempoInicio:
                novaColuna === "Em Andamento" ? Date.now() : tarefa.tempoInicio,
              tempoFim:
                novaColuna === "Concluído" ? Date.now() : tarefa.tempoFim,
            }
          : tarefa
      )
    );
  };

  const deletarTarefa = (id: number) => {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  const calcularTempo = (tempoInicio?: number, tempoFim?: number) => {
    if (!tempoInicio || !tempoFim) return "N/A";
    const segundos = Math.floor((tempoFim - tempoInicio) / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    return `${horas}h ${minutos % 60}m ${segundos % 60}s`;
  };

  const compartilharDados = () => {
    const texto = tarefas
      .map(
        (tarefa) =>
          `Título: ${tarefa.titulo}\nDescrição: ${tarefa.descricao}\nPrazo: ${
            tarefa.prazo
          }\nConcluída: ${
            tarefa.coluna === "Concluído" ? "Sim" : "Não"
          }\nTempo Gasto: ${
            tarefa.coluna === "Concluído"
              ? calcularTempo(tarefa.tempoInicio, tarefa.tempoFim)
              : "N/A"
          }\n`
      )
      .join("\n");

    const url = `mailto:?subject=Tarefas Diárias&body=${encodeURIComponent(
      texto
    )}`;
    window.open(url, "_blank");
  };

  const compartilharWhatsApp = () => {
    const texto = tarefas
      .map(
        (tarefa) =>
          `Título: ${tarefa.titulo}\nDescrição: ${tarefa.descricao}\nPrazo: ${
            tarefa.prazo
          }\nConcluída: ${
            tarefa.coluna === "Concluído" ? "Sim" : "Não"
          }\nTempo Gasto: ${
            tarefa.coluna === "Concluído"
              ? calcularTempo(tarefa.tempoInicio, tarefa.tempoFim)
              : "N/A"
          }\n`
      )
      .join("\n");

    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  const baixarJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(tarefas, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = "tarefas.json";
    downloadAnchor.click();
  };

  const baixarMarkdown = () => {
    const texto = tarefas
      .map(
        (tarefa) =>
          `### Título: ${tarefa.titulo}\n- **Descrição**: ${
            tarefa.descricao
          }\n- **Prazo**: ${tarefa.prazo}\n- **Concluída**: ${
            tarefa.coluna === "Concluído" ? "Sim" : "Não"
          }\n- **Tempo Gasto**: ${
            tarefa.coluna === "Concluído"
              ? calcularTempo(tarefa.tempoInicio, tarefa.tempoFim)
              : "N/A"
          }\n`
      )
      .join("\n");

    const dataStr =
      "data:text/markdown;charset=utf-8," + encodeURIComponent(texto);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = "tarefas_para_jira.md";
    downloadAnchor.click();
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-6">
      {/* Cabeçalho */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900">DailyFocus</h1>
        <p className="text-lg text-gray-600">
          Organize suas tarefas com eficiência
        </p>
      </header>

      {/* Adicionar Tarefa */}
      <section className="w-full max-w-xl bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Adicionar Tarefa</h2>
        <input
          type="text"
          placeholder="Título"
          value={novaTarefa.titulo}
          onChange={(e) =>
            setNovaTarefa({ ...novaTarefa, titulo: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg mb-3"
        />
        <textarea
          placeholder="Descrição"
          value={novaTarefa.descricao}
          onChange={(e) =>
            setNovaTarefa({ ...novaTarefa, descricao: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg mb-3"
        />
        <select
          value={novaTarefa.prioridade}
          onChange={(e) =>
            setNovaTarefa({
              ...novaTarefa,
              prioridade: e.target.value as Tarefa["prioridade"],
            })
          }
          className="w-full p-3 border border-gray-300 rounded-lg mb-3"
        >
          <option>Alta</option>
          <option>Normal</option>
          <option>Baixa</option>
        </select>
        <input
          type="date"
          value={novaTarefa.prazo}
          onChange={(e) =>
            setNovaTarefa({ ...novaTarefa, prazo: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg mb-3"
        />
        <button
          onClick={adicionarTarefa}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Adicionar
        </button>
      </section>

      {/* Tarefas */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Backlog */}
        <div>
          <h3 className="text-xl font-bold mb-4">Backlog</h3>
          {tarefas
            .filter((t) => t.coluna === "Backlog")
            .map((tarefa) => (
              <motion.div
                key={tarefa.id}
                className="p-4 bg-gray-100 rounded-lg shadow mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-bold">{tarefa.titulo}</h4>
                <p className="text-sm text-gray-600">{tarefa.descricao}</p>
                <p className="text-sm text-gray-500">Prazo: {tarefa.prazo}</p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => moverTarefa(tarefa.id, "Em Andamento")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deletarTarefa(tarefa.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Em andamento */}
        <div>
          <h3 className="text-xl font-bold mb-4">Em Andamento</h3>
          {tarefas
            .filter((t) => t.coluna === "Em Andamento")
            .map((tarefa) => (
              <motion.div
                key={tarefa.id}
                className="p-4 bg-yellow-100 rounded-lg shadow mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-bold">{tarefa.titulo}</h4>
                <p className="text-sm text-gray-600">{tarefa.descricao}</p>
                <p className="text-sm text-gray-500">Prazo: {tarefa.prazo}</p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => moverTarefa(tarefa.id, "Backlog")}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => moverTarefa(tarefa.id, "Concluído")}
                    className="text-green-600 hover:text-green-800"
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Concluídas */}
        <div>
          <h3 className="text-xl font-bold mb-4">Concluídas</h3>
          {tarefas
            .filter((t) => t.coluna === "Concluído")
            .map((tarefa) => (
              <motion.div
                key={tarefa.id}
                className="p-4 bg-green-100 rounded-lg shadow mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-bold">{tarefa.titulo}</h4>
                <p className="text-sm text-gray-600">{tarefa.descricao}</p>
                <p className="text-sm text-gray-500">Prazo: {tarefa.prazo}</p>
                <p className="text-sm text-gray-500">
                  Tempo Gasto:{" "}
                  {calcularTempo(tarefa.tempoInicio, tarefa.tempoFim)}
                </p>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        <div className="flex gap-4 justify-center">
          <button
            onClick={compartilharDados}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ShareIcon className="h-5 w-5" /> Compartilhar por E-mail
          </button>
          <button
            onClick={compartilharWhatsApp}
            className="flex items-center gap-2 text-green-600 hover:underline"
          >
            <ShareIcon className="h-5 w-5" /> Compartilhar no WhatsApp
          </button>
          <button
            onClick={baixarJSON}
            className="flex items-center gap-2 text-gray-600 hover:underline"
          >
            <ShareIcon className="h-5 w-5" /> Baixar JSON
          </button>
          <button
            onClick={baixarMarkdown}
            className="flex items-center gap-2 text-yellow-600 hover:underline"
          >
            <ShareIcon className="h-5 w-5" /> Exportar para Jira
          </button>
        </div>
      </footer>
    </main>
  );
}
