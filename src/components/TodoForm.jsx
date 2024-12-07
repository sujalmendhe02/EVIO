import React from 'react';
import { PlusCircle } from 'lucide-react';

function TodoForm({ newTodo, setNewTodo, addTodo }) {
  return (
    <form onSubmit={addTodo} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}

export default TodoForm;