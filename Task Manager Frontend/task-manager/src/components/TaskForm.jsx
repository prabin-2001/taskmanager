import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const TaskForm = ({ onSave, onCancel, editingTask }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: "",
        completed: false
    });

    useEffect(() => {
    if (editingTask) {
        setFormData({
            title: editingTask.title,
            description: editingTask.description || '',
            due_date: editingTask.due_date
                ? editingTask.due_date.split("T")[0]
                : "",
            completed: editingTask.completed || false
        });
    }
    }, [editingTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {editingTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="What needs to be done?"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            rows="3"
                            maxLength={300}
                            placeholder="Add some more details..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white line-clamp-2 break-all overflow-hidden resize-none overflow-y-auto"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Due Date
                        </label>
                        <input
                        type="date"
                        name="due_date"
                        value={formData.due_date || ""}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        />
                    </div>

                    {editingTask && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="completed"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                checked={formData.completed}
                                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                            />
                            <label htmlFor="completed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mark as completed
                            </label>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            <span>{editingTask ? 'Update' : 'Create'} Task</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
