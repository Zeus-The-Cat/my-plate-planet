import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

// SVG based visualization of consumption use 
export const Display = ({auth}:{auth:boolean}) => {
    const [start, setStart] = useState({
        value:"",
        min:"",
        max:""
    })
    const [end, setEnd] = useState({
        value:"",
        min:"",
        max:""
    })

    useEffect(()=>{
        // Initialize start and end states
        const fullDate = new Date();
        const todayString = fullDate.toISOString();
        const defaults = {value:todayString,min:"1970-01-01",max:todayString}
        setStart(defaults)
        setEnd({...defaults})
    },[setEnd, setStart])

    const handleStart = (e) => {
        setStart({...start, value:e.target.value})
        console.log(start)
    }
    const DatePicker = () => {
        return( 
        <form>
            <label htmlFor="date-range">
                <input type="datetime-local" id="Display-Date"
                    name="start" value={start.value} max={start.max}
                    min={start.min} onChange={handleStart}/>
            </label>
        </form>)
    }
    const TemporalUse = () => {
        return(<>Yearly Avg Use View</>)
    }
    const MealUse = () => {
        // Current Meal 
        return(<>Individual Meal View</>)
    }
    return(
        <div className={styles.display}>
            <div className={styles.visualization}>
                {auth ? <TemporalUse></TemporalUse> : <MealUse></MealUse>}
            </div>
            <div className={styles.visualizationTitle}>
                {auth?"Average Consumption Impact":"Individual Meal Impact"}
                {auth?<DatePicker></DatePicker>:null}
            </div>
        </div>
    )
}