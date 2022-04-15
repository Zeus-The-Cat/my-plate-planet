import { useEffect, useState } from 'react'
import {v4 as uuidv4} from 'uuid'

import { getDataset } from "../utils/dataset"
import { MealSelector } from './MealSelector'
import { MealVisuals } from './MealVisuals'

// Models
import { Meal, MealItem } from '../models/Meal'

import styles from '../styles/Home.module.css'

//@ts-ignore
export const AddMeal = (props:any) => {
    const [meal, setMeal] = useState({} as Meal)
    const [foodItems, setFoodItems] = useState({})
    const [rows,setRows] = useState(new Map())

    useEffect( () => {
        const handler = async () =>{
            const data = await getDataset()
            data ? setFoodItems(data) : null 
        }
        handler();
    },[])

    useEffect( ()=> {
        const composeMeal = () => {
            setMeal({meals:rows})
            props.setParentMeal({meals:rows})
        }
        composeMeal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[rows])

    const addRow = () => {
        const defaultMeal = {
            amount:0,
            unit:'g',
            type:'Protein',
            name:'Beef'
        } as MealItem;
        // Generate a key using UUID'
        setRows(new Map(rows.set(uuidv4(),defaultMeal)))
    }
    const removeRow = (e: any) => {
        if(rows.delete(e.target.value)){
            setRows(new Map(rows))
        }else{console.error("Couldn't find Key at Add-Meals")}
    }

    const submitMeal= (e:any) => {
        console.count('submit-meal')
    }
    const cancelMeal = (e:any) => {
        props.setAddingMeal(false)
    }
    return(
        <div className={styles.addMealCard}>
            <div style={{display:'flex',justifyContent:'spaceBetween',alignItems:'center'}}>
                <button onClick={cancelMeal}>Cancel</button>
                <MealVisuals meal={meal}></MealVisuals>
                <button onClick={submitMeal}>Submit</button>
            </div>
            {
                [...rows.keys()].map((key,_)=>{
                    return (
                    <span key={key} style={{display:'flex'}}>
                        <button value={key} onClick={removeRow}>-</button>
                        <MealSelector 
                            items={foodItems} 
                            rows={rows}
                            setRows={setRows} 
                            ukey={key}></MealSelector>
                    </span>
                )})
            }
            <button onClick={addRow}>Add Item</button>
         </div>
    )
}

