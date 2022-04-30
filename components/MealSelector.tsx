/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect,useRef } from "react"
import { MealItem } from "../models/Meal"

// pass setFoodItem through props to receive
export const MealSelector = (
    {setRows,items,ukey,rows}:
    {setRows:any,items:any,ukey:string,rows:Map<string,MealItem>}) => {
    const [selected, setSelected] = useState('')
    const [amount, setAmount] = useState(0)
    const [unit, setUnit] = useState('')
    const [type, setType] = useState('')

    const selectRef  = useRef<HTMLSelectElement>(null);

    // Default Unit and Type
    useEffect(()=>{
        setSelected('Beef (dairy herd)')
        setUnit('g')
        setType('Protein')
    },[])

    useEffect(()=>{
        // Allows parent component access to amount and unit
        const setParentValue = () => {
            if(setRows){
                // Acces selected option then it's parent to access type
                let newRows = new Map()
                rows.forEach((value,k)=>{
                    newRows.set(k,value);
                })
                newRows.set(ukey,{
                    amount:amount,
                    unit:unit,
                    type:type,
                    name:selected})
                setRows(newRows)
            }
        }
        setParentValue();
    },[amount,unit,setRows,selected,type])

    const getUnit = (name:string) => {
        items?.forEach((each:any)=>{
            if(each.names.includes(name)){
                setUnit(each.unit)
            }
        })
        setAmount(0)
        //@ts-ignore
        setType(selectRef?.current?.selectedOptions[0]?.parentElement?.label)
    }

    // Options dropdown menu
    const optionGroups = (jsonObj:any) =>{
        if(jsonObj){
            return Array.from(jsonObj).map((value:any,i:number)=>{
                    let options = value.names
                    return(
                        <optgroup label={value.type} key={i+value.type}>
                            {
                                options.map((value2:string,i2:number)=>{
                                    return(
                                        <option value={value2} key={i2+value2}>{value2}</option>
                                    )
                                })
                            }
                        </optgroup>
                    )
                })
        }
        return(<></>)
    }

    // Form Changes
    const handleChange = (event:any) => {
        setSelected(event.target.value)
        getUnit(event.target.value)
    }
    const handleAmount = (event:any) => {
        setAmount(event.target.value)
    }

  return (
    <form>
        <label htmlFor="food-item">Choose a Food Item&#160;
            <select value={selected} ref={selectRef}
                onChange={handleChange}
                name="food-item" id="food-item">
                {optionGroups(items)}
            </select>
            <input type="text" name="food-quantity" inputMode="numeric"
                value={amount} step="0.01" pattern="[-+]?[0-9]*[.,]?[0-9]+"
                onChange={handleAmount} min="0"
            />
            &#160;{unit}
        </label>
    </form>
  )

}