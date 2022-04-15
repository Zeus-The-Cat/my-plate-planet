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
    meals:Map<string,MealItem>,
    createdOn?: Date,
    updatedOn?: Date
}