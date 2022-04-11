import React, { PureComponent,useEffect } from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

import {ConsumptionByItem} from '../models/ConsumptionStats'

export default class MainStats extends PureComponent {
    constructor(props:any){
        super(props)
        const handler = async () =>{ // Calculate meal's contribution
            const res = await axios.get('/api/dataset');
            if(res.data.statistics){
                return res.data.statistics
            }else{
                return null
            }  
        }
        this.state = {
            promise:handler(),
            data:{},
            active:"meanEmissions"
        }
        
    }
    transformData(res:any){
        // Join Arrays of data at res.classes[].items
        const stageOne =  res.classes.reduce((prev:any,current:any)=>{
            return prev.concat(current.items)
        },[])
        stageOne.forEach((item:ConsumptionByItem)=>{
            item.meanEmissions = parseFloat(String(item.meanEmissions));
            item.meanLandUse = parseFloat(String(item.meanLandUse));
            item.meanWater = parseFloat(String(item.meanWater));
        })
       return stageOne
    }
    componentDidMount(){
        //@ts-ignore
        this.state.promise.then((result:any)=>{
            this.setState({data:this.transformData(result)})
        })
    }
    renderLine(){
        //@ts-ignore
        if(this.state.active == "meanEmissions"){
            return <Bar type="monotone" dataKey="meanEmissions" fill="#8884d8" strokeWidth={2} />
        //@ts-ignore
        }else if(this.state.active == "meanLandUse"){
            return <Bar type="monotone" dataKey="meanLandUse" fill="#d88484" strokeWidth={2} />
        //@ts-ignore
        }else if(this.state.active == "meanWater"){
            return <Bar type="monotone" dataKey="meanWater" fill="#3f23b1" strokeWidth={2} />
        }
    }

  render() {
    return (
        <>
            <form>
                <label htmlFor="metric">
                    <select 
                        onChange={(e)=>{
                            this.setState({active:e.target.value})
                        }}
                        name="food-item" id="food-item">
                        <option value={"meanEmissions"}>Mean Emissions</option>
                        <option value={"meanLandUse"}>Mean Land Use</option>
                        <option value={"meanWater"}>Mean Water Use</option>
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
