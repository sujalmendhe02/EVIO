import React from 'react';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';

function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
        todo.completed
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`focus:outline-none transition-colors duration-200 ${
            todo.completed ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
          }`}
        >
          {todo.completed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
        </button>
        <span
          className={`flex-1 text-gray-800 ${
            todo.completed ? 'line-through text-gray-500' : ''
          }`}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="ml-2 text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

export default TodoItem;