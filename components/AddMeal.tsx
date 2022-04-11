import { useEffect, useState } from 'react'
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
    const [rows, setRows] = useState({items:[]}as{items:Array<MealItem>})

    useEffect( () => {
        const handler = async () =>{
            const data = await getDataset()
            data ? setFoodItems(data) : null 
        }
        handler();
    },[])

    useEffect( ()=> {
        const composeMeal = () => {
            setMeal({
                meals:[...rows.items]})
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
        let newRows = {items:[...rows.items]}
        newRows.items.push(defaultMeal)
        setRows(newRows)
    }
    const removeRow = (e: any) => {
        setRows({items:rows.items.filter((i,index)=>{
            return index != e.target.value
        })})
    }
    return(
        <div>
            <MealVisuals meal={meal}></MealVisuals>
            {
                rows.items.map((row,i)=>{
                    return (
                    <span key={i} style={{display:'flex'}}>
                        <button value={i} onClick={removeRow}>-</button>
                        <MealSelector 
                            items={foodItems} 
                            rows={rows}
                            setRows={setRows} 
                            index={i}
                            key={i}></MealSelector>
                    </span>
                )})
            }
            <button onClick={addRow}>Add Item</button>
         </div>
    )
}

