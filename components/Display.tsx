import { useState, useEffect } from 'react'
import { Meal } from '../models/Meal'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

// SVG based visualization of consumption use 
export const Display = ({auth,meal}:{auth:boolean,meal:Meal}) => {
    const [start, setStart] = useState({
        value:"",
        minDate:"",
        maxDate:""
        })
    
    useEffect(()=>{
        // Initialize start and end states
        const fullDate = new Date();
        const todayString = fullDate.toISOString();
        const defaults = {value:todayString,minDate:"1970-01-01",maxDate:todayString}
        setStart(defaults)
    },[setStart])

    const handleStart = (e:any) => {
        setStart({...start, value:e.target.value})
        console.log(start)
    }
    const DatePicker = () => {
        return( 
        <form>
            <label htmlFor="date-range">
                <input type="datetime-local" id="Display-Date"
                    name="start" value={start.value} max={start.maxDate}
                    min={start.minDate} onChange={handleStart}/>
            </label>
        </form>)
    }

    // useEffect(()=>{
    //     console.log(meal)
    // },[meal])

    const landUseBreakpoints =     [924,2343,3762,5181,6600]
    const waterUseBreakpoints =    [968,1532,2097,2662,3227]
    const emissionUseBreakpoints = [3.11,4.92,6.73,8.55,10.36]
    
    const TemporalUse = () => {
        // Users consumption cost over time
        return(
            <div style={{left:'18%',position:'absolute',}}>
                <Image src="/rendering.png" alt="Profile Picture"
                    width="1000" height="196"
                ></Image>
                {/* Yearly Avg Use View<br />
                Land {landUseBreakpoints.join(' ')} <br />
                Water {waterUseBreakpoints.join(' ')} <br />
                Emission {emissionUseBreakpoints.join(' ')} <br /> */}
            </div>)
    }
    const MealUse = () => {
        // Current Meal 
        return(
            <>
                This app is under construction and subject to change <br />
                Remaining Features 
                <ul>
                    <li> Visual Representation of Individual Meal Cost and overall user consumption cost</li>
                    <li> User: set profile, add meal, edit meal, delete meal</li>
                    <li> Graph fine tuning: units, legends, titles</li>
                    <li> Mobile support</li>
                    <li> About Page</li>
                </ul>
            </>)
    }
    return(
        <div className={styles.display}>
            <div className={styles.visualization}>
                <TemporalUse></TemporalUse>
                {/* {auth ? <TemporalUse></TemporalUse> : <MealUse></MealUse>} */}
            </div>
            <div className={styles.visualizationTitle}>
                {/* {auth?"Average Consumption Impact":"Individual Meal Impact"} */}
                {/* {auth?<DatePicker></DatePicker>:null} */}
            </div>
        </div>
    )
}