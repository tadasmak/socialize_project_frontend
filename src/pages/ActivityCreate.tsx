import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import MaxParticipantsSlider from '../components/ActivityForm/MaxParticipantsSlider';
import AgeRangeSlider from '../components/ActivityForm/AgeRangeSlider';

import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ActivityCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: null as Date | null,
    max_participants: 5
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const [generatingDescription, setGeneratingDescription] = useState(false);

  const handleGenerateDescription = async () => {
    setGeneratingDescription(true);

    try {
      const response = await apiFetch('/api/v1/activities/generate_description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          start_time: form.start_time,
          max_participants: form.max_participants,
          minimum_age: ageRange[0],
          maximum_age: ageRange[1]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const { request_id } = await response.json();

      if (!request_id) throw new Error('Invalid response: request_id is missing');

      const pollStatus = async (request_id: string, retries = 5, delay = 2000) => {
        let lastError: unknown = null;

        await new Promise(resolve => setTimeout(resolve, 1000));

        for (let i = 0; i < retries; i++) {
          try {
            const statusResponse = await apiFetch(`/api/v1/activities/description_status/${request_id}`, { method: 'GET' });

            if (!statusResponse.ok) {
              lastError = new Error(`Polling failed with HTTP ${statusResponse.status}`);
              continue;
            }

            const { status, description, message } = await statusResponse.json();

            if (status == 'completed' && description) {
              setForm(prev => ({ ...prev, description }));
              toast.success('Description generated!', {
                position: 'bottom-center',
                autoClose: 2000,
                theme: 'dark'
              })
              return;
            }

            if (status === 'pending') continue;
            if (status === 'error') throw new Error(message || 'Description generation failed');

            lastError = new Error(`Unexpected status: ${status}`);
          } catch (error) {
            lastError = error;
          }

          await new Promise(resolve => setTimeout(resolve, delay));
        }

        throw lastError || new Error(('Polling timed out'));
      }

      await pollStatus(request_id);
      
    } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || 'Could not generate description', {
          position: 'bottom-center',
          autoClose: 3000
        })
      }
      console.log(error);
    } finally {
      setGeneratingDescription(false);
    }
  }

  const handleDateChange = (date: Date | null) => {
    setForm(prev => ({ ...prev, start_time: date }));
  }

  const handleMaxParticipantsChange = (value: number) => {
    setForm(prev => ({ ...prev, max_participants: value }));
  }

  const [ageRange, setAgeRange] = useState<[number, number]>([18, 26]);

  const handleAgeRangeChange = (values: [number, number]) => {
    setAgeRange(values);
    setForm(prev => ({ ...prev, age_range: `${values[0]}-${values[1]}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return toast.error('You must be logged in', {
                position: 'bottom-center',
                autoClose: 3000
             });
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        minimum_age: ageRange[0],
        maximum_age: ageRange[1]
      }

      const response = await apiFetch('/api/v1/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.errors || 'Failed to create activity');
      }

      toast.success('Activity created!', {
        position: 'bottom-center',
        autoClose: 3000,
        theme: 'dark',
        className: 'bg-gradient text-white',
      });

      const { id } = await response.json();
      navigate(`/activities/${id}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message || 'Something went wrong', {
              position: 'bottom-center',
              autoClose: 3000
            });
        } else {
            toast.error('Something went wrong', {
              position: 'bottom-center',
              autoClose: 3000
            });
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#292929] ring-1 ring-black ring-opacity-5 justify-center rounded-xl shadow-lg max-w-2xl mx-auto px-8 md:px-16 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Create Activity</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="title" className="block mb-1 font-medium text-gray-300">Title</label>
          <input
            id="title"
            name="title"
            placeholder="Activity title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="block mb-1 font-medium text-gray-300">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your activity"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral"
            required
          />
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={generatingDescription || !form.title || !form.location || !!form.description}
            className="py-2 ml-auto rounded font-medium text-sm text-coral-light hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Generate description"
          >
            {generatingDescription ? '...' : 'Generate ✨'}
          </button>
        </div>

        <div>
          <label htmlFor="location" className="block mb-1 font-medium text-gray-300">Location</label>
          <input
            id="location"
            name="location"
            placeholder="Where will it take place?"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral"
            required
          />
          <p className="mt-1 text-yellow-400">⚠️ <small>Avoid sharing an exact address. Activities are visible to everyone until full or confirmed.</small>
          </p>
        </div>

        <div>
          <label htmlFor="start_time" className="block mb-1 font-medium text-gray-300">Start Time</label>
          <DatePicker
            id="start_time"
            selected={form.start_time}
            onChange={handleDateChange}
            showTimeSelect
            timeIntervals={10}
            dateFormat="Pp"
            autoComplete="off"
            className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] cursor-pointer focus:outline-none focus:ring-2 focus:ring-bg-coral"
            placeholderText="Select date and time"
            required
          />
        </div>

        <MaxParticipantsSlider value={form.max_participants} onChange={handleMaxParticipantsChange} />
        <AgeRangeSlider value={ageRange} onChange={handleAgeRangeChange} />

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 bg-coral hover:bg-coral-darker text-white rounded font-semibold cursor-pointer transition-colors duration-100 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating...' : 'Create Activity'}
        </button>
      </form>
    </div>
  );
};

export default ActivityCreate;