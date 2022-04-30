import { useEffect, useState } from "react"
import MealChart from "./MealCharts"

import styles from '../styles/Home.module.css'
import { Meal } from "../models/Meal"
import { AddMeal } from "./AddMeal"

const Entries = ({setHistory,history,addingMeal,setAddingMeal}:{history:{meals:Array<Meal>},setHistory:any,addingMeal:boolean,setAddingMeal:any}) => {
    // selected: hash map representation of what's selected
    //   updates when history is changed in parent (LoggedIn)
    const [selected,setSelected] = useState([false])
    const [chartData, setChartData] = useState("")
    // state for AddMeal component
    const [sessionMeal, setSessionMeal] = useState({} as Meal)

    useEffect(()=>{
        // Need to update seleted, initialize no rows selected
        history.meals && setSelected(Array.from({length:history?.meals.length},(_v,_i)=>false))
    },[history])

    const CheckBox = ({index,meal}:{index:number,meal:Meal}) => {
        // Access history.meals array for each individual meal

        const dateFormat = (dateSeconds:number) => {
            const date = dateSeconds &&  new Date(dateSeconds*1000)
            const darr = String(date)?.split(' ')
            return darr.slice(0,4).join(' ') 
        }
        return(                    
            <div>
                <input type="checkbox" id="PastMealSelect"
                    name="PastMealSelect" checked={selected[index]} onChange={()=>toggleCheckbox(index)} /> 
                    {/*@ts-ignore*/}
                <div>{history?.meals.length > index && dateFormat(history?.meals[index]?.createdOn.seconds)}</div>
                <div>Emissions </div>
                <div>Water Use </div>
                <div>Land Use </div>
                {/* <div>UP/DOWN ARROW {"12%"}</div>
                <div>UP/DOWN ARROW {"20%"}</div> */} 
            </div>
        )
    }

    const toggleCheckbox = (index:number) =>{
        let newSelected = selected
        if(index < newSelected.length){
            newSelected[index] = !newSelected[index]
            setSelected([...newSelected])
        }else{console.error('Index out of bounds at HomeCard.toggleCheckbox()')}
    }

    const chartTransform = () => {
        // for transforming Meals into a x-axis: date, y-axis: quantity
        // with select choosing between 3 consumption types
        console.log('manipulating user data -> chart data')
    }

    return(
        <div className={styles.homeCardEntries}>

                {/* Left Portion*/}
                <div className={styles.history}>
                    {//Display a checkbox for each Meal a user has created
                        history.meals && history.meals.map((meal,index)=>{
                            console.log(index)
                            return <CheckBox key={String(meal.createdOn)} index={index} meal={meal}></CheckBox>
                        })
                    }
                </div>
                {/**Right Portion */}
                <div className={styles.flexColumn} 
                    style={{margin:7,padding:10,
                    background:'#fefefe',alignItems:'center'}}
                >
                    {addingMeal ? <AddMeal history={history} setHistory={setHistory} setAddingMeal={setAddingMeal}></AddMeal>:<MealChart history={history}></MealChart>}
                </div>
        </div>
    )
}
export default Entries