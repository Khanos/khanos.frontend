import React, { useCallback, useEffect } from 'react';
import styles from '@/styles/Exp.module.css';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { expItemType} from '@/store/types';
import { setLoading } from '@/store/slices/MainSlice';
import { setExpData } from '@/store/slices/ExpSlice';
import ExpCard from './ExpCard';

export default function ExpContent(){
  const dispatch = useAppDispatch();
  const exp = useAppSelector((state) => state.exp.exp);
  const expData = useAppSelector((state) => state.exp.exp.data);

  const getExpData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`/api/experience`);
      const { data, error } = await response.json();
      if (error) throw new Error('Error fetching experience data');
      console.log(data);
      dispatch(setExpData(data));
     } catch (error) {
      
     } finally {
       dispatch(setLoading(false));
     }
  }, [dispatch]);

  useEffect(() => {
    if(expData.length === 0) getExpData();
  }, [expData, getExpData]);

  return (
    <section className={styles['section-container']}>
       {exp.data.length > 0 ? 
        exp.data.map((item: expItemType, index: number) => (
          <ExpCard key={index} item={ item } />
        ))
        : (
          <div className="loading">
            <h1>Loading...</h1>
          </div>
        )
      }
    </section>
  )
}