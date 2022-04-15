import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { AddMeal } from '../components/AddMeal'
import { Header } from '../components/Header'
import { Display } from '../components/Display'
import  MainStats  from '../components/Charts'
import MealChart from '../components/MealCharts'

const Home: NextPage = () => {
  const [auth, setAuth] = useState(false)
  const [addingMeal, setAddingMeal] = useState(false)
  return (
    <div className={styles.container}>
      <Head>
        <title>Sustainable Diet App</title>
        <meta name="description" content="A web application for logging dietary impact on green house gases, land use, and water scarcity." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header auth={auth} setAuth={setAuth}></Header>
      <main className={styles.main}>
        <Display auth={auth}></Display>
          {addingMeal?<AddMeal setAddingMeal={setAddingMeal}></AddMeal>: <button onClick={()=>{setAddingMeal(true)}}>Add Meal</button>}
        <MainStats></MainStats>
        <MealChart></MealChart>
      </main>
    </div>
  )
}

export default Home
