import React, {useEffect, useState} from 'react'
import './Calculator.scss'
import CalcButton from "../components/CalcButton";
import PriceInput from "../components/PriceInput";
import ResultContainer from "../components/ResultContainer";
import DropDownSelect from "../components/DropDownSelect";
import RangeInput from "../components/RangeInput";

const Calculator = () => {

    const [price, setPrice] = useState(10000)
    const [totalDuty, setTotalDuty] = useState(0)
    const [isFirst, setIsFirst] = useState(true)
    const [region, setRegion] = useState('England')
    const [isAdditional, setIsAdditional] = useState(false)
    const [activeBtn, setActiveBtn] = useState({
        btn1: false,
        btn2: false,
        btn3: false,
        btn4: false
    })

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

    const formatNumber = (duty = totalDuty, decimal = 0, currency = true) => {
        if (currency)
            return new Intl.NumberFormat(
                'en-GB',
                {
                    style: 'currency',
                    currency: 'GBP',
                    minimumFractionDigits: decimal,
                    maximumFractionDigits: decimal,
                }).format(duty)
        else
            return new Intl.NumberFormat(
                'en-GB',
                {
                    minimumFractionDigits: decimal,
                    maximumFractionDigits: decimal,
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
        */
        }
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
        <div className='calculatorContainer'>

            <label>Where are you buying?</label>
            <DropDownSelect handleClick={(value) => setRegion(value)}/>

            <label> Are you a first time buyer? </label>
            {console.log(activeBtn)}
            <div className='buttonContainer'>
                <CalcButton text='Yes' handleClick={() => {
                    setIsFirst(true)
                    setIsAdditional(false)
                    setActiveBtn({
                        ...activeBtn,
                        btn1: true,
                        btn2: false,
                        btn3: false,
                        btn4: false
                    })
                }} active={activeBtn.btn1}/>
                <CalcButton text='No'
                            handleClick={() => {
                                setIsFirst(false)
                                setActiveBtn({
                                    ...activeBtn,
                                    btn1: false,
                                    btn2: true
                                })
                            }}
                            active={activeBtn.btn2}
                            />
            </div>
            {!isFirst && <label style={{marginTop: '15px'}}> Will this be your only property? </label>}

            {!isFirst && <div className='buttonContainer'>
                <CalcButton text='Yes' handleClick={() => {
                    setIsAdditional(false)
                    setActiveBtn({
                        ...activeBtn,
                        btn3: true,
                        btn4: false
                    })
                }} active={activeBtn.btn3}/>
                <CalcButton text='No' handleClick={() => {
                    setIsAdditional(true)
                    setActiveBtn({
                        ...activeBtn,
                        btn3: false,
                        btn4: true
                    })
                }} active={activeBtn.btn4}/>
            </div>}

            <div className='priceContainer'>
                <p className='property'>Property price:</p>
                <p className='propertyPrice'>{formatNumber(price, 2)}</p>
            </div>

            <PriceInput handlePriceChange={handlePriceChange} value={formatNumber(price, 0, false)}/>

            <RangeInput price={price} handleChange={handlePriceChange}/>

            <ResultContainer header='Your stamp duty will be' result_value={formatNumber(totalDuty, 2)}/>

            <div className='alertTextContainer'>
                <p className='alertText'>You do not qualify for first-time buyer stamp duty tax relief because the property is over
                    £500,000.00. Normal tax rates apply</p>
            </div>
        </div>
    )
}

export default Calculator
