import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'pending'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Task title is required';
    } else if (formData.title.trim().length > 255) {
      errors.title = 'Task title must be less than 255 characters';
    }
    
    if (formData.description && formData.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }
    
    if (!formData.deadline) {
      errors.deadline = 'Deadline is required';
    } else {
      const selectedDate = new Date(formData.deadline);
      const now = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(now.getFullYear() + 1);
      
      if (selectedDate <= now) {
        errors.deadline = 'Deadline must be in the future';
      } else if (selectedDate > oneYearFromNow) {
        errors.deadline = 'Deadline cannot be more than 1 year in advance';
      }
    }
    
    return errors;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setTasks([data.data, ...tasks]);
        setFormData({ title: '', description: '', deadline: '', status: 'pending' });
        setShowCreateForm(false);
        setFormErrors({});
      } else {
        if (data.errors) {
          setFormErrors(data.errors);
        } else {
          setFormErrors({ general: data.message || 'Failed to create task' });
        }
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setFormErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(task => task.id === editingTask.id ? data.data : task));
        setFormData({ title: '', description: '', deadline: '', status: 'pending' });
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          setTasks(tasks.filter(task => task.id !== taskId));
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      deadline: task.deadline.split('T')[0], // Convert to date input format
      status: task.status
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{user?.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Create Task Button */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Your Tasks</h2>
                <p className="text-sm text-gray-600">
                  {tasks.length === 0 ? 'No tasks yet. Create your first task to get started!' : `${tasks.length} task${tasks.length === 1 ? '' : 's'} in your list`}
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Task
              </button>
            </div>
          </div>
        </div>

        {/* Create Task Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <PlusIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
                      <p className="text-sm text-gray-500">Add a new task to your list</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormErrors({});
                      setFormData({ title: '', description: '', deadline: '', status: 'pending' });
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Error Messages */}
                {formErrors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-sm text-red-700">{formErrors.general}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleCreateTask} className="space-y-6">
                  {/* Title Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({...formData, title: e.target.value});
                          if (formErrors.title) setFormErrors({...formErrors, title: ''});
                        }}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                          formErrors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter task title..."
                      />
                    </div>
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <div className="relative">
                      <textarea
                        value={formData.description}
                        onChange={(e) => {
                          setFormData({...formData, description: e.target.value});
                          if (formErrors.description) setFormErrors({...formErrors, description: ''});
                        }}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${
                          formErrors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Add details about your task..."
                      />
                    </div>
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {formErrors.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.description.length}/1000 characters
                    </p>
                  </div>

                  {/* Deadline Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deadline
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => {
                          setFormData({...formData, deadline: e.target.value});
                          if (formErrors.deadline) setFormErrors({...formErrors, deadline: ''});
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                          formErrors.deadline ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {formErrors.deadline && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {formErrors.deadline}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Must be within the next year
                    </p>
                  </div>

                  {/* Status Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        <option value="pending" className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          Pending
                        </option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setFormErrors({});
                        setFormData({ title: '', description: '', deadline: '', status: 'pending' });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Create Task
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {viewingTask && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                      <p className="text-sm text-gray-500">View task information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingTask(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Task Content */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <p className="text-gray-900 font-medium">{viewingTask.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {viewingTask.description || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline
                    </label>
                    <p className="text-gray-900">{formatDate(viewingTask.deadline)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewingTask.status)}`}>
                      {viewingTask.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created
                    </label>
                    <p className="text-gray-900">{formatDate(viewingTask.created_at)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setViewingTask(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewingTask(null);
                      handleEditClick(viewingTask);
                    }}
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Edit Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Form */}
        {editingTask && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Task</h3>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                  placeholder="Add details about your task..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/1000 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTask(null);
                    setFormData({ title: '', description: '', deadline: '', status: 'pending' });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                No tasks found. Create your first task!
              </li>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        {task.description && (
                          <DocumentTextIcon className="h-4 w-4 text-gray-400" title="Has description" />
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {truncateText(task.description, 80)}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">Deadline: {formatDate(task.deadline)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.description && (
                        <button
                          onClick={() => setViewingTask(task)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditClick(task)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Edit task"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete task"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 