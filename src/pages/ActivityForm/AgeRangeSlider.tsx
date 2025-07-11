import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface AgeRangeSliderProps {
    value: [number, number];
    onChange: (values: [number, number]) => void;
}

const AgeRangeSlider: React.FC<AgeRangeSliderProps> = ({ value, onChange }) => {
    const handleChange = (input: number | number[]) => {
        if (Array.isArray(input) && input.length === 2) {
            onChange([input[0], input[1]]);
        }
    }

    return (
        <div>
            <label className="block mb-2 font-medium text-gray-300">
                Age Range of Participants: <span className="text-coral font-bold">{value[0]} - {value[1]}</span>
            </label>
            <Slider
                range
                min={18}
                max={100}
                value={value}
                onChange={handleChange}
                trackStyle={[{ backgroundColor: '#f87171' }]}
                handleStyle={[
                { borderColor: '#f87171', backgroundColor: '#f87171', opacity: 1, zIndex: 0 },
                { borderColor: '#f87171', backgroundColor: '#f87171', opacity: 1, zIndex: 0 }
                ]}
            />
        </div>
    );
}

export default AgeRangeSlider;