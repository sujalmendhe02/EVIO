import React from 'react';

function ProgressBar({ completedTodos, totalTodos }) {
  return (
    <div className="mt-6 text-center text-sm text-gray-600">
      {completedTodos} of {totalTodos} tasks completed
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;