'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditTaskModal } from './EditTaskModal';

type Task = {
  id: string;
  title: string;
  description: string | null;
  isComplete: boolean;
};

export function TaskItem({ task }: { task: Task }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleComplete = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isComplete: !task.isComplete }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <li className="flex items-center gap-3 py-1">
        <input
          type="checkbox"
          checked={task.isComplete}
          onChange={toggleComplete}
          disabled={isUpdating || isDeleting}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
        />
        <span className={`flex-1 ${task.isComplete ? "line-through text-gray-400" : "text-gray-800"}`}>
          {task.title}
        </span>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditModalOpen(true)}
            disabled={isDeleting}
            variant="outline"
            size="sm"
            className="h-7 text-xs"
          >
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
            size="sm"
            className="h-7 text-xs"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </li>

      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}

