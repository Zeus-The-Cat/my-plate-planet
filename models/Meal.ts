export interface MealCost{
    name:string,
    type:string,
    emissions:number,
    landUse: number,
    waterUse: number,
}

export interface MealItem{
    name:string,
    type:string,
    amount:number,
    unit:string
}
export interface Meal{
    items:Map<string,MealItem>,
    createdOn?: {nanoseconds:number,seconds:number},
    updatedOn?: {nanoseconds:number,seconds:number}
}