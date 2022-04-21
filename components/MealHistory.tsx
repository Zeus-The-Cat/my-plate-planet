import { getAuth, User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { app, db } from "../utils/firebase"
import styles from '../styles/Home.module.css'
import { UserContext } from "../utils/authContext"


export const MealHistory = () => {
    const [history,setHistory] = useState({meals:[]})
    const userContext = useContext(UserContext)
    const databaseName = "users"

    useEffect(()=>{ 
        const getMeals = async () =>{
            const user:User|null|undefined = userContext?.currentUser
            console.log(user)
            const docRef = user && doc(db,databaseName,user?.uid)
            const docSnap = docRef && await getDoc(docRef)
            if(docSnap?.exists()){
                //@ts-ignore
                setHistory({meals:docSnap.data().meals})
            }else{console.error('Could not access document')}
        }
        getMeals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userContext])

    return(
        <div className={styles.mealHistoryContainer}>
            <h3>Meal History</h3>

            {history.meals && history.meals.map((each:any)=>{
                const date = new Date(each?.createdOn?.seconds*1000)
                const fullDate = date.getMonth()+
                                "/"+(date.getDate()+1)+
                                "/"+date.getFullYear()+
                                " "+date.getHours()+
                                ":"+date.getMinutes()
                return(<div key={date.toString()}>
                        <div><b>{fullDate}</b></div>
                        {each.items.map((meal:any,index:any)=>{
                            return(
                                <div key={index}>
                                    {`${meal.name} ${meal.amount}${meal.unit}`}
                                </div>
                            )
                        })}
                </div>)
            })}
            
        </div>
    )
}