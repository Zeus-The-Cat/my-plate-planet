import { useState, useEffect } from "react"
import Meal from "../models/Meal"
import axios from 'axios'
import MealItem from "../models/MealItem"
import { ConsumptionStats } from "../models/ConsumptionStats"
export const MealVisuals = ({meal}:{meal:Meal}) => {
    const [emissions, setEmissions] = useState(0)
    const [landUse, setLandUse] = useState(0)
    const [waterUse, setWaterUse] = useState(0)
    const [values, setValues] = useState({} as ConsumptionStats)

    useEffect( () => {
        const handler = async () =>{ // Calculate meal's contribution
            const res = await axios.get('/api/dataset');
            res.data.ConsumptionStat ? setValues(res.data.ConsumptionStat) : null;
        }
        handler();
    },[])
    useEffect(()=>{
        let eSum = 0, lSum = 0, wSum = 0;
        meal.meals ? meal.meals.forEach((item:MealItem)=>{
            if(values.classes){
                // Typescript is bad with bracket identifiers 
                const index = values.classes.findIndex(obj => {
                    return obj.name === item.type
                });
                if(index >= 0){
                    const ii = values.classes[index].items.findIndex(obj => {
                        return obj.name === item.name
                    });
                    if(ii >= 0){
                        const itemStat = values.classes[index].items[ii]
                        eSum += itemStat.meanEmissions * item.amount
                        lSum += itemStat.meanLandUse * item.amount
                        wSum += itemStat.meanWater * item.amount
                    }
                } 
            }
        }) : null;
        setEmissions(eSum);
        setLandUse(lSum);
        setWaterUse(wSum);
    },[meal,values])
    return(
        <>
            <div>Emissions {emissions} kg CO2</div>
            <div>Land Use  {landUse} m^2 year</div>
            <div>Water Use {waterUse} kL eq</div>
        </>
    )
}