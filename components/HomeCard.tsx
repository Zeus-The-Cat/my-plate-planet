import { useContext, useEffect, useState } from "react"
import { UserContext } from "../utils/authContext"
import Calendar from "./Calendar"

import styles from '../styles/Home.module.css'
import { AddMeal } from "./AddMeal"

const LoggedIn = (props:any) => {

    const [dateA,setDateA] = useState("")
    const [dateB,setDateB] = useState("")

    useEffect(()=>{
        console.log(dateA)
    },[dateA])

    const Range = () => {
        return(<div className={styles.flexCentered}>
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
              </div>)
    }

    const Heading = () => {
        return(<div className={styles.HomeCardHeader}>
                <div>History</div> <Range></Range> <div className={styles.homeCardAddMeal}>Add Meal</div>
              </div>)
    }

    const Entries = () => {
        return(<>
        </>)
    }

    return(<>
        <Heading></Heading>
        <Entries></Entries>
    </>)
}

const LoggedOut = (props:any) => {
    return(<>
    Logged Out
    </>)
}

const HomeCard = (props:any) => {

    const userContext = useContext(UserContext)

    return(
        <div className={styles.HomeCard}>
         {/* {userContext?.currentUser ? <LoggedIn></LoggedIn> : <LoggedOut></LoggedOut>} */}
            <LoggedIn></LoggedIn>
        </div>
    )
}
export default HomeCard