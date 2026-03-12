import { CheckCircle, Circle, Trash2, Edit2, Calendar, Tag, AlertCircle } from 'lucide-react';

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
    const formattedDate = task.due_date
        ? new Date(task.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        })
        : null;
    const today = new Date().toISOString().split("T")[0];
    const isOverdue = task.due_date && task.due_date < today && !task.completed;
    const isToday = task.due_date === today;

    return (
        <div className={`group p-6 rounded-3xl shadow-sm border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5
                        bg-white dark:bg-gray-800 ${isOverdue ? "border-red-500 bg-red-50/40 dark:bg-red-900/20" : ""}
                        ${isToday ? "border-yellow-500 bg-yellow-50/40 dark:bg-yellow-900/20" : ""}
                        ${!isOverdue && !isToday ? "border-gray-100 dark:border-gray-700" : ""}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <button
                        onClick={() => onToggleComplete(task)}
                        className={`mt-1 transition-all transform active:scale-90 ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
                    >
                        {task.completed ? <CheckCircle size={24} className="fill-green-50" /> : <Circle size={24} />}
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className={`font-bold text-lg truncate ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                                {task.title}
                            </h3>
                            {task.category_name && (
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
                                    {task.category_name}
                                </span>
                            )}
                        </div>

                        {task.description && (
                            <p className={`text-sm line-clamp-2 ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                                {task.description}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            {formattedDate && (
                        <div
                            className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue? "text-red-500 animate-pulse": isToday? "text-yellow-500": "text-gray-400 dark:text-gray-500"}`}>
                            <Calendar size={14} />
                            <span> <p>Due Date</p>
                            {isOverdue ? "OVERDUE · " : isToday ? "TODAY · " : ""}
                            {formattedDate}
                            </span>
                        </div>
                        )}
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                                <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Edit Task"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete Task"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;

