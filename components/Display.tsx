import { useState, useEffect } from "react";
import { Meal } from "../models/Meal";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Land0 from "../public/Land0.png";
import Land1 from "../public/Land1.png";
import Land2 from "../public/Land2.png";
import Land3 from "../public/Land3.png";
import Land4 from "../public/Land4.png";
import Water0 from "../public/Water0.png";
// import Water1 from '../public/Water1.png';
// import Water2 from '../public/Water2.png';
// import Water3 from '../public/Water3.png';
// import Water4 from '../public/Water4.png';
import Backdrop from "../public/Backdrop.png";

// SVG based visualization of consumption use
export const Display = ({ auth, meal }: { auth: boolean; meal: Meal }) => {
  const landUseBreakpoints = [924, 2343, 3762, 5181, 6600];
  const waterUseBreakpoints = [968, 1532, 2097, 2662, 3227];
  const emissionUseBreakpoints = [3.11, 4.92, 6.73, 8.55, 10.36];
  const [landPng, setLandPng] = useState(Land0);
  const [waterPng, setWaterPng] = useState(Water0);
  const [emissions, setEmissions] = useState(0);

  // const tS = () => {
  //   setLand((land+1)%4)
  // }

  // toggle info about current use case
  const Visualization = () => {
    // Users consumption cost over time
    return (
      <>
        <span style={{ display: "block", visibility: "hidden" }}>
          <Image
            src={Backdrop}
            alt="Ignore: used to display reactivity"
            width="1000"
            height="300"
            layout="responsive"
            sizes="(max-width: 800) 600)"
          ></Image>
        </span>
        <span className={styles.temporalImageContainer}>
          <Image
            src={Backdrop}
            placeholder="blur"
            alt="Climate Impact Visualization city clouds oceans"
            width="1000"
            height="300"
            layout="responsive"
            sizes="(max-width: 800) 600)"
          ></Image>
        </span>
        <span className={styles.temporalImageContainer}>
          <Image
            src={waterPng}
            placeholder="blur"
            alt="Climate Impact Visualization river"
            width="1000"
            height="300"
            layout="responsive"
            sizes="(max-width: 800) 600)"
          ></Image>
        </span>
        <span className={styles.temporalImageContainer}>
          <Image
            src={landPng}
            placeholder="blur"
            alt="Climate Impact Visualization Trees"
            width="1000"
            height="300"
            layout="responsive"
            sizes="(max-width: 800) 600)"
          ></Image>
        </span>
        {/* <button style={{position:'absolute'}} onClick={tS}>iterate</button> */}
      </>
    );
  };
  return (
    <div className={styles.visualization}>
      <Visualization></Visualization>
    </div>
  );
};
