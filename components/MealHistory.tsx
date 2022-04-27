import { getAuth, User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { app, db } from "../utils/firebase"
import styles from '../styles/Home.module.css'
import { UserContext } from "../utils/authContext"


export const MealHistory = ({history}:{history:{meals:Array<any>}}) => {


    return(
        <div className={styles.mealHistoryContainer}>
            <h3>Meal History</h3>

            {history.meals !== undefined ? history.meals.map((each:any)=>{
                const date = new Date(each?.createdOn?.seconds*1000)
                // Combine Date object into styled string
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
            }): 'Loading...'}
        </div>
    )
}