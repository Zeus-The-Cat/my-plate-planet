import { useContext, useEffect, useState } from "react"
import { UserContext } from "../utils/authContext"
import Calendar from "./Calendar"

import styles from '../styles/Home.module.css'

import { Meal } from "../models/Meal"
import { User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../utils/firebase"
import Entries from "./Entries"
import { AddMeal } from "./AddMeal"

const LoggedIn = ({history,setHistory}:{history:{meals:Array<Meal>},setHistory:any}) => {
    // date ranges to display in history
    const [dateA,setDateA] = useState("")
    const [dateB,setDateB] = useState("")
    // state for AddMeal component
    const [addingMeal, setAddingMeal] = useState(false)

    const Range = () => {
        return(
            <div className={styles.flexCentered}>
                <div>Range</div>
                <div className={styles.flexColumn} 
                style={{alignItems:'center'}}>
                    <div className={styles.flexCentered}>
                        From:
                        <Calendar dateState={{date:dateA,setDate:setDateA}}></Calendar>
                        {dateA}
                    </div>
                    <div className={styles.flexCentered}>
                        To:
                        <Calendar dateState={{date:dateB,setDate:setDateB}}></Calendar>
                        {dateB}
                    </div>
                </div>
            </div>
        )
    }

    const Heading = () => {
        return(
            <div className={styles.HomeCardHeader}>
                <div>History</div> 
                <Range></Range> 
                <button className={styles.homeCardAddMeal}
                    onClick={(_e)=>setAddingMeal(true)}>
                    Add Meal
                </button>
            </div>
        )
    }
    return(<>
        <Heading></Heading>
        <Entries history={history} setHistory={setHistory} addingMeal={addingMeal} setAddingMeal={setAddingMeal}></Entries>
    </>)
}

const LoggedOut = (props:any) => {
    // Meals added in current session
    const [addingMeal2, setAddingMeal2] = useState(false)


    const Heading = () => {
        return (
        <div className={styles.HomeCardHeader}>
            <div>History</div> 
            <button className={styles.homeCardAddMeal}
                onClick={(_e)=>setAddingMeal2(true)}>
                Add Meal
            </button>
        </div>
        )
    }

    return(
        <div className={styles.flexColumn} style={{background:'var(--green-lightest)',borderRadius:15}}>
            <Heading></Heading>
            <Entries history={props.history} setHistory={props.setHistory} addingMeal={addingMeal2} setAddingMeal={setAddingMeal2}></Entries>
        </div>
    )
}

const HomeCard = () => {
    // array of user meal history
    const [history,setHistory] = useState({meals:[] as Array<Meal>})
    const databaseName = "users"
    const userContext = useContext(UserContext)


    useEffect(()=>{ 
        const getMeals = async () =>{
            const user:User|null|undefined = userContext?.auth.currentUser
            const docRef = user && doc(db,databaseName,user?.uid)
            const docSnap = docRef && await getDoc(docRef)
            if(docSnap?.exists()){
                setHistory({meals:[...docSnap.data().meals]})
            }else{
                setHistory({meals:[]})
            }
        }
        getMeals()
    },[userContext,setHistory])

    return(
        <div className={styles.HomeCard}>
            {userContext?.auth.currentUser ? <LoggedIn history={history} setHistory={setHistory}></LoggedIn> : <LoggedOut history={history} setHistory={setHistory}></LoggedOut>}
        </div>
    )
}
export default HomeCard