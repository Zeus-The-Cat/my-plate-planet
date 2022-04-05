import { useState, useEffect,useRef } from "react"

// pass setFoodItem through props to receive
export const MealSelector = ({setFoodItem,items}:{setFoodItem:any,items:any}) => {
    const [selected, setSelected] = useState('')
    const [amount, setAmount] = useState(0)
    const [unit, setUnit] = useState('')
    const [type, setType] = useState('')

    const selectRef  = useRef<HTMLSelectElement>(null);

    // Units
    useEffect(()=>{
        setUnit('g')
        setType('Protein')
    },[])

    useEffect(()=>{
        // Allows parent component access to amount and unit
        const setParentValue = () => {
            if(setFoodItem){
                // Acces selected option then it's parent to access type
                setFoodItem({amount:amount,unit:unit,type:type,name:selected})
            }
        }
        setParentValue();
    },[amount,unit,setFoodItem,selected,type])

    const getUnit = (name:string) => {
        items?.FoodItems?.forEach((each:any)=>{
            if(each.names.includes(name)){
                setUnit(each.unit)
            }
        })
        setAmount(0)
        setType(selectRef?.current?.selectedOptions[0]?.parentElement?.label)
    }


    // Options dropdown menu
    const optionGroups = (jsonObj:any) =>{
        if(jsonObj.FoodItems){
            return (
                jsonObj.FoodItems.map((value:any,i:number)=>{
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
            )
        }
        return(<></>)
    }

    // Form Changes
    const handleChange = (event) => {
        setSelected(event.target.value)
        getUnit(event.target.value)
    }
    const handleAmount = (event) => {
        setAmount(Number(event.target.value))
    }
    const handleSubmit = (event) => {
        console.log(event.target.value);
    }
  return (
    <form>
        <label htmlFor="food-item">Choose a Food Item&#160;
            <select value={selected} ref={selectRef}
                onChange={handleChange}
                name="food-item" id="food-item">
                {optionGroups(items)}
            </select>
            <input type="text" name="food-quantity" 
                value={amount}
                onChange={handleAmount}
                onSubmit={handleSubmit}
            />
            &#160;{unit}
        </label>
    </form>
  )

}