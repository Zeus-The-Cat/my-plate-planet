import { useEffect, useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import { doc, updateDoc, Timestamp, arrayUnion,collection } from 'firebase/firestore'
import { getAuth, User } from 'firebase/auth'
import { db, app } from '../utils/firebase'

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
    const auth = getAuth(app)

    useEffect( () => {
        const handler = async () =>{
            const data = await getDataset()
            data ? setFoodItems(data) : null 
        }
        handler();
    },[])

    useEffect( ()=> {
        const composeMeal = () => {
            setMeal({items:rows})
            props.setParentMeal({items:rows})
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
        // append /users/{auth.uid}/meals 
        const updateMeal = async () => {
            let items:Array<Array<string|MealItem>> = []
            for(const item of rows.entries()){
                const temp = item[0]
                //@ts-ignore
                items.push({uid:item[0],...item[1]})
            }
            const user:User|null = auth.currentUser;
            const userRef = user?.uid ? doc(db,'users',user.uid) : null
            userRef && await updateDoc(userRef,{
                meals:arrayUnion({
                    createdOn:Timestamp.fromDate(new Date()),
                    items:items
                })
            }).then(()=>{
                props.setAddingMeal(false)
            })
        }
        updateMeal();
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

