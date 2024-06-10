import React from 'react';
import './Legend.css';

const Legend = ({ maxCount }:any) => {
    const steps = 4; // Number of steps in the legend
    const stepSize = maxCount / steps;

    return (
        <div className="legend">
        
            <div className="legend-steps">
            {Array.from({ length: steps + 1 }).map((_, i) => {
                    const count = Math.round(i * stepSize);
                    const intensity = count / maxCount;
                    const backgroundColorBlue = `rgba(0, 0, 255, ${intensity})`;
                    const backgroundColorRed = `rgba(255, 0, 0, ${intensity})`;
                    const color = intensity > 0.5 ? 'white' : 'black';
                    return (
                        <div key={i} className="legend-step-container">
                            <div className="legend-step" style={{ backgroundColor: backgroundColorBlue, color }}>
                                
                            </div>
                            <div className="legend-step" style={{ backgroundColor: backgroundColorRed, color }}>
                                
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Legend;