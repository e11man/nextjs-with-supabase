import { TemplatesList } from './components/TemplatesList';
import { getAllTemplatesWithTasks } from '@/lib/db/templates';
import { SearchBar } from '../components/SearchBar';

async function getTemplates() {
  try {
    const templates = await getAllTemplatesWithTasks();
    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ q?: string }> | { q?: string } }) {
  const allTemplates = await getTemplates();
  const params = await Promise.resolve(searchParams);
  const query = params.q || '';
  
  // Server-side filtering
  const templates = query
    ? allTemplates.filter(template => 
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.description?.toLowerCase().includes(query.toLowerCase()) ||
        template.tasks.some(task => task.title.toLowerCase().includes(query.toLowerCase()))
      )
    : allTemplates;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Templates</h1>
        <SearchBar placeholder="Search templates..." />
      </div>
      
      <p className="text-gray-600 mb-6">
        Create reusable task templates for common onboarding scenarios (e.g., IT Setup, HR Orientation).
        Assign templates to employees to automatically create all associated tasks.
      </p>
      
      {templates.length === 0 && query ? (
        <p className="text-gray-500 text-center py-8">No templates found matching "{query}"</p>
      ) : (
        <TemplatesList templates={templates} />
      )}
    </div>
  );
}

