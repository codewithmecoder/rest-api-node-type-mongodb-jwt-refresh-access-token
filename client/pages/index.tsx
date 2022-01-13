import axios from 'axios';
import type { GetServerSideProps, NextPage, } from 'next';
import Image from 'next/image';

import useSwr from 'swr';
import {useEffect, useState} from 'react'
import styles from '../styles/Home.module.css'
import fetcher from '../utils/fetcher';
import getGoogleOauthUrl from '../utils/getGoogleOauthUrl';

interface User {
  _id: string;
  email: string;
  name: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
  session: string;
  iat: number;
  exp: number;
}


const Home: NextPage<{fallbackData: User}> = ({fallbackData}) => {
  const {data} = useSwr<User | null>(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
  fetcher,
  {fallbackData}
  )
  if(data){
    return (
      <div>
        Welcome <span className='red'>{data.name}</span>
        <Image
          src={data.picture}
          alt="Picture of the author"
          width={20}
          height={20}
        />  
      </div>)
  }
  return (
    <div className={styles.container}>

      <div className=''>
        <a href={getGoogleOauthUrl()}>Login with google</a>
      </div>

      <p>Please login</p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async(context) => {

  const data = await fetcher(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
  context.req.headers
  );
  return {props: {fallbackData: data}};
  
}


export default Home;

