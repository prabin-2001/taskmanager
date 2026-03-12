import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, List, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [search, setSearch] = useState("");

    useEffect(() => {
    fetchTasks();
    }, [search]);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`tasks/?search=${search}`);
            setTasks(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load tasks. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveTask = async (formData) => {
        try {
            if (editingTask) {
                const response = await api.put(`tasks/${editingTask.id}/`, formData);
                setTasks(tasks.map(t => t.id === editingTask.id ? response.data : t));
            } else {
                const response = await api.post('tasks/', formData);
                setTasks([response.data, ...tasks]);
            }
            setIsFormOpen(false);
            setEditingTask(null);
        } catch (err) {
            alert('Failed to save task. Please check your input.');
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`tasks/${id}/`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            alert('Failed to delete task.');
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const response = await api.put(`tasks/${task.id}/`, {
                ...task,
                completed: !task.completed
            });
            setTasks(tasks.map(t => t.id === task.id ? response.data : t));
        } catch (err) {
            alert('Failed to update task status.');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleCreateNew = () => {
        setEditingTask(null);
        setIsFormOpen(true);
    };



    return (
        <div className="space-y-8">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Tasks</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your daily activities</p>
                </div>
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-gray-700 flex">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>

                    <button
                        onClick={handleCreateNew}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none transition-all transform active:scale-95"
                    >
                        <Plus size={20} />
                        <span>New Task</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-gray-400">
                    <Loader2 size={40} className="animate-spin text-blue-600" />
                    <p className="animate-pulse font-medium">Fetching your tasks...</p>
                </div>
            ) : tasks.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">No tasks found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                        You don't have any tasks yet. Click the "New Task" button to create your first one!
                    </p>
                </div>
            ) : (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }>
                    {tasks.map(task => (

                        <TaskItem

                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggleComplete}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                        />
                    ))}
                </div>
            )}

            {isFormOpen && (
                <TaskForm
                    onSave={handleSaveTask}
                    onCancel={() => { setIsFormOpen(false); setEditingTask(null); }}
                    editingTask={editingTask}
                />
            )}
        </div>
    );
};

export default Dashboard;
