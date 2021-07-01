import React from "react";
import './CalcButton.scss'

const CalcButton = ({text, handleClick}) => {
    return (
            <button className='calc_button' onClick={handleClick}>
                {text}
            </button>
    )
}

export default CalcButton
