import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a new instance of the client to ensure it has the updated schema
const prisma = new PrismaClient();

// Define match interface
interface Match {
  id: number;
  user_id_1: string;
  user_id_2: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    console.log(`GET API request: action=${action}`);
    
    // Fast test connection endpoint doesn't require userId
    if (action === 'test-connection') {
      return NextResponse.json({ success: true, message: 'Database connection successful' });
    }
    
    // Get all applications 
    if (action === 'get-all-applications') {
      console.log('Fetching all applications from database...');
      try {
        const applications = await prisma.application.findMany({
          where: {
            status: 'submitted'
          },
          orderBy: {
            updated_at: 'desc'
          }
        });
        
        console.log(`Database returned ${applications.length} applications`);
        if (applications.length > 0) {
          console.log('Sample application data:', applications[0]);
        }
        
        return NextResponse.json({ 
          success: true,
          timestamp: new Date().toISOString(),
          applications 
        });
      } catch (error: any) {
        console.error('Database error when fetching applications:', error);
        return NextResponse.json({ 
          error: 'Database error', 
          details: error.message 
        }, { 
          status: 500 
        });
      }
    }
    
    const userId = searchParams.get('userId');
    console.log(`Request for userId: ${userId}`);
    
    if (!userId) {
      console.error('User ID is required but was not provided');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    switch (action) {
      case 'get-application':
        console.log(`Looking up application for userId: ${userId}`);
        const application = await prisma.application.findUnique({
          where: { user_id: userId }
        });
        console.log(`Application found: ${!!application}`);
        return NextResponse.json({ application });
        
      case 'get-user-interactions':
        console.log(`Getting interactions for userId: ${userId}`);
        try {
          // Find all matches where this user has interacted (either passed or connected)
          const interactions = await prisma.match.findMany({
            where: {
              user_id_1: userId
            }
          });
          
          console.log(`Found ${interactions.length} interactions for user ${userId}`);
          
          // Extract the user IDs this user has interacted with
            const interactedUserIds = interactions.map(match => match.user_id_2);
          
          return NextResponse.json({
            success: true,
            interactedUserIds
          });
        } catch (error: any) {
          console.error('Error getting user interactions:', error);
          return NextResponse.json({ 
            error: 'Failed to get user interactions', 
            details: error.message 
          }, { 
            status: 500 
          });
        }
      
      default:
        console.error(`Invalid action requested: ${action}`);
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Database API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, ...data } = body;
    
    console.log(`POST API request: action=${action}, userId=${userId}, data=`, data);
    
    if (!userId) {
      console.error('User ID is required but was not provided');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Ensure userId is a string
    const userIdStr = String(userId);
    console.log(`Converted userId to string: ${userIdStr}`);

    switch (action) {
      case 'save-application': {
        console.log(`Saving application for userId: ${userIdStr}`);
        console.log('Application data:', data);
        
        try {
          // Single database operation with upsert
          const application = await prisma.application.upsert({
            where: { user_id: userIdStr },
            update: {
              cwid: data.cwid,
              full_name: data.full_name,
              discord: data.discord,
              skill_level: data.skill_level,
              hackathon_experience: data.hackathon_experience,
              hear_about_us: data.hear_about_us,
              why_attend: data.why_attend,
                project_experience: data.project_experience,
              future_plans: data.future_plans,
              fun_fact: data.fun_fact,
              self_description: data.self_description,
              links: data.links,
              teammates: data.teammates,
              referral_email: data.referral_email,
              dietary_restrictions_extra: data.dietary_restrictions_extra,
              tshirt_size: data.tshirt_size,
              agree_to_terms: data.agree_to_terms || false,
              status: data.status || 'in_progress'
            },
            create: {
              user_id: userIdStr,
              cwid: data.cwid,
              full_name: data.full_name,
              discord: data.discord,
              skill_level: data.skill_level,
              hackathon_experience: data.hackathon_experience,
              hear_about_us: data.hear_about_us,
              why_attend: data.why_attend,
              project_experience: data.project_experience,
              future_plans: data.future_plans,
              fun_fact: data.fun_fact,
              self_description: data.self_description,
              links: data.links,
              teammates: data.teammates,
              referral_email: data.referral_email,
              dietary_restrictions_extra: data.dietary_restrictions_extra,
              tshirt_size: data.tshirt_size,
              agree_to_terms: data.agree_to_terms || false,
              status: data.status || 'in_progress'
            }
          });

          console.log('Application upsert successful', application);
          return NextResponse.json({ success: true, application });
        } catch (error) {
          console.error('Error during application upsert:', error);
          return NextResponse.json({ error: `Database operation failed: ${error}` }, { status: 500 });
        }
      }
      
      case 'submit-application': {
        console.log(`Submitting application for userId: ${userIdStr}`);
        const application = await prisma.application.update({
          where: { user_id: userIdStr },
          data: { status: 'submitted' }
        });
        
        console.log('Application submit successful');
        return NextResponse.json({ success: true, application });
      }

      case 'create-match': {
        const { targetUserId, status } = data;
        console.log(`Creating match: ${userIdStr} -> ${targetUserId} (${status})`);
        
        if (!targetUserId) {
          console.error('Target user ID is required but was not provided');
          return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
        }

        // Check if both users have applications
        const userApplication = await prisma.application.findUnique({ 
          where: { user_id: userIdStr } 
        });
        
        const targetApplication = await prisma.application.findUnique({ 
          where: { user_id: targetUserId } 
        });
        
        console.log(`User application found: ${!!userApplication}, Target application found: ${!!targetApplication}`);
        
        if (!userApplication || !targetApplication) {
          console.error('One or both user profiles not found');
          return NextResponse.json({ error: 'One or both user profiles not found' }, { status: 404 });
        }

        try {
          // Use upsert instead of create to handle existing matches
          const match = await prisma.match.upsert({
            where: {
              user_id_1_user_id_2: {
                user_id_1: userIdStr,
                user_id_2: targetUserId
              }
            },
            update: {
              status: status
            },
            create: {
              user_id_1: userIdStr,
              user_id_2: targetUserId,
              status: status
            }
          });
          
          console.log('Match saved successfully', match);
          return NextResponse.json({ 
            success: true, 
            match
          });
        } catch (error) {
          console.error('Error during match operation:', error);
          return NextResponse.json({ error: `Database operation failed: ${error}` }, { status: 500 });
        }
      }
      
      default:
        console.error(`Invalid action requested: ${action}`);
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Database API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 