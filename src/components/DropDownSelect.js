import './DropDownSelect.scss'
import React from "react";


const DropDownSelect = ({handleClick}) => {
    return (
            <select id="cars" name="cars" onChange={event => handleClick(event.target.value)} className='selectRegion'>
                <option value="England">England</option>
                <option value="Scotland">Scotland</option>
                <option value="Wales">Wales</option>
                <option value="Northern Ireland">Northern Ireland</option>
            </select>
        )
}

export default DropDownSelect
