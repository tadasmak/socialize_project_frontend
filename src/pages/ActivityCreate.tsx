import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ActivityCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    max_participants: 5,
    age_range: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('You must be logged in');

    setLoading(true);
    try {
      const response = await apiFetch('/api/v1/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.errors || 'Failed to create activity');
      }

      toast.success('Activity created!', {
        position: 'bottom-center',
        autoClose: 2000,
        theme: 'dark',
        className: 'bg-gradient text-white',
      });

      const { id } = await response.json();
      navigate(`/activities/${id}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message || 'Something went wrong');
        } else {
            toast.error('Something went wrong');
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Create Activity</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
          required
        />

        <input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
          required
        />

        <input
          type="number"
          name="max_participants"
          value={form.max_participants}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
          required
        />

        <input
          name="age_range"
          placeholder="Age Range (e.g. 18-30)"
          value={form.age_range}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-coral text-white px-6 py-2 rounded hover:bg-coral-darker"
        >
          {loading ? 'Creating...' : 'Create Activity'}
        </button>
      </form>
    </div>
  );
};

export default ActivityCreate;