"use client";

import { useState, useEffect } from "react";
import {
  TrashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShareIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskTimer from "./component/TaskTimer";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: "Alta" | "Normal" | "Baixa";
  deadline: string;
  column: "Backlog" | "Em Andamento" | "Concluído";
  startTime?: number;
  endTime?: number;
  createdAt: number; // Creation date/time
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<
    Omit<Task, "id" | "column" | "startTime" | "endTime" | "createdAt">
  >({
    title: "",
    description: "",
    priority: "Normal",
    deadline: "",
  });
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);

  // Load tasks and terms acceptance from LocalStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const terms = localStorage.getItem("termsAccepted");
    setTermsAccepted(terms === "true");
  }, []);

  // Save tasks to LocalStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const acceptTerms = () => {
    localStorage.setItem("termsAccepted", "true");
    setTermsAccepted(true);
  };

  const addTask = () => {
    if (!newTask.title) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        ...newTask,
        column: "Backlog",
        createdAt: Date.now(), // Set creation date/time
      },
    ]);
    setNewTask({
      title: "",
      description: "",
      priority: "Normal",
      deadline: "",
    });
  };

  const moveTask = (
    id: number,
    newColumn: "Backlog" | "Em Andamento" | "Concluído"
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              column: newColumn,
              startTime:
                newColumn === "Em Andamento" && !task.startTime
                  ? Date.now()
                  : task.startTime,
              endTime: newColumn === "Concluído" ? Date.now() : task.endTime,
            }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const calculateTime = (startTime?: number, endTime?: number) => {
    if (!startTime) return "N/A";
    const end = endTime || Date.now();
    const seconds = Math.floor((end - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  const shareData = () => {
    const text = tasks
      .map(
        (task) =>
          `Título: ${task.title}\nDescrição: ${task.description}\nPrazo: ${
            task.deadline
          }\nConcluída: ${
            task.column === "Concluído" ? "Sim" : "Não"
          }\nTempo Gasto: ${
            task.column === "Concluído"
              ? calculateTime(task.startTime, task.endTime)
              : "N/A"
          }\n`
      )
      .join("\n");

    const url = `mailto:?subject=Tarefas Diárias&body=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank");
  };

  const shareWhatsApp = () => {
    const text = tasks
      .map(
        (task) =>
          `Título: ${task.title}\nDescrição: ${task.description}\nPrazo: ${
            task.deadline
          }\nConcluída: ${
            task.column === "Concluído" ? "Sim" : "Não"
          }\nTempo Gasto: ${
            task.column === "Concluído"
              ? calculateTime(task.startTime, task.endTime)
              : "N/A"
          }\n`
      )
      .join("\n");

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const downloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = "tarefas.json";
    downloadAnchor.click();
  };

  const downloadMarkdown = () => {
    const text = tasks
      .map(
        (task) =>
          `### Título: ${task.title}\n- **Descrição**: ${
            task.description
          }\n- **Prazo**: ${task.deadline}\n- **Concluída**: ${
            task.column === "Concluído" ? "Sim" : "Não"
          }\n- **Tempo Gasto**: ${
            task.column === "Concluído"
              ? calculateTime(task.startTime, task.endTime)
              : "N/A"
          }\n`
      )
      .join("\n");

    const dataStr =
      "data:text/markdown;charset=utf-8," + encodeURIComponent(text);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataStr;
    downloadAnchor.download = "tarefas_para_jira.md";
    downloadAnchor.click();
  };

  const clearHistory = () => {
    if (
      confirm(
        "Tem certeza de que deseja limpar todo o histórico? Esta ação não pode ser desfeita."
      )
    ) {
      setTasks([]);
      localStorage.removeItem("tasks");
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = Number(draggableId);
    const newColumn = destination.droppableId as Task["column"];

    moveTask(taskId, newColumn);
  };

  const TermsModal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white p-6 rounded-lg max-w-lg mx-4">
        <h2 id="modal-title" className="text-2xl font-bold mb-4 text-gray-900">
          Termos de Uso
        </h2>
        <p className="mb-4 text-gray-700">
          Este aplicativo armazena seus dados localmente no navegador
          (localStorage). Seus dados não são compartilhados com terceiros. É de
          sua responsabilidade gerenciar e proteger as informações inseridas.
        </p>
        <button
          onClick={acceptTerms}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Aceitar
        </button>
      </div>
    </div>
  );

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("pt-BR");
  };

  const isOverdue = (deadline: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate < now;
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100";
      case "Normal":
        return "bg-blue-100";
      case "Baixa":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  const TaskCard = ({ task, index }: { task: Task; index: number }) => {
    const [elapsedTime, setElapsedTime] = useState<string>("");

    useEffect(() => {
      const interval = setInterval(() => {
        setElapsedTime(calculateTime(task.startTime));
      }, 1000);
      return () => clearInterval(interval);
    }, [task.startTime]);

    return (
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            aria-labelledby={`task-title-${task.id}`}
          >
            <motion.div
              className={`p-4 rounded-lg shadow mb-4 ${
                isOverdue(task.deadline) ? "border border-red-500" : ""
              } ${getPriorityColor(task.priority)}`}
              whileHover={{ scale: 1.02 }}
            >
              <h4
                id={`task-title-${task.id}`}
                className="font-bold text-gray-900"
              >
                {task.title}
              </h4>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-700">
                Criado em: {formatDateTime(task.createdAt)}
              </p>
              <p className="text-sm text-gray-700">Prazo: {task.deadline}</p>
              {isOverdue(task.deadline) && (
                <p className="text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                  Atrasada
                </p>
              )}
              <p className="text-sm text-gray-700">
                Tempo Gasto: {elapsedTime}
              </p>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => moveTask(task.id, "Backlog")}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  aria-label="Mover para Backlog"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => moveTask(task.id, "Concluído")}
                  className="text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Mover para Concluídas"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </Draggable>
    );
  };

  // Prevent rendering until termsAccepted is known
  if (termsAccepted === null) {
    return null;
  }

  return (
    <main
      className="min-h-screen bg-gray-50 text-gray-800 flex flex-col p-6"
      aria-label="Página Principal"
    >
      {!termsAccepted && <TermsModal />}

      {/* Cabeçalho */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-900">DailyFocus</h1>
        <p className="text-lg text-gray-600">
          Organize suas tarefas com eficiência
        </p>
      </header>

      <div className="w-full max-w-7xl mx-auto">
        {/* Adicionar Tarefa */}
        <section
          aria-labelledby="add-task-section"
          className="w-full max-w-xl mx-auto bg-white shadow rounded-lg p-6 mb-6"
        >
          <h2
            id="add-task-section"
            className="text-2xl font-semibold mb-4 text-gray-900"
          >
            Adicionar Tarefa
          </h2>
          <div className="mb-3">
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700"
            >
              Título
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="Título"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-700"
            >
              Descrição
            </label>
            <textarea
              id="task-description"
              placeholder="Descrição"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="task-priority"
              className="block text-sm font-medium text-gray-700"
            >
              Prioridade
            </label>
            <select
              id="task-priority"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority: e.target.value as Task["priority"],
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Alta</option>
              <option>Normal</option>
              <option>Baixa</option>
            </select>
          </div>
          <div className="mb-3">
            <label
              htmlFor="task-deadline"
              className="block text-sm font-medium text-gray-700"
            >
              Prazo
            </label>
            <input
              id="task-deadline"
              type="date"
              value={newTask.deadline}
              onChange={(e) =>
                setNewTask({ ...newTask, deadline: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addTask}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Adicionar
          </button>
        </section>

        {/* Tarefas */}
        <DragDropContext onDragEnd={onDragEnd}>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Backlog */}
            <Droppable droppableId="Backlog">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h3
                    className="text-xl font-bold mb-4 text-center text-gray-900"
                    id="backlog-column"
                  >
                    Backlog
                  </h3>
                  {tasks
                    .filter((t) => t.column === "Backlog")
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            aria-labelledby={`task-title-${task.id}`}
                          >
                            <motion.div
                              className={`p-4 rounded-lg shadow mb-4 ${
                                isOverdue(task.deadline)
                                  ? "border border-red-500"
                                  : ""
                              } ${getPriorityColor(task.priority)}`}
                              whileHover={{ scale: 1.02 }}
                            >
                              <h4
                                id={`task-title-${task.id}`}
                                className="font-bold text-gray-900"
                              >
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {task.description}
                              </p>
                              <p className="text-sm text-gray-700">
                                Criado em: {formatDateTime(task.createdAt)}
                              </p>
                              <p className="text-sm text-gray-700">
                                Prazo: {task.deadline}
                              </p>
                              {isOverdue(task.deadline) && (
                                <p className="text-sm text-red-600 flex items-center">
                                  <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                                  Atrasada
                                </p>
                              )}
                              <div className="mt-4 flex gap-4">
                                <button
                                  onClick={() =>
                                    moveTask(task.id, "Em Andamento")
                                  }
                                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  aria-label="Mover para Em Andamento"
                                >
                                  <ArrowRightIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                                  aria-label="Excluir Tarefa"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {/* Em Andamento */}
            <Droppable droppableId="Em Andamento">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h3
                    className="text-xl font-bold mb-4 text-center text-gray-900"
                    id="in-progress-column"
                  >
                    Em Andamento
                  </h3>
                  {tasks
                    .filter((t) => t.column === "Em Andamento")
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            aria-labelledby={`task-title-${task.id}`}
                          >
                            <motion.div
                              className={`p-4 rounded-lg shadow mb-4 ${
                                isOverdue(task.deadline)
                                  ? "border border-red-500"
                                  : ""
                              } ${getPriorityColor(task.priority)}`}
                              whileHover={{ scale: 1.02 }}
                            >
                              <h4
                                id={`task-title-${task.id}`}
                                className="font-bold text-gray-900"
                              >
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {task.description}
                              </p>
                              <p className="text-sm text-gray-700">
                                Criado em: {formatDateTime(task.createdAt)}
                              </p>
                              <p className="text-sm text-gray-700">
                                Prazo: {task.deadline}
                              </p>
                              {isOverdue(task.deadline) && (
                                <p className="text-sm text-red-600 flex items-center">
                                  <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                                  Atrasada
                                </p>
                              )}
                              <p className="text-sm text-gray-700">
                                Tempo Gasto:{" "}
                                <TaskTimer startTime={task.startTime} />
                              </p>
                              <div className="mt-4 flex gap-4">
                                <button
                                  onClick={() => moveTask(task.id, "Backlog")}
                                  className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                  aria-label="Mover para Backlog"
                                >
                                  <ArrowLeftIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => moveTask(task.id, "Concluído")}
                                  className="text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  aria-label="Mover para Concluídas"
                                >
                                  <ArrowRightIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Concluídas */}
            <Droppable droppableId="Concluído">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h3
                    className="text-xl font-bold mb-4 text-center text-gray-900"
                    id="completed-column"
                  >
                    Concluídas
                  </h3>
                  {tasks
                    .filter((t) => t.column === "Concluído")
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            aria-labelledby={`task-title-${task.id}`}
                          >
                            <motion.div
                              className={`p-4 rounded-lg shadow mb-4 ${getPriorityColor(
                                task.priority
                              )}`}
                              whileHover={{ scale: 1.02 }}
                            >
                              <h4
                                id={`task-title-${task.id}`}
                                className="font-bold text-gray-900"
                              >
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {task.description}
                              </p>
                              <p className="text-sm text-gray-700">
                                Criado em: {formatDateTime(task.createdAt)}
                              </p>
                              <p className="text-sm text-gray-700">
                                Prazo: {task.deadline}
                              </p>
                              <p className="text-sm text-gray-700">
                                Tempo Gasto:{" "}
                                {calculateTime(task.startTime, task.endTime)}
                              </p>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </section>
        </DragDropContext>
      </div>

      {/* Rodapé */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        {/* Botões de ação */}
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <button
            onClick={shareData}
            className="flex items-center gap-2 text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Compartilhar por E-mail"
          >
            <ShareIcon className="h-5 w-5" /> Compartilhar por E-mail
          </button>
          <button
            onClick={shareWhatsApp}
            className="flex items-center gap-2 text-green-600 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Compartilhar no WhatsApp"
          >
            <ShareIcon className="h-5 w-5" /> Compartilhar no WhatsApp
          </button>
          <button
            onClick={downloadJSON}
            className="flex items-center gap-2 text-gray-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Baixar JSON"
          >
            <ShareIcon className="h-5 w-5" /> Baixar JSON
          </button>
          <button
            onClick={downloadMarkdown}
            className="flex items-center gap-2 text-yellow-800 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Exportar para Jira"
          >
            <ShareIcon className="h-5 w-5" /> Exportar para Jira
          </button>
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Limpar Histórico"
          >
            <TrashIcon className="h-5 w-5" /> Limpar Histórico
          </button>
        </div>

        {/* Botão de Apoio */}
        <div className="mt-6">
          <a
            href="https://buymeacoffee.com/fernandofav"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition"
            aria-label="Apoiar no Buy Me a Coffee"
          >
            ☕ Apoiar no Buy Me a Coffee
          </a>
        </div>

        {/* Direitos autorais e links */}
        <div className="border-t border-gray-300 pt-4 mt-4">
          <p className="text-sm text-gray-600">
            © 2024 Todos os direitos reservados.{" "}
            <a
              href="https://www.moretes.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Site oficial de Fernando Azevedo"
            >
              Fernando Azevedo
            </a>
            {" - "}
            <a
              href="https://www.linkedin.com/in/fernando-francisco-azevedo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Perfil no LinkedIn de Fernando Azevedo"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
