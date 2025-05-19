import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Helper function to convert snake_case to camelCase
function toCamelCase(data: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  });
  
  return result;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { action: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const action = params.action;
    const data = await request.json();

    console.log(`API POST received: action=${action}, userId=${userId}`);
    console.log('Request data:', data);

    switch (action) {
      case 'submit': {
        console.log('Processing submit action');
        // Convert data from snake_case to camelCase
        const camelCaseData = toCamelCase(data);
        console.log('Converted to camelCase:', camelCaseData);
        
        // Save and submit the application in one step
        const submittedApplication = await prisma.application.upsert({
          where: { user_id: userId },
          update: {
            ...camelCaseData,
            status: 'submitted',
            updated_at: new Date(),
          },
          create: {
            user_id: userId,
            ...camelCaseData,
            status: 'submitted',
            created_at: new Date(),
            updated_at: new Date(),
          }
        });
        
        console.log('Application submitted successfully:', submittedApplication);
        return NextResponse.json({ 
          success: true, 
          application: submittedApplication 
        });
      }
      
      case 'confirm-attendance': {
        const updatedApplication = await prisma.application.update({
          where: { user_id: userId },
          data: {
            status: 'confirmed',
            updated_at: new Date(),
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          application: updatedApplication 
        });
      }
      
      case 'decline-attendance': {
        const updatedApplication = await prisma.application.update({
          where: { user_id: userId },
          data: {
            status: 'waitlisted',
            updated_at: new Date(),
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          application: updatedApplication 
        });
      }
      


      default:
        console.log(`Invalid action: ${action}`);
        return NextResponse.json(
          { error: 'Invalid action' }, 
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('API error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { action: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }
    const params = await context.params;
    const { action } = params;
    console.log(`API GET received: action=${action}, userId=${userId}`);

    switch (action) {
      case 'get': {
        const application = await prisma.application.findUnique({
          where: { user_id: userId }
        });
        
        console.log('Retrieved application:', application);
        return NextResponse.json({ 
          success: true, 
          application: application || null
        });
      }
      
      case 'get-all': {
        console.log('Retrieving all applications');
        try {
          const applications = await prisma.application.findMany({
            where: {
              status: 'submitted'
            }
          });
          
          console.log(`Retrieved ${applications.length} applications`);
          
          return NextResponse.json({ 
            success: true,
            timestamp: new Date().toISOString(),
            applications 
          });
        } catch (error: any) {
          console.error('Error retrieving applications:', error);
          return NextResponse.json(
            { success: false, error: error.message }, 
            { status: 500 }
          );
        }
      }
      
      default:
        console.log(`Invalid GET action: ${action}`);
        return NextResponse.json(
          { error: 'Invalid action' }, 
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('API GET error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
} 