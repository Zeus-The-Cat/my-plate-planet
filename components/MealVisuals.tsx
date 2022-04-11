import { useState, useEffect } from "react"
import { Meal } from "../models/Meal"
import axios from 'axios'
import MealItem from "../models/MealItem"
import { ConsumptionStats } from "../models/ConsumptionStats"

import styles from '../styles/Home.module.css'



export const MealVisuals = ({meal}:{meal:Meal}) => {
    const [emissions, setEmissions] = useState(0)
    const [landUse, setLandUse] = useState(0)
    const [waterUse, setWaterUse] = useState(0)
    const [values, setValues] = useState({} as ConsumptionStats)
    const [nan, setNan] = useState(false)


    useEffect( () => {
        const handler = async () =>{ // Calculate meal's contribution
            const res = await axios.get('/api/dataset');
            res.data.statistics ? setValues(res.data.statistics) : null;
        }
        handler();
    },[])

    useEffect(()=>{
        let eSum = 0, lSum = 0, wSum = 0;
        meal.meals ? meal.meals.forEach((item:MealItem)=>{
            if(values.classes){
                // Typescript is bad about bracket identifiers 
                const index = values.classes.findIndex(obj => {
                    return obj.name == item.type
                });
                if(index >= 0){
                    const ii = values.classes[index].items.findIndex(obj => {
                        return obj.name == item.name
                    });
                    if(ii >= 0){
                        const itemStat = values.classes[index].items[ii]
                        eSum += parseFloat(itemStat.meanEmissions) * item.amount
                        lSum += parseFloat(itemStat.meanLandUse) * item.amount
                        if(parseFloat(itemStat.meanWater)){ 
                            wSum += parseFloat(itemStat.meanWater) * item.amount;
                        }
                    }
                } 
            }
        }) : null;
        setEmissions(eSum);
        setLandUse(lSum);
        setWaterUse(wSum);
    },[meal,values])

    return(
        <div className={styles.addMealVisuals}>
            <div>Emissions {emissions.toFixed(2)} kg CO2</div>
            <div>Land Use  {landUse.toFixed(2)} m^2 year</div>
            <div>Water Use {waterUse.toFixed(2)} kL eq {nan?"*":null}</div>
        </div>
    )
}