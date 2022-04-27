import { useEffect, useState } from "react"
import MealChart from "./MealCharts"

import styles from '../styles/Home.module.css'
import { Meal } from "../models/Meal"

const Entries = ({history}:{history:{meals:Meal[]}}) => {
    // selected: hash map representation of what's selected
    // updates when history is changed in parent (LoggedIn)
    const [selected,setSelected] = useState([false])
    const [chartData, setChartData] = useState("")

    useEffect(()=>{
        // Need to update seleted to array of falses
        setSelected(Array.from({length:history?.meals.length},(_v,_i)=>false))
    },[history])

    const CheckBox = ({index,meal}:{index:number,meal:Meal}) => {
        // Access history.meals array for each individual meal
        const cost = () => {

            return {
                
            }
        }
        const costs = cost();

        return(                    
            <div>
                <input type="checkbox" id="PastMealSelect"
                    name="PastMealSelect" checked={selected[index]} onChange={()=>toggleCheckbox(index)} /> 
                <div>{history?.meals.length > index && String(new Date(history.meals[index].createdOn.seconds * 1000))}</div>
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
                <div className={styles.history}>
                    {//Display a checkbox for each Meal a user has created
                        history?.meals.map((meal,index)=>{
                            return <CheckBox key={String(meal.createdOn)} index={index} meal={meal}></CheckBox>
                        })
                    }
                </div>
                <div className={styles.flexColumn} 
                    style={{margin:7,padding:10,
                    background:'#fefefe',alignItems:'center'}}>
                    <MealChart userMeal={{}as Meal}></MealChart>
                </div>
        </div>
    )
}
export default Entries