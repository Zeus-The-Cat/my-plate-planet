import { useEffect, useState } from "react";

const Calendar = ({dateState}:{dateState:{date:string,setDate:Function}}) => {
  
    const handleChange = (e:any) => {
        dateState.setDate(e.target.value)
    }

    return( 
    <form>
        <label htmlFor="date-range">
            <input type="date" id="Display-Date"
                name="date" value={dateState.date} onChange={handleChange}/>
        </label>
    </form>)
}

export default Calendar