import React, {useEffect, useState} from 'react'
import './Calculator.scss'

const Calculator = () => {

    const [price, setPrice] = useState(10000)
    const [totalDuty, setTotalDuty] = useState(0)
    const [isFirst, setIsFirst] = useState(true)
    const [region, setRegion] = useState('England')
    const [isAdditional, setIsAdditional] = useState(false)

    const config = {
        // additional_pay_from - amount under each properties are not subject to the additional SDLT rate
        additional_pay_from: 40000,
        england_northIre: {
            additional_percent: 0.03,
            rates: [
                {
                    to: 250000,
                    percent: 0
                },
                {
                    to: 925000,
                    percent: 0.05,
                },
                {
                    to: 1500000,
                    percent: 0.1,
                },
                {
                    to: -1,
                    percent: 0.12
                }
            ]
        },
        scotland: {
            additional_percent: 0.04,
            rates: [
                {
                    to: 145000,
                    percent: 0
                },
                {
                    to: 250000,
                    percent: 0.02
                },
                {
                    to: 325000,
                    percent: 0.05
                },
                {
                    to: 750000,
                    percent: 0.1
                },
                {
                    to: -1,
                    percent: 0.12
                },
            ]
        },
        wales: {
            additional_percent: 0,
            rates: [
                {
                    to: 250000,
                    percent: 0
                },
                {
                    to: 400000,
                    percent: 0.05
                },
                {
                    to: 750000,
                    percent: 0.075
                },
                {
                    to: 1500000,
                    percent: 0.1
                },
                {
                    to: -1,
                    percent: 0.12
                },
            ]
        },
        wales_additional: {
            additional_percent: 0.04,
            rates: [
                {
                    to: 180000,
                    percent: 0
                },
                {
                    to: 250000,
                    percent: 0.035
                },
                {
                    to: 400000,
                    percent: 0.05
                },
                {
                    to: 750000,
                    percent: 0.075
                },
                {
                    to: 1500000,
                    percent: 0.10
                },
                {
                    to: -1,
                    percent: 0.12
                },
            ]
        }
    }

    const handlePriceChange = (event) => {
        let curr_price = parseInt(removeNonNumeric(event.target.value)) || 0
        setPrice(curr_price)
    }

    const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");

    useEffect(() => {
        calculateTotalDuty()
    }, [price, isAdditional, region])

    const formatNumber = (duty = totalDuty, decimal = 0) => {
        return new Intl.NumberFormat(
            'en-GB',
            {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: decimal,
                maximumFractionDigits: decimal
            }).format(duty)
    }

    const getConfig = () => {
        switch (region) {
            case 'England':
                return config.england_northIre
            case 'Scotland':
                return config.scotland
            case 'Wales':
                if (isAdditional) {
                    return config.wales_additional
                }
                return config.wales
            case 'Northern Ireland':
                return config.england_northIre
            default:
                return config.england_northIre
        }

    }

    // algorithm that calculates total Duty
    const calculateTotalDuty = () => {
        // gets config, rates depending on Region ( for example England )
        const current_config = getConfig();
        let additional_percent = 0
        let duty = 0;
        // checks if property is additional, adds additional_percent depending on region
        if (isAdditional) {
            additional_percent = current_config.additional_percent;
        }
        // checks if price is lower than amount for "zero percent rate"
        // * if property is additional, we still pay the percent except property under additional_pay_from
        if (price < current_config.rates[0].to) {
            duty = 0
            if (price >= config.additional_pay_from && isAdditional) {
                duty += price * additional_percent
            }
            setTotalDuty(duty)
            return;
        }
        {/* we will only get there, if price is greater than amount for "zero percent"
            in config - there is rates for different amounts.
            Short description of algorithm: loop through rate entries, check if index is not equals to 0 (because percent is not charged for first one)
            for indexes 1 - infinity, we check if our price is grater than "up to amount" of that entry
            if greater or equals - we are finding difference between previous and current amount and charge percent on that amount
            if not - we are finding difference between our price and previous "amount to" and charge percent on that amount
            in the end we charge percent for "zero percent amount" if it is additional property
        */}
        for (let [index, rate] of current_config.rates.entries()) {
            let diff = 0;
            if (index !== 0) {
                if (price >= rate.to && rate.to !== -1) {
                    diff = current_config.rates[index].to - current_config.rates[index - 1].to;
                    duty += diff * (rate.percent + additional_percent)
                } else {
                    duty += (price - current_config.rates[index - 1].to) * (rate.percent + additional_percent);
                    break;
                }
            }
        }
        duty += current_config.rates[0].to * additional_percent
        setTotalDuty(duty)
    }

    return (
        <div className='calculator_container'>
            <label>Where are you buying?</label>
            <select id="cars" name="cars" onChange={event => setRegion(event.target.value)}>
                <option value="England">England</option>
                <option value="Scotland">Scotland</option>
                <option value="Wales">Wales</option>
                <option value="Northern Ireland">Northern Ireland</option>
            </select>
            <label> Are you a first time buyer? </label>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <button type="button" onClick={() => {
                    setIsFirst(true)
                    setIsAdditional(false)
                }}>
                    Yes
                </button>
                <button type="button" onClick={() => setIsFirst(false)}>
                    No
                </button>
            </div>
            {!isFirst && <div>
                <label> Will this be your only property? </label>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <button type="button" onClick={() => setIsAdditional(false)}>
                        Yes
                    </button>
                    <button type="button" onClick={() => setIsAdditional(true)}>
                        No
                    </button>
                </div>
            </div>}
            <label htmlFor="price">Property price in pounds:
                <input type="text" id="price" name="price"
                       min="10000" max="10000000" value={formatNumber(price, 0)}
                       onChange={(event) => handlePriceChange(event)}/>
            </label>
            <input type="range" min="10000" max="10000000" value={price} id="myRange" onChange={(event) => {
                handlePriceChange(event)
            }}/>
            <div>
                <h3>Result: </h3>
                <p>Type: {!isAdditional ? 'First Time buyer' : 'Additional property'}</p>
                <div>
                    <h4>Your stamp duty will be</h4>
                    <p>{formatNumber(totalDuty, 2)}</p>
                </div>
                <p>You do not qualify for first-time buyer stamp duty tax relief because the property is over £500,000.00. Normal tax rates apply</p>
            </div>
        </div>
    )
}

export default Calculator
