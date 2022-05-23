import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getDataset } from "../utils/dataset";
import {
  ConsumptionByItem,
  ConsumptionByClass,
  ConsumptionStats,
} from "../models/ConsumptionStats";
import { Meal, MealCost, MealItem, MealItemCost } from "../models/Meal";
import styles from "../styles/Home.module.css";

// Need to use class style for ReCharts
// Dynamically switches between individual meal graph <-> day-by-day comparison
class MealChart extends PureComponent<
  { history: { meals: Array<Meal> }; selected: Array<boolean> },
  {
    promise: any;
    mealCost: Array<MealItemCost>;
    historyCost: Array<MealCost>;
    active: string;
    statistics: ConsumptionStats;
  }
> {
  constructor(props: any) {
    super(props);
    const handler = async () => {
      // Calculate meal's contribution
      const res = await getDataset(1);
      if (res) {
        return res;
      } else {
        return null;
      }
    };
    this.state = {
      promise: handler(),
      mealCost: [] as Array<MealItemCost>,
      historyCost: [] as Array<MealCost>,
      active: "emissions",
      statistics: {} as ConsumptionStats,
    };
  }

  mealData(res: ConsumptionStats, targetMeal?: number) {
    // calculates total cost for a mealItem using ConsumptionStats
    const cost = (item_: MealItem) => {
      const targetClass = res?.classes?.find((el: ConsumptionByClass) => {
        return el.name == item_.type;
      });

      // save n and targeted ConsumptionByItem object
      let n: number = targetClass?.n ? Number(targetClass.n) : 1;
      if (targetClass?.unit == "kg") {
        n = n * 1000;
      }
      let targetItem: ConsumptionByItem | undefined = targetClass?.items?.find(
        (el2: ConsumptionByItem) => {
          return el2.name == item_.name;
        }
      );
      if (!targetItem) {
        targetItem = {
          meanEmissions: 0,
          meanLandUse: 0,
          meanWater: 0,
          name: " ",
        } as ConsumptionByItem;
      }
      return {
        emissions: +(
          (Number(targetItem.meanEmissions) / n) *
          item_.amount
        ).toFixed(2),
        landUse: +((Number(targetItem.meanLandUse) / n) * item_.amount).toFixed(
          2
        ),
        waterUse: +((Number(targetItem.meanWater) / n) * item_.amount).toFixed(
          2
        ),
      };
    };

    if (targetMeal === undefined) {
      targetMeal = this.props.selected?.reduce(
        (prev, current, currentIndex) => {
          return current ? currentIndex : prev;
        },
        0
      );
    }
    let userMeal = {} as Meal;
    if (this.props.history?.meals && this.props.selected[targetMeal]) {
      userMeal = this.props.history.meals[targetMeal];
    }
    let mealCost: Array<MealItemCost> = [];
    if (userMeal?.items) {
      for (let item of userMeal.items.values()) {
        // Need to join duplicates, as two of the same x-value breaks recharts
        let ind;
        mealCost?.filter((mic: MealItemCost, i: number) => {
          ind = mic.name == item.name && i;
          return mic.name == item.name;
        });
        if (ind) {
          let { emissions, landUse, waterUse } = cost(item);
          mealCost[ind].emissions += emissions;
          mealCost[ind].landUse += landUse;
          mealCost[ind].waterUse += waterUse;
        } else {
          mealCost.push({
            name: item.name,
            type: item.type,
            createdOn: userMeal.createdOn,
            ...cost(item),
          });
        }
      }
    }
    return mealCost;
  }

  historyData(res: ConsumptionStats) {
    const dateFormat = (dateSeconds: number | undefined) => {
      if (dateSeconds == undefined) {
        return "";
      }
      const date =
        dateSeconds &&
        dateSeconds !== undefined &&
        new Date(dateSeconds * 1000);
      const darr = String(date)?.split(" ");
      return darr.slice(0, 4).join(" ");
    };
    let hd = [] as Array<MealCost>;
    this.props.selected &&
      this.props.selected.forEach((checked, index) => {
        if (checked) {
          let md = this.mealData(res, index);
          let e = 0,
            lu = 0,
            wu = 0,
            co = "";
          md &&
            md.forEach((mic: MealItemCost) => {
              if (!co) {
                co = dateFormat(mic?.createdOn?.seconds);
              }
              e += mic.emissions;
              lu += mic.landUse;
              wu += mic.waterUse;
            });
          // Combine meals of the same day
          let addedFlag = false;
          for (let i in hd) {
            if (hd[i].createdOn == co) {
              hd[i].emissions += +e.toFixed(2);
              hd[i].landUse += +lu.toFixed(2);
              hd[i].waterUse += +wu.toFixed(2);
              addedFlag = true;
              break;
            }
          }

          !addedFlag &&
            hd.push({
              createdOn: co,
              emissions: +e.toFixed(2),
              landUse: +lu.toFixed(2),
              waterUse: +wu.toFixed(2),
            } as MealCost);
        }
      });

    return hd;
  }

  // component initialized
  componentDidMount() {
    // set state equal to database response
    this.state.promise.then((result: ConsumptionStats) => {
      this.setState({
        mealCost: this.mealData(result),
        historyCost: this.historyData(result),
        statistics: result,
      });
    });
  }
  // On each rerender check if userMeal changed, can't use hooks in class components
  componentDidUpdate(prevProps: any) {
    if (
      prevProps.history != this.props.history ||
      prevProps.selected != this.props.selected
    ) {
      this.setState({
        mealCost: this.mealData(this.state.statistics),
        historyCost: this.historyData(this.state.statistics),
      });
    }
  }

  renderLine() {
    if (this.state.active == "emissions") {
      return (
        <Bar
          type="monotone"
          dataKey="emissions"
          fill="#72bbdd"
          strokeWidth={2}
        />
      );
    } else if (this.state.active == "landUse") {
      return (
        <Bar type="monotone" dataKey="landUse" fill="#587c0c" strokeWidth={2} />
      );
    } else if (this.state.active == "waterUse") {
      return (
        <Bar
          type="monotone"
          dataKey="waterUse"
          fill="#296c7d"
          strokeWidth={2}
        />
      );
    }
  }

  mealBarChart() {
    return (
      <BarChart width={300} height={100} data={this.state.mealCost}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" scale="band" />
        <YAxis type="number" domain={[0, "auto"]} />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Legend />
        {this.renderLine()}
      </BarChart>
    );
  }

  historyAreaChart() {
    function renderGradient(active: string) {
      //@ts-ignore
      // return(<>
      //             <Area type="monotone" dataKey="emissions" stroke="#add8e6" dot={true} fillOpacity={0.8} fill="url(#colorEmissions)" />
      //             <Area type="monotone" dataKey="landUse" stroke="#82ca9d" dot={true} fillOpacity={0.8} fill="url(#colorLand)" />
      //             <Area type="monotone" dataKey="waterUse" stroke="#8884d8" dot={true} fillOpacity={0.8} fill="url(#colorWater)" />
      // </>)
      if (active == "emissions") {
        return (
          <Area
            type="monotone"
            dataKey="emissions"
            stroke="#add8e6"
            dot={true}
            fillOpacity={1}
            fill="url(#colorEmissions)"
          />
        );
      } else if (active == "landUse") {
        return (
          <Area
            type="monotone"
            dataKey="landUse"
            stroke="#82ca9d"
            dot={true}
            fillOpacity={1}
            fill="url(#colorLand)"
          />
        );
      } else if (active == "waterUse") {
        return (
          <Area
            type="monotone"
            dataKey="waterUse"
            stroke="#8884d8"
            dot={true}
            fillOpacity={1}
            fill="url(#colorWater)"
          />
        );
      }
    }

    return (
      <AreaChart
        width={730}
        height={250}
        data={this.state.historyCost}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorLand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#add8e6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#add8e6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="createdOn" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        {renderGradient(this.state.active)}
      </AreaChart>
    );
  }
  render() {
    return (
      <>
        <form className={styles.flex} style={{ marginTop: 10 }}>
          <label htmlFor="metric">
            <select
              name="food-item"
              id="food-item"
              onChange={(e) => {
                this.setState({ active: e.target.value });
              }}
            >
              <option value={"emissions"}>Emissions</option>
              <option value={"landUse"}>Land Use</option>
              <option value={"waterUse"}>Water Use</option>
            </select>
          </label>
        </form>
        <div className={styles.mealChart}>
          <ResponsiveContainer width="100%" height="100%">
            {this.state.historyCost.length > 1
              ? this.historyAreaChart()
              : this.mealBarChart()}
          </ResponsiveContainer>
        </div>
      </>
    );
  }
}

export default MealChart;
