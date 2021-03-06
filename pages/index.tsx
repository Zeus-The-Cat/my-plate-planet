import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { AddMeal } from "../components/AddMeal";
import { Header } from "../components/Header";
import { Display } from "../components/Display";
import MealChart from "../components/MealCharts";
import { Meal } from "../models/Meal";
import Login from "../components/Login";
import { Modal } from "../components/Modal";
import { MealHistory } from "../components/MealHistory";
import HomeCard from "../components/HomeCard";
import { ConsumptionStats } from "../models/ConsumptionStats";

const Home: NextPage = () => {
  const [auth, setAuth] = useState(false);
  const [addingMeal, setAddingMeal] = useState(false);
  const [parentMeal, setParentMeal] = useState({} as Meal);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(<div>Loading Modal...</div>);
  const [stats, setStats] = useState({} as ConsumptionStats);

  return (
    <>
      {modal && (
        <Modal modal={modal} setModal={setModal}>
          {modalContent}
        </Modal>
      )}
      <div className={styles.container}>
        <Head>
          <title>Sustainable Diet App</title>
          <meta
            name="description"
            content="A web application for logging dietary impact on green house gases, land use, and water scarcity."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header setModal={setModal} setModalContent={setModalContent}></Header>

        <main className={styles.main}>
          <Display auth={auth} meal={parentMeal}></Display>
          <HomeCard></HomeCard>
        </main>
      </div>
    </>
  );
};

export default Home;
