import './StarButton.css';
import { useState, useEffect } from "react";

function Star({ id, value, label, isChecked, onChange, disable = false }) {
    return (
        <>
            <input type="radio" checked={isChecked} onChange={onChange} disabled={disable} id={`${id}-${label}`} name={`star-radio-${id}`} value={value}></input>
            <label htmlFor={`${id}-${label}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                </svg>
            </label>
        </>
    )
}

export default function StarButton({ id = -1, startValue = 0, setDisabled = true, onRatingChange }) {
    const [selectedValue, setSelectedValue] = useState(startValue);

    const handleStarChange = (value) => {
        setSelectedValue(value);
        if (onRatingChange) {
            onRatingChange(value);
        }
    };

    useEffect(() => {
        setSelectedValue(startValue); // Actualizar el valor seleccionado al cargar la página
    }, [startValue]);

    return (
        <div name="rating" className="rating">
            <Star id={id} value="5" label="star-5" isChecked={selectedValue === 5} onChange={() => handleStarChange(5)} disable={setDisabled} />
            <Star id={id} value="4" label="star-4" isChecked={selectedValue === 4} onChange={() => handleStarChange(4)} disable={setDisabled} />
            <Star id={id} value="3" label="star-3" isChecked={selectedValue === 3} onChange={() => handleStarChange(3)} disable={setDisabled} />
            <Star id={id} value="2" label="star-2" isChecked={selectedValue === 2} onChange={() => handleStarChange(2)} disable={setDisabled} />
            <Star id={id} value="1" label="star-1" isChecked={selectedValue === 1} onChange={() => handleStarChange(1)} disable={setDisabled} />
        </div>
    )
}

