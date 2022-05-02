import { useState, useEffect } from "react"
import { Meal, MealItem } from "../models/Meal"
import { ConsumptionByClass, ConsumptionByItem, ConsumptionStats } from "../models/ConsumptionStats"
import { getDataset } from "../utils/dataset"
import styles from '../styles/Home.module.css'

export const MealVisuals = ({meal}:{meal:Meal}) => {
    const [emissions, setEmissions] = useState(0)
    const [landUse, setLandUse] = useState(0)
    const [waterUse, setWaterUse] = useState(0)
    const [stats, setStats] = useState({} as ConsumptionStats)
    const [nan, _] = useState(false)


    useEffect( () => {
        const handler = async () =>{ // Calculate meal's contribution
            const res = await getDataset(1)
            res ? setStats(res) : null;
        }
        handler();
    },[])

    useEffect(()=>{
        let eSum = 0, lSum = 0, wSum = 0;
        meal?.items ? meal.items.forEach((item:MealItem)=>{
            const targetClass = stats?.classes?.find((el:ConsumptionByClass)=>{
                return el.name == item.type
            })
            // save n and targeted ConsumptionByItem object
            let n:number = targetClass?.n ? Number(targetClass.n) : 1;
            if(targetClass?.unit == "kg"){
                n=n*1000;
            }
            let targetItem:ConsumptionByItem|undefined = targetClass?.items?.find((el2:ConsumptionByItem)=>{
                return el2.name == item.name
            })
            if(!targetItem){
                targetItem = {meanEmissions:0,meanLandUse:0,meanWater:0,name:' ',n:0} as ConsumptionByItem
            }
            eSum += (Number(targetItem.meanEmissions)/n*item.amount)
            lSum += (Number(targetItem.meanLandUse)/n*item.amount)
            wSum += (Number(targetItem.meanWater)/n*item.amount)
        }) : null;
        setEmissions(eSum);
        setLandUse(lSum);
        setWaterUse(wSum);
    },[meal,stats])

    return(
        <>
            <div className={styles.emissionVisual}>
                <div style={{color:"#72bbdd"}}>Emissions</div>
                <div >{emissions.toFixed(2)} kg CO<sub>2</sub></div>
            </div>
            <div className={styles.emissionVisual}>
                <div style={{color:"#587c0c"}}>Land Use</div>
                <div >{landUse.toFixed(2)} m<sup>2</sup> year</div>
            </div>
            <div className={styles.emissionVisual}>
                <div style={{color:"#296c7d"}}>Water Use</div>
                <div >{waterUse.toFixed(2)} L {nan?"*":null}</div>
            </div>
        </>
    )
}