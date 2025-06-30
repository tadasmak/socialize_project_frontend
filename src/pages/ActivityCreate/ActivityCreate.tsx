import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import AgeRangeSlider from './AgeRangeSlider';

import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const ActivityCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: null as Date | null,
    max_participants: 5,
    age_range: '',
  });

  const [ageRange, setAgeRange] = useState<[number, number]>([18, 26]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setForm(prev => ({ ...prev, start_time: date }));
  }

  const handleMaxParticipantsChange = (value: number) => {
    setForm(prev => ({ ...prev, max_participants: value }));
  }

  const handleAgeRangeChange = (values: [number, number]) => {
    setAgeRange(values);
    setForm(prev => ({ ...prev, age_range: `${values[0]}-${values[1]}` }));
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
    <div className="card justify-center rounded-xl shadow-lg max-w-2xl mx-auto px-24 py-8 text-white">
      <h2 className="text-3xl font-bold mb-6">Create Activity</h2>

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

        <div>
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

        <div>
          <label htmlFor="max_participants" className="block mb-2 font-medium text-gray-300">Maximum Participants: <span className="text-coral font-bold">{form.max_participants}</span></label>
          <Slider
            min={2}
            max={8}
            value={form.max_participants}
            onChange={(value) => handleMaxParticipantsChange(value as number)}
            trackStyle={{ backgroundColor: '#f87171' }}
            handleStyle={{ borderColor: '#f87171', backgroundColor: '#f87171', opacity: 1 }}
          />
        </div>

        <div>
          <AgeRangeSlider value={ageRange} onChange={handleAgeRangeChange} />
        </div>

        <div>

        </div>
      </form>
    </div>
  );
};

export default ActivityCreate;