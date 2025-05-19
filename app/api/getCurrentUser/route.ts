import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function GET() {
  const user = await currentUser()
  if (!user) {
    return { props: {} }
  }
  const user_id = await prisma.application.findUnique({
    where: {
      user_id: user.id
    }
  })
  // console.log("User ID:", user_id)
  return NextResponse.json(user_id || {})
}