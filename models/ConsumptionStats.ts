export interface ConsumptionByItem{
    name:string,
    meanEmissions: string|number,
    meanLandUse : string|number,
    meanWater: string|number
}
export interface ConsumptionByClass{
    name:string,
    n:string|number,
    unit:string,
    items:ConsumptionByItem[]
}
export interface ConsumptionStats{
    classes:ConsumptionByClass[]
}