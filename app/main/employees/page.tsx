import { EmployeesTable } from './components/EmployeesTable';
import { getAllEmployeesWithTasks } from '@/lib/db/employees';
import { SearchBar } from '../components/SearchBar';

async function getEmployees() {
  try {
    const employees = await getAllEmployeesWithTasks();
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<{ q?: string }> | { q?: string } }) {
  const allEmployees = await getEmployees();
  const params = await Promise.resolve(searchParams);
  const query = params.q || '';
  
  // Server-side filtering
  const employees = query
    ? allEmployees.filter(emp => 
        emp.name.toLowerCase().includes(query.toLowerCase()) ||
        emp.email.toLowerCase().includes(query.toLowerCase()) ||
        emp.department?.toLowerCase().includes(query.toLowerCase())
      )
    : allEmployees;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <SearchBar placeholder="Search employees..." />
      </div>
      
      {employees.length === 0 && query ? (
        <p className="text-gray-500 text-center py-8">No employees found matching "{query}"</p>
      ) : (
        <EmployeesTable employees={employees} />
      )}
    </div>
  );
}