import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface MaxParticipantsSliderProps {
    value: number;
    onChange: (value: number) => void;
}

const MaxParticipantsSlider: React.FC<MaxParticipantsSliderProps> = ({ value, onChange }) => {
    return (
        <div>
            <label htmlFor="max_participants" className="block mb-2 font-medium text-gray-300">Maximum Participants: <span className="text-coral font-bold">{value}</span></label>
            <Slider
                min={2}
                max={8}
                value={value}
                onChange={(val) => {
                    if (typeof val === 'number') onChange(val)
                }}
                trackStyle={{ backgroundColor: '#f87171' }}
                handleStyle={{ borderColor: '#f87171', backgroundColor: '#f87171', opacity: 1 }}
            />
        </div>
    );
};

export default MaxParticipantsSlider;