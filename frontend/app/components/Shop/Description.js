import './Description.css';
import React, { useState } from 'react';

export default function Description({description}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    // Function to replace newlines with <br>
    const formatDescription = (text) => {
        // console.log(text);

        if (Array.isArray(text)) {
            text = text.join(''); // Convert array to string
        }
      
        if (typeof text !== 'string') {
            return null;
        }

        return text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
        ));
    };

    return (
        <div className="description-container desc" onClick={toggleDescription}>
            <span>Description:</span>
            <p className={isExpanded ? 'expanded' : 'collapsed'}>
                {formatDescription(description)}
            </p>
            {!isExpanded && <div className="fade"></div>}
        </div>
    );
}