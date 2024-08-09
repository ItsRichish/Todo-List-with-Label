import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { loadState, saveState } from "./utils";
import TaskItem from "./components/TaskItem";

// Define types for Task and Label
interface Task {
  id: string;
  text: string;
  newLabel: string[];
  isComplete: boolean;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(loadState("tasks") || []);
  const [labels, setLabels] = useState<string[]>(loadState("labels") || []);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newLabel, setNewLabel] = useState<string[]>([]);
  const [text, setText] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  useEffect(() => {
    saveState("tasks", tasks);
  }, [tasks]);

  useEffect(() => {
    saveState("labels", labels);
  }, [labels]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask: Task = { id: uuidv4(), text, newLabel, isComplete: false };
    addTask(newTask);
    addLabel(newLabel);

    setText("");
    setNewLabel([]);
  };

  const addLabel = (newLabel: string[]) => {
    if (!labels.some((label) => newLabel.includes(label))) {
      setLabels([...labels, ...newLabel]);
    }
  };

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleEdit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    let t = tasks.find((i) => i.id === id);
    if (t) {
      setText(t.text);
      setNewLabel(t.newLabel);
      setTasks(tasks.filter((task) => task.id !== id));
      setIsEditing(true);
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleInputLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLabel(e.target.value.split(",").map((label) => label.trim()));
    filterOptions(e.target.value);
  };

  const filterOptions = (input: string) => {
    const lowercasedInput = input.toLowerCase();
    const matches = labels.filter((label) =>
      label.toLowerCase().includes(lowercasedInput)
    );

    setFilteredOptions(
      matches.length > 0
        ? matches
        : [`Add ${input && `"${input}"`} as a new label`]
    );
  };

  const handleLabelClick = (label: string) => {
    console.log(newLabel);
    console.log(label);

    if (label.startsWith("Add")) {
      const newL = newLabel[0].charAt(0).toUpperCase() + newLabel[0].slice(1);
      setLabels([...labels, newL]);
    }
    if (!label.startsWith("Add")) {
      setNewLabel([label]);
    }
    setFilteredOptions([]);
  };

  return (
    <div className="container my-5 mx-auto p-4 max-w-[80vw] bg-violet-100 min-h-[80vh] rounded-xl">
      <h1 className="text-3xl font-bold mb-4">TO-DO List</h1>

      {/* Form  */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <input
          className="p-2 border mb-2 w-full"
          type="text"
          placeholder="Enter Task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <div className="relative">
          <input
            className="p-2 border mb-2 w-full"
            type="text"
            placeholder="Enter labels (comma-separated)..."
            value={newLabel.join(", ")}
            onChange={handleInputLabelChange}
          />

          {newLabel.length > 0 && (
            <div className="absolute bg-white border border-gray-300 rounded shadow-lg mt-1 w-full z-10">
              {filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleLabelClick(option)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          {isEditing ? "Edit Task" : "Add Task"}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4 sm:grid-cols-2 xs:grid-cols-1">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleComplete}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
