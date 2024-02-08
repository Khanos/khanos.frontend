import type { NextApiRequest, NextApiResponse } from 'next';
import experienceData from '@/data/experience.json';

type Data = {
  name: string,
  error: boolean,
  message: string,
  data?: any,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    res.status(200).json({ 
      name: 'experience',
      error: false,
      message: 'Success',
      data: experienceData,
    })
  } catch (err: any) {
    res.status(500).json({
      name: 'experience',
      error: true,
      message: `An error occurred: ${err.message}`,
    })
  }
  res.status(200).json({ 
    name: 'experience',
    error: false,
    message: 'Success',
  })
}