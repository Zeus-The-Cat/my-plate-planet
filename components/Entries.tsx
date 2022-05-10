import { useEffect, useState } from "react";
import MealChart from "./MealCharts";

import styles from "../styles/Home.module.css";
import { Meal, MealItemCost, MealItem } from "../models/Meal";
import { AddMeal } from "./AddMeal";
import { getDataset } from "../utils/dataset";
import {
  ConsumptionByClass,
  ConsumptionByItem,
  ConsumptionStats,
} from "../models/ConsumptionStats";

const Entries = ({
  setHistory,
  history,
  addingMeal,
  setAddingMeal,
}: {
  history: { meals: Array<Meal> };
  setHistory: any;
  addingMeal: boolean;
  setAddingMeal: any;
}) => {
  // selected: hash map representation of what's selected
  //   updates when history is changed in parent (LoggedIn)
  const [selected, setSelected] = useState([false]);
  const [selectAll, setSelectAll] = useState(false);
  const [chartData, setChartData] = useState("");
  // state for AddMeal component
  const [sessionMeal, setSessionMeal] = useState({} as Meal);
  const [stats, setStats] = useState({} as ConsumptionStats);

  useEffect(() => {
    // Get meal item statistics from firestore db
    if (!stats.classes) {
      const handler = async () => {
        const res: ConsumptionStats = await getDataset(1);
        setStats(res);
      };
      handler();
    }
    // Need to update seleted, initialize no rows selected
    history.meals &&
      setSelected(
        Array.from({ length: history?.meals.length }, (_v, _i) => false)
      );
  }, [history, setStats, stats]);

  const mealData = (meal: Meal) => {
    // calculates total cost for a mealItem using ConsumptionStats
    const cost = (item_: MealItem) => {
      const targetClass = stats?.classes?.find((el: ConsumptionByClass) => {
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
          n: 0,
        } as ConsumptionByItem;
      }
      return {
        emissions: Math.round(
          (Number(targetItem.meanEmissions) / n) * item_.amount
        ),
        landUse: Math.round(
          (Number(targetItem.meanLandUse) / n) * item_.amount
        ),
        waterUse: Math.round((Number(targetItem.meanWater) / n) * item_.amount),
      };
    };
    let items: Array<MealItemCost> = [];
    let userMeal: Meal = meal;

    if (userMeal?.items) {
      for (let item of userMeal.items.values()) {
        items.push({
          name: item.name,
          type: item.type,
          createdOn: userMeal.createdOn,
          ...cost(item),
        });
      }
    }
    return items;
  };

  const getCost = (meal: Meal, type: string): number => {
    const items = mealData(meal);
    return items.reduce((prev, current) => {
      //@ts-ignore
      return prev + current[type];
    }, 0);
  };
  const CheckBoxHeader = () => {
    const toggleAll = (_e: any) => {
      const temp = !selectAll;
      setSelectAll(!selectAll);
      history.meals &&
        setSelected(
          Array.from({ length: history?.meals.length }, (_v, _i) => temp)
        );
    };
    return (
      <div style={{ paddingTop: 1 }}>
        <input
          type="checkbox"
          id="selectAll"
          name="selectall"
          checked={selectAll}
          onChange={toggleAll}
          style={{ paddingLeft: 10 }}
        />
        <div style={{ width: 115 }}>Date</div>
        <div style={{ width: 80 }}>Emissions</div>
        <div style={{ width: 80 }}>Land Use</div>
        <div style={{ width: 80 }}>Water Use</div>
      </div>
    );
  };
  const CheckBox = ({ index }: { index: number }) => {
    // Access history.meals array for each individual meal
    const dateFormat = (dateSeconds: number | undefined) => {
      const date =
        dateSeconds &&
        dateSeconds !== undefined &&
        new Date(dateSeconds * 1000);
      const darr = String(date)?.split(" ");
      return darr.slice(0, 4).join(" ");
    };
    return (
      <div>
        <input
          type="checkbox"
          id="PastMealSelect"
          name="PastMealSelect"
          checked={selected[index]}
          onChange={() => toggleCheckbox(index)}
        />
        <div style={{ width: 115 }}>
          {dateFormat(history?.meals[index]?.createdOn?.seconds)}
        </div>
        <div style={{ color: "#72bbdd", width: 80 }}>
          {getCost(history?.meals[index], "emissions")}
        </div>
        <div style={{ color: "#587c0c", width: 80 }}>
          {getCost(history?.meals[index], "landUse")}
        </div>
        <div style={{ color: "#296c7d", width: 80 }}>
          {getCost(history?.meals[index], "waterUse")}
        </div>
        {/* <button 
          onClick={()=>{
            console.log('Under Development')
          }} 
          className={styles.editButton}>Edit</button> */}
      </div>
    );
  };
  const toggleCheckbox = (index: number) => {
    let newSelected = selected;
    if (index < newSelected.length) {
      newSelected[index] = !newSelected[index];
      setSelected([...newSelected]);
    } else {
      console.error("Index out of bounds at HomeCard.toggleCheckbox()");
    }
  };

  return (
    <div className={styles.homeCardEntries}>
      {/* Left Portion*/}
      <div className={styles.history}>
        {addingMeal ? (
          <MealChart
            history={{ meals: [sessionMeal] }}
            selected={[true]}
          ></MealChart>
        ) : (
          <>
            <CheckBoxHeader></CheckBoxHeader>
            {history.meals &&
              history.meals.map((meal, index) => {
                return (
                  <CheckBox
                    key={String(meal.createdOn)}
                    index={index}
                  ></CheckBox>
                );
              })}
          </>
        )}
      </div>
      {/**Right Portion */}
      <div className={styles.secondPanel}>
        {addingMeal ? (
          <AddMeal
            history={history}
            setHistory={setHistory}
            setAddingMeal={setAddingMeal}
            setSessionMeal={setSessionMeal}
          ></AddMeal>
        ) : (
          <MealChart history={history} selected={selected}></MealChart>
        )}
      </div>
    </div>
  );
};
export default Entries;
