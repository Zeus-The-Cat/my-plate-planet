export interface ConsumptionStats {
  classes: ConsumptionByClass[];
}
// string|number typing necessary for firebase
export interface ConsumptionByClass {
  name: string;
  n: string | number;
  unit: string;
  items: ConsumptionByItem[];
}
export interface ConsumptionByItem {
  name: string;
  meanEmissions: string | number;
  meanLandUse: string | number;
  meanWater: string | number;
  n: string | number;
}
