import { useEffect, useState } from 'react'
import {v4 as uuidv4} from 'uuid'

import { getDataset } from "../utils/dataset"
import { MealSelector } from './MealSelector'
import { MealVisuals } from './MealVisuals'

// Models
import { Meal } from '../models/Meal'
import MealItem from '../models/MealItem'

//@ts-ignore
export const AddMeal = (props:any) => {
    const [meal, setMeal] = useState({} as Meal)
    const [foodItems, setFoodItems] = useState({})
    // const [rows, setRows] = useState({items:[]}as{items:Array<MealItem>})
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
        }
        composeMeal();
    },[rows])

    const addRow = () => {
        const defaultMeal = {
            amount:0,
            unit:'g',
            type:'Protein',
            name:'Beef'
        } as MealItem;
        let newRows = new Map()
        rows.forEach((value, key)=> {
            newRows.set(key,value)
        })
        // Generate a key using UUID'
        newRows.set(uuidv4(),defaultMeal)
        setRows(newRows)
    }
    const removeRow = (e: any) => {
        if(rows.delete(e.target.value)){
            let newRows = new Map()
            rows.forEach((value,key)=>{
                newRows.set(key,value)
            })
            setRows(newRows)
        }else{console.error("Couldn't find Key at Add-Meals")}
    }
    return(
        <div>
            <MealVisuals meal={meal}></MealVisuals>
            {
                [...rows.keys()].map((key,_)=>{
                    console.count('meal-rendered')
                    console.log(key)
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

