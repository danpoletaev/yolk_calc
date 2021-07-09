import React from "react";
import './ResultContainer.scss'

const ResultContainer = ({header, result_value}) => {
    return (
        <div className='resultContainer'>
            <div className='dutyLabel'>{header}</div>
            <div className='showresult'>
                <span>{result_value}</span>
            </div>
        </div>
    )
}

export default ResultContainer
