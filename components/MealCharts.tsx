import React, { PureComponent,useEffect } from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDataset } from '../utils/dataset';
import {ConsumptionByItem, ConsumptionByClass, ConsumptionStats} from '../models/ConsumptionStats'
import { Meal, MealItem,MealCost } from '../models/Meal';

// Need to use class style for ReCharts
class MealChart extends PureComponent<
    {history:{ meals:Array<Meal> }},
    {promise:any,data:any,active:string,results:any}> {
    
    constructor(props:any){
        super(props)
        const handler = async () =>{ // Calculate meal's contribution
            const res = await getDataset(1)
            if(res){
                return res
            }else{
                return null
            }  
        }
        this.state = {
            promise:handler(),
            data:{},
            active:"emissions",
            results:{}
        }
    }

    mealData(res:ConsumptionStats){
        // calculates total cost for a mealItem using ConsumptionStats
        const cost = (item_:MealItem) => {
            const type = res.classes.find((el:ConsumptionByClass)=>{
                return el.name == item_.type
            })
            const targetItem = type?.items.find((el2:ConsumptionByItem)=>{
                return el2.name == item_.name
            })
            return {
                emissions:Math.round(item_.amount * Number(targetItem?.meanEmissions)),
                landUse:Math.round(item_.amount * Number(targetItem?.meanLandUse)),
                waterUse:Math.round(item_.amount * Number(targetItem?.meanWater))
            }
        }
        let items:Array<MealCost> = []
        let userMeal = this.props.history?.meals && this.props.history.meals[0]

        if(userMeal?.items){
            for (let item of userMeal.items.values()){
                items.push({
                    name:item.name,
                    type:item.type,
                    ...cost(item)
                })
            }
        }
       return items
    }

    // component initialized
    componentDidMount(){
        
        //@ts-ignore ReadOnly<> ts issue
        this.state.promise.then((result:ConsumptionStats)=>{
            this.setState({
                data:this.mealData(result),
                results:result})
        })
    }
    // on each rerender check if userMeal changed
    componentDidUpdate(prevProps:any){
        if(prevProps.history != this.props.history){
            this.setState({
                data:this.mealData(this.state.results)})
        }
    }
    // 
    renderLine(){
        if(this.state.active == "emissions"){
            return <Bar type="monotone" dataKey="emissions" fill="#8884d8" strokeWidth={2} />
        }else if(this.state.active == "landUse"){
            return <Bar type="monotone" dataKey="landUse" fill="#d88484" strokeWidth={2} />
        }else if(this.state.active == "waterUse"){
            return <Bar type="monotone" dataKey="waterUse" fill="#3f23b1" strokeWidth={2} />
        }
    }

  render() {
    return (
        <>
            <form>
                <label htmlFor="metric">
                    <select name="food-item" id="food-item"
                        onChange={(e)=>{
                            this.setState({active:e.target.value})
                        }}>
                        <option value={"emissions"}>Emissions</option>
                        <option value={"landUse"}>Land Use</option>
                        <option value={"waterUse"}>Water Use</option>
                    </select>
                </label>
             </form>
            <div style={{height:'100%',width:'100%'}}>
                <ResponsiveContainer width="100%" height="100%">
                    {/* @ts-ignore */}
                    <BarChart width={300} height={100} data={this.state.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" scale="band" />
                        <YAxis type="number" domain={[0,'auto']} />
                        <Tooltip />
                        <Legend />
                        {this.renderLine()}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
        </>
    );
  }
}

export default MealChart