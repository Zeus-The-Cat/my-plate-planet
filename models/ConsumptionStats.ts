export interface ConsumptionByItem{
    name:string,
    meanEmissions: number,
    meanLandUse : number,
    meanWater: number
}
export interface ConsumptionByClass{
    name:string,
    n:number,
    unit:string,
    items:ConsumptionByItem[]
}
export interface ConsumptionStats{
    classes:ConsumptionByClass[]
}