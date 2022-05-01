import { useContext, useEffect, useState } from 'react'
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
import { UserContext } from '../utils/authContext'
//@ts-ignore
export const AddMeal = ({history,setHistory,setAddingMeal,setSessionMeal}:{history:any,setHistory:any,setAddingMeal:any,setSessionMeal:any}) => {
    const [meal, setMeal] = useState({} as Meal)
    const [foodItems, setFoodItems] = useState({})
    const [rows,setRows] = useState(new Map())
    
    const userContext = useContext(UserContext)

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
            setSessionMeal({items:rows})
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
        // append /users/{auth.uid}/meals or local history
        const updateMeal = async () => {
            let items:Array<Array<string|MealItem>> = []
            for(const item of rows.entries()){
                const temp = item[0]
                //@ts-ignore
                items.push({uid:item[0],...item[1]})
            }

            const updateLocalHistory = () => {
                // update history state variable instead of cloud
                let newHistory = {...history};
                newHistory.meals.push({...meal, createdOn:Timestamp.fromDate(new Date())})
                setHistory(newHistory)
                setAddingMeal(false)
            }
            const user:User|null|undefined = userContext?.auth.currentUser;
            const userRef = user?.uid ? doc(db,'users',user.uid) : updateLocalHistory()
            userRef && await updateDoc(userRef,{
                meals:arrayUnion({
                    createdOn:Timestamp.fromDate(new Date()),
                    items:items
                })
            }).then(()=>{
                updateLocalHistory();
            })
        }

        updateMeal();
    }

    const cancelMeal = (e:any) => {
        setAddingMeal(false)
    }

    return(
        <>
            <div className={styles.addMealHeader}>
                <MealVisuals meal={meal}></MealVisuals>
            </div>
            <div className={styles.addMealCard}>
                <div className={styles.flexColumn} style={{alignItems:'center',gap:5}}>
                    <div>Select Food Group and Amount</div>
                    <button onClick={addRow} className={styles.mainButton}>Add Ingredient</button>
                </div>
                
                <div className={styles.mealItemsContainer}>
                    {
                        [...rows.keys()].map((key,_)=>{
                            return (
                            <span key={key} className={styles.flex}>
                                <button value={key} onClick={removeRow} className={styles.removeRow}>-</button>
                                <MealSelector 
                                    items={foodItems} 
                                    rows={rows}
                                    setRows={setRows} 
                                    ukey={key}></MealSelector>
                            </span>
                        )})
                    }
                </div>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                    <button onClick={submitMeal} className={styles.mainButton}>Submit</button>
                    <button onClick={cancelMeal} className={styles.cancelMeal}>Cancel</button>
                </div>
            </div>
         </>
    )
}

