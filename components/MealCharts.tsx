import React, { PureComponent,useEffect } from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDataset } from '../utils/dataset';
import {ConsumptionByItem, ConsumptionByClass, ConsumptionStats} from '../models/ConsumptionStats'
import { Meal, MealItem,MealCost } from '../models/Meal';
// Need to use class style for ReCharts
class MealChart extends PureComponent {
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
            active:"emissions"
        }
    }

    testMeal:Meal = {
        meals: new Map([
            ['id1',{
                name:'Cheese',type:'Protein',amount:10,unit:'g'
            }as MealItem],
            ['id2',{
                name:'Milk',type:'Milks',amount:10,unit:'Liter'
            }as MealItem],
            ['id3',{
                name:'Cassava',type:'Starch Rich',amount:15,unit:'kcal'
            }as MealItem],
            ['id4',{
                name:'Palm Oil',type:'Oils',amount:5,unit:'Liter'
            }as MealItem],
            ['id5',{
                name:'Berries',type:'Fruits',amount:2,unit:'kg'
            }as MealItem],
        ]),
    }

    mealEmissions(res:ConsumptionStats){
        // for each in testMeal amount * meanEmission... 
        const cost = (item_:MealItem) => {
            const type = res.classes.find((el:ConsumptionByClass)=>{
                return el.name == item_.type
            })
            const targetItem = type?.items.find((el2:ConsumptionByItem)=>{
                return el2.name == item_.name
            })
            return {
                emissions:item_.amount * Number(targetItem?.meanEmissions),
                landUse:item_.amount * Number(targetItem?.meanLandUse),
                waterUse:item_.amount * Number(targetItem?.meanWater)}
        }

        let items:Array<MealCost> = []
        for (let item of this.testMeal.meals.values()){
            items.push({
                name:item.name,
                type:item.type,
                ...cost(item)
            })
        }
        console.log(items)
       return items
    }
    componentDidMount(){
        //@ts-ignore ReadOnly<> ts issue
        this.state.promise.then((result:ConsumptionStats)=>{
            this.setState({data:this.mealEmissions(result)})
        })
    }
    renderLine(){
        //@ts-ignore
        if(this.state.active == "emissions"){
            return <Bar type="monotone" dataKey="emissions" fill="#8884d8" strokeWidth={2} />
        //@ts-ignore
        }else if(this.state.active == "landUse"){
            return <Bar type="monotone" dataKey="landUse" fill="#d88484" strokeWidth={2} />
        //@ts-ignore
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
            <div style={{height:'20vw',width:'80vw'}}>
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