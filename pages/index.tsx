import Link from 'next/link'
import { NextPage } from 'next'
import { Inter } from '@next/font/google'
import styles from '../styles/App.module.css'

import {Flight, Trip} from "../types"
import { GetStaticProps } from 'next'
import Api from '../api'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  // trips: Trip[]
  origins: Flight["origin"][]
}


export const getStaticProps: GetStaticProps<Props> = async () => {
  const origins = await Api.origin.list()
  return {
      props: {
          origins
      } 
  }
}

const Home: NextPage<Props> = ({origins}) => {
  console.log(origins)
  
  return (
    <div className={styles.grid}>
      {origins.map( origin => (
        <Link key={origin} href={`/${origin}`}>
          <span className={styles.card}>
            <h2>{origin} &rarr;</h2>
          </span>
        </Link>
      ))}
    </div>
  )
}

export default Home