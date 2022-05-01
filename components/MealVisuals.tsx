import { useState, useEffect } from "react"
import { Meal, MealItem } from "../models/Meal"
import { ConsumptionStats } from "../models/ConsumptionStats"
import { getDataset } from "../utils/dataset"
import styles from '../styles/Home.module.css'

export const MealVisuals = (props:any) => {
    const [emissions, setEmissions] = useState(0)
    const [landUse, setLandUse] = useState(0)
    const [waterUse, setWaterUse] = useState(0)
    const [values, setValues] = useState({} as ConsumptionStats)
    const [nan, _] = useState(false)


    useEffect( () => {
        const handler = async () =>{ // Calculate meal's contribution
            const res = await getDataset(1)
            res ? setValues(res) : null;
        }
        handler();
    },[])

    useEffect(()=>{
        let eSum = 0, lSum = 0, wSum = 0;
        props.meal.meals ? props.meal.meals.forEach((item:MealItem)=>{
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
                        eSum += parseFloat(String(itemStat.meanEmissions)) * item.amount
                        lSum += parseFloat(String(itemStat.meanLandUse)) * item.amount
                        if(parseFloat(String(itemStat.meanWater))){ 
                            wSum += parseFloat(String(itemStat.meanWater)) * item.amount;
                        }
                    }
                } 
            }
        }) : null;
        setEmissions(eSum);
        setLandUse(lSum);
        setWaterUse(wSum);
    },[props.meal,values])

    return(
        <>
            <div className={styles.emissionVisual}>
                <div>Emissions</div>
                <div>{emissions.toFixed(2)} kg CO2</div>
            </div>
            <div className={styles.emissionVisual}>
                <div>Land Use</div>
                <div>{landUse.toFixed(2)} m^2 year</div>
            </div>
            <div className={styles.emissionVisual}>
                <div>Water Use</div>
                <div>{waterUse.toFixed(2)} L {nan?"*":null}</div>
            </div>
        </>
    )
}