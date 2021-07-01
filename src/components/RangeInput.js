import './RangeInput.scss'
import React from "react";

const RangeInput = ({price, handleChange}) => {
    return (
        <div className='range_container'>
            <input type="range" min="10000" max="10000000" value={price} id="myRange" onChange={(event) => {
                handleChange(event)
            }}/>
        </div>
    )
}

export default RangeInput
