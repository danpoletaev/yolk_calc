import React from "react";
import './PriceInput.scss'

const PriceInput = ({value, handlePriceChange}) => {
    return (
        <div className='inputGroup'>
            <span className='symbolSpan'>£</span>
            <input type="text" id="price" name="price" pattern="\d*"
                   min="10000" max="10000000" value={value} maxLength={10}
                   onChange={(event) => handlePriceChange(event)}
                   className='inputPrice'
            />
        </div>
    )
}

export default PriceInput
