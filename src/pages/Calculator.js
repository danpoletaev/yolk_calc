import React, {useEffect, useState} from 'react'

const Calculator = () => {

    const [price, setPrice] = useState(10000)
    const [totalDuty, setTotalDuty] = useState(0)
    const [isFirst, setIsFirst] = useState(null)
    const [city, setCity] = useState('')

    const config = {
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
        let curr_price = parseInt(removeNonNumeric(event.target.value))
        if (event.target.value === '£') {
            curr_price = 0
        }
        setPrice(curr_price)
    }

    const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");

    useEffect(() => {
        calculateTotalDuty()
    }, [price, isFirst, city])

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
        switch (city) {
            case 'England':
                return config.england_northIre
            case 'Scotland':
                return config.scotland
            case 'Wales':
                if (!isFirst && isFirst !== null) {
                    return config.wales_additional
                }
                return config.wales
            case 'Northern Ireland':
                return config.england_northIre
            default:
                return config.england_northIre
        }

    }

    const calculateTotalDuty = () => {
        const current_config = getConfig();
        let additional_percent = 0
        const current_price = price
        let duty = 0;
        if (isFirst !== null && !isFirst) {
            additional_percent = current_config.additional_percent;
        }
        if (current_price < current_config.rates[0].to) {
            duty = 0
            if (current_price >= 40000 && !isFirst && isFirst !== null) {
                duty += current_price * additional_percent
            }
            setTotalDuty(duty)
            return;
        }
        for (let [index, rate] of current_config.rates.entries()) {
            let diff = 0;
            if (index !== 0) {
                if (current_price >= rate.to && rate.to !== -1) {
                    diff = current_config.rates[index].to - current_config.rates[index - 1].to;
                    duty += diff * (rate.percent + additional_percent)
                } else {
                    duty += (current_price - current_config.rates[index - 1].to) * (rate.percent + additional_percent);
                    break;
                }
            }
        }
        if (current_price >= 40000) {
            duty += current_config.rates[0].to * additional_percent
        }
        setTotalDuty(duty)
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: 250}}>
            <h1>Stamp duty calculator</h1>
            <label>Choose your city: </label>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <button type="button" onClick={() => setCity('England')}>
                    England
                </button>
                <button type="button" onClick={() => setCity('Scotland')}>
                    Scotland
                </button>
                <button type="button" onClick={() => setCity('Wales')}>
                    Wales
                </button>
                <button type="button" onClick={() => setCity('Northern Ireland')}>
                    Northern Ireland
                </button>
            </div>
            <label> Is this your first house or additional?</label>
            <button type="button" onClick={() => setIsFirst(true)}>
                First
            </button>
            <button type="button" onClick={() => setIsFirst(false)}>
                Additional
            </button>
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
                {isFirst !== null && <p>Type: {isFirst ? 'First Time buyer' : 'Additional property'}</p>}
                {isFirst !== null ? <h4>Stamp duty to pay: {formatNumber(totalDuty, 2)}</h4> :
                    <h4>Please, choose type first</h4>}
            </div>
        </div>
    )
}

export default Calculator
