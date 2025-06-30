import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface AgeRangeSliderProps {
    value: [number, number];
    onChange: (values: [number, number]) => void;
}

const AgeRangeSlider: React.FC<AgeRangeSliderProps> = ({ value, onChange }) => {
    return (
        <div>
            <label className="block mb-2 font-medium text-gray-300">
                Age Range of Participants: <span className="text-coral font-bold">{value[0]} - {value[1]}</span>
            </label>
            <Slider range
                min={18}
                max={100}
                value={value}
                onChange={(val) => {
                    if (Array.isArray(val) && val.length === 2) {
                        onChange([val[0], val[1]]);
                    }
                }}
                trackStyle={[{ backgroundColor: '#f87171' }]}
                handleStyle={[
                { borderColor: '#f87171', backgroundColor: '#f87171', opacity: 1 },
                { borderColor: '#f87171', backgroundColor: '#f87171', opacity: 1 }
                ]}
            />
        </div>
    );
}

export default AgeRangeSlider;