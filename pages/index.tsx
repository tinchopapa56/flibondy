import Link from 'next/link'
import { NextPage } from 'next'
import { Inter } from '@next/font/google'
import styles from '../styles/App.module.css'

import {Flight, Trip} from "../types"
import { GetStaticProps } from 'next'
import Api from '../api'

import { Flex, Container, Heading, Stack, Text, Button, Icon, IconProps,} from '@chakra-ui/react';
import Home2 from '../Home2'


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
  
  return <Home2 origins={origins}/> 
}

export default Home