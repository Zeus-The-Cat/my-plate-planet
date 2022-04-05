import { useEffect, useState } from 'react'
// Custom Components
import { MealSelector } from './MealSelector'
import { MealVisuals } from './MealVisuals'
// libraries
import Link from 'next/link'
import axios from 'axios'
// Models
import Meal from '../models/Meal'
import MealItem from '../models/MealItem'

export const AddMeal = () => {
    const [meal, setMeal] = useState({} as Meal)
    const [foodItems, setFoodItems] = useState({})
    const [rowA, setRowA] = useState({} as MealItem)
    const [rowB, setRowB] = useState({} as MealItem)


    useEffect( () => {
        const handler = async () =>{
            const res = await axios.get('/api/dataset');
            setFoodItems(res.data);
        }
        handler();
    },[])

    useEffect( ()=> {
        const composeMeal = () => {
            setMeal({meals:[rowA,rowB]})
        }
        composeMeal();
    },[rowA,rowB])


    return(
        <div>
            <MealVisuals meal={meal}></MealVisuals>
            <MealSelector items={foodItems} setFoodItem={setRowA}></MealSelector>
            <MealSelector items={foodItems} setFoodItem={setRowB}></MealSelector>
        </div>
    )
}