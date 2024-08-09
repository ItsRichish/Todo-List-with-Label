import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

// Define the type for props
interface TaskItemProps {
  task: {
    id: string;
    text: string;
    newLabel: string[];
    isComplete: boolean;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}) => {
  return (
    <div
      className={`max-w-md bg-white rounded-lg shadow-md p-4 ${
        task.isComplete ? "bg-green-100" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3
            className={`ml-2 text-lg font-bold ${
              task.isComplete ? "line-through" : ""
            }`}
          >
            <input
              className="mr-2"
              type="checkbox"
              checked={task.isComplete}
              onChange={() => onToggle(task.id)}
            />
            {task.text}
          </h3>
        </div>

        <div className="flex space-x-2">
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={(e) => onEdit(e, task.id)}
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onDelete(task.id)}
          >
            <AiFillDelete />
          </button>
        </div>
      </div>

      <div className="mt-2">
        {task.newLabel?.map((label) => (
          <span
            key={label}
            className="text-xs bg-gray-200 rounded px-2 py-1 mr-2"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TaskItem;
