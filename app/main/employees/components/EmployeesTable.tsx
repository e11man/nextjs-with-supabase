'use client';

import { useState } from 'react';
import { Plus, ListPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AddTaskModal } from './AddTaskModal';
import { TaskList } from './TaskList';
import { AddEmployeeModal } from './AddEmployeeModal';

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string | null;
  onboarded: boolean;
  tasks: any[];
};

export function EmployeesTable({ employees }: { employees: Employee[] }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const openTaskModal = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployeeId(null);
  };

  const toggleTasksView = (employeeId: string) => {
    setExpandedEmployeeId(expandedEmployeeId === employeeId ? null : employeeId);
  };

  return (
    <>
      <div className="mb-6">
        <Button
          onClick={() => setShowAddEmployeeModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Employee
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tasks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => {
              const completedTasks = employee.tasks.filter(t => t.isComplete).length;
              const totalTasks = employee.tasks.length;
              const isExpanded = expandedEmployeeId === employee.id;
              
              return (
                <>
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.department || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.onboarded 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.onboarded ? 'Onboarded' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={completedTasks} max={totalTasks} className="flex-1" />
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {completedTasks}/{totalTasks}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openTaskModal(employee.id)}
                          variant="outline"
                          size="sm"
                        >
                          <ListPlus className="w-4 h-4 mr-1" />
                          Add Task
                        </Button>
                        <Button 
                          onClick={() => toggleTasksView(employee.id)}
                          variant="ghost"
                          size="sm"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" />
                              Hide Tasks
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" />
                              View Tasks
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${employee.id}-tasks`}>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="max-w-3xl">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Tasks for {employee.name}</h4>
                          <TaskList tasks={employee.tasks} />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedEmployeeId && (
        <AddTaskModal
          employeeId={selectedEmployeeId}
          onClose={closeModal}
        />
      )}

      {showAddEmployeeModal && (
        <AddEmployeeModal
          onClose={() => setShowAddEmployeeModal(false)}
        />
      )}
    </>
  );
}