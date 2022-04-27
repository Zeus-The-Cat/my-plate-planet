import { useContext, useEffect, useState } from "react"
import { UserContext } from "../utils/authContext"
import Calendar from "./Calendar"

import styles from '../styles/Home.module.css'

import { Meal } from "../models/Meal"
import { User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../utils/firebase"
import Entries from "./Entries"

const LoggedIn = ({history}:{history:{meals:Array<Meal>}}) => {

    const [dateA,setDateA] = useState("")
    const [dateB,setDateB] = useState("")
    useEffect(()=>{
        console.log(history)
    },[history])
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
                <div>History</div> <Range></Range> <div className={styles.homeCardAddMeal}>Add Meal</div>
            </div>
        )
    }
    return(<>
        <Heading></Heading>
        <Entries history={history}></Entries>
    </>)
}

const LoggedOut = (props:any) => {
    return(<>
    Logged Out
    </>)
}

const HomeCard = (props:any) => {
    // array of user meal history
    const [history,setHistory] = useState({meals:[] as Array<Meal>})
    const databaseName = "users"
    const userContext = useContext(UserContext)


    useEffect(()=>{ 
        const getMeals = async () =>{
            const user:User|null|undefined = userContext?.auth.currentUser
            const docRef = user && doc(db,databaseName,user?.uid)
            const docSnap = docRef && await getDoc(docRef)
            console.log('getMeals')
            if(docSnap?.exists()){
                setHistory({meals:[...docSnap.data().meals]})
            }else{console.error('Could not access document')}
        }
        getMeals()
    },[userContext,setHistory])

    return(
        <div className={styles.HomeCard}>
         {/* {userContext?.currentUser ? <LoggedIn></LoggedIn> : <LoggedOut></LoggedOut>} */}
            <LoggedIn history={history} ></LoggedIn>
        </div>
    )
}
export default HomeCard