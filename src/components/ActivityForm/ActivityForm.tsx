import React from "react";

import { ActivityFormType } from "../../types/activityTypes";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MaxParticipantsSlider from './MaxParticipantsSlider';
import AgeRangeSlider from './AgeRangeSlider';

interface Props {
    activity: ActivityFormType;
    loadingSubmit: boolean;
    generatingDescription: boolean;
    onChange: <K extends keyof ActivityFormType>(
        key: K,
        value: ActivityFormType[K]
    ) => void;
    onGenerateDescription: () => void,
    onSubmit: (e: React.FormEvent) => void;
    action?: 'create' | 'edit';
}

const ActivityForm: React.FC<Props> = ({
    activity,
    loadingSubmit,
    generatingDescription,
    onChange,
    onGenerateDescription,
    onSubmit,
    action = 'edit'
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block mb-1 font-medium text-gray-300">Title</label>
                <input
                    id="title"
                    name="title"
                    placeholder="Activity title"
                    value={activity.title}
                    onChange={(e) => onChange("title", e.target.value)}
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
                    value={activity.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral"
                    required
                />
                <button
                    type="button"
                    onClick={onGenerateDescription}
                    disabled={generatingDescription || !activity.title || !activity.location || !!activity.description}
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
                    value={activity.location}
                    onChange={(e) => onChange("location", e.target.value)}
                    className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral"
                    required
                />
            </div>

            <div>
                <label htmlFor="start_time" className="block mb-1 font-medium text-gray-300">Start Time</label>
                <DatePicker
                    id="start_time"
                    selected={activity.start_time}
                    onChange={(date) => { if (date) onChange('start_time', date); }}
                    showTimeSelect
                    timeIntervals={10}
                    dateFormat="Pp"
                    autoComplete="off"
                    className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] cursor-pointer focus:outline-none focus:ring-2 focus:ring-bg-coral"
                    placeholderText="Select date and time"
                    required
                />
            </div>

            <MaxParticipantsSlider value={activity.max_participants} onChange={(value: number) => onChange("max_participants", value)} />
            <AgeRangeSlider
                value={[activity.minimum_age, activity.maximum_age]}
                onChange={(values: [number, number]) => {
                    onChange("minimum_age", values[0]);
                    onChange("maximum_age", values[1])
                }}
            />

            <button
                type="submit"
                disabled={loadingSubmit}
                className={`w-full mt-6 py-3 bg-coral hover:bg-coral-darker text-white rounded font-semibold cursor-pointer transition-colors duration-100 ${loadingSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loadingSubmit
                    ? action === 'edit'
                        ? 'Updating...'
                        : 'Creating...'
                    : action === 'edit'
                        ? 'Update Activity'
                        : 'Create Activity'}
            </button>
        </form>
    );
}

export default ActivityForm;