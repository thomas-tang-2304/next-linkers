'use server'
 
import { cookies } from 'next/headers'
 
export async function create(pathname: string, data: string) {
  cookies().set(pathname, data, { secure: true })
  
}

export async function get(pathname: string): Promise<any> {
  return cookies().get(pathname)
  
}