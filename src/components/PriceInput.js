import React from "react";
import './PriceInput.scss'

const PriceInput = ({value, handlePriceChange}) => {
    return (
        <div className='input_group'>
            <span className='symbol_span'>£</span>
            <input type="text" id="price" name="price" pattern="\d*"
                   min="10000" max="10000000" value={value} maxLength={10}
                   onChange={(event) => handlePriceChange(event)}
                   className='input_price'
            />
        </div>
    )
}

export default PriceInput
