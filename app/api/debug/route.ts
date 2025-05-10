import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from "@clerk/nextjs/server";

// Create a new instance of the client for debugging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function GET(request: NextRequest) {
  console.log('Debug API called');
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';
    
    // Check auth first
    const { userId } = await auth();
    console.log('Debug API - Auth userId:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    switch (action) {
      case 'status': {
        const dbConnection = await prisma.$queryRaw`SELECT 1 as status`;
        const applicationCount = await prisma.application.count();
        
        // Check if matches table exists by running a sample query
        let matchesTableStatus = 'unknown';
        try {
          await prisma.$queryRaw`SELECT COUNT(*) FROM matches`;
          matchesTableStatus = 'exists';
        } catch (e) {
          matchesTableStatus = 'not found or error';
        }
        
        // Get table list
        const tableList = await prisma.$queryRaw`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `;
        
        // Check current user's application
        const userApplication = await prisma.application.findUnique({
          where: { userId }
        });
        
        return NextResponse.json({
          status: 'ok',
          database: {
            connection: !!dbConnection,
            applicationCount,
            matchesTableStatus,
            tableList,
          },
          user: {
            hasApplication: !!userApplication,
            applicationData: userApplication ? {
              id: userApplication.id,
              skillLevel: userApplication.skillLevel,
              hackathonExperience: userApplication.hackathonExperience,
              selfDescription: userApplication.selfDescription,
            } : null
          }
        });
      }
      
      case 'matches': {
        // Get all matches for debugging
        const allMatches = await prisma.$queryRaw`
          SELECT * FROM matches
          LIMIT 100
        `;
        
        // Get current user's matches
        const userMatches = await prisma.$queryRaw`
          SELECT * FROM matches
          WHERE user_id_1 = ${userId} OR user_id_2 = ${userId}
        `;
        
        return NextResponse.json({
          status: 'ok',
          matches: {
            count: (allMatches as any[]).length,
            sample: allMatches,
            userMatches,
          }
        });
      }
      
      case 'applications': {
        // Get all applications for debugging
        const allApplications = await prisma.application.findMany({
          take: 10,
          select: {
            id: true,
            userId: true,
            fullName: true,
            skillLevel: true,
            hackathonExperience: true,
          }
        });
        
        return NextResponse.json({
          status: 'ok',
          applications: {
            count: await prisma.application.count(),
            sample: allApplications,
          }
        });
      }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
} 