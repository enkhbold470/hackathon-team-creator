"use client"

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getPotentialMatches, handleMatchAction, getPendingMatches, getConfirmedMatches } from '../actions/getMatches'
import PotentialMatchCard from '@/components/matches/PotentialMatchCard'
import PendingMatchCard from '@/components/matches/PendingMatchCard'
import MatchCard from '@/components/matches/MatchCard'
import LoadingComponent from '@/components/matches/LoadingComponent'
import ErrorComponent from '@/components/matches/ErrorComponent'
import NoMatchesComponent from '@/components/matches/NoMatchesComponent'
import { MatchedUser, Match } from '@/lib/types'

export default function MatchesPage() {
  // State for potential matches
  const [potentialMatches, setPotentialMatches] = useState<MatchedUser[]>([])
  const [currentPotentialMatchIndex, setCurrentPotentialMatchIndex] = useState(0)
  const [potentialMatchesLoading, setPotentialMatchesLoading] = useState(true)
  const [potentialMatchesError, setPotentialMatchesError] = useState<string | null>(null)
  
  // State for pending matches
  const [pendingMatches, setPendingMatches] = useState<Match[]>([])
  const [pendingMatchesLoading, setPendingMatchesLoading] = useState(true)
  const [pendingMatchesError, setPendingMatchesError] = useState<string | null>(null)
  
  // State for confirmed matches
  const [confirmedMatches, setConfirmedMatches] = useState<Match[]>([])
  const [confirmedMatchesLoading, setConfirmedMatchesLoading] = useState(true)
  const [confirmedMatchesError, setConfirmedMatchesError] = useState<string | null>(null)
  
  // Function to fetch all data
  const fetchAllData = () => {
    fetchPotentialMatches()
    fetchPendingMatches()
    fetchConfirmedMatches()
  }
  
  // Fetch potential matches
  const fetchPotentialMatches = async () => {
    try {
      setPotentialMatchesLoading(true)
      setPotentialMatchesError(null)
      const matches = await getPotentialMatches()
      setPotentialMatches(matches)
      setCurrentPotentialMatchIndex(0)
    } catch (error) {
      setPotentialMatchesError('Failed to load potential matches')
      console.error(error)
    } finally {
      setPotentialMatchesLoading(false)
    }
  }
  
  // Fetch pending matches
  const fetchPendingMatches = async () => {
    try {
      setPendingMatchesLoading(true)
      setPendingMatchesError(null)
      const matches = await getPendingMatches()
      setPendingMatches(matches)
    } catch (error) {
      setPendingMatchesError('Failed to load pending matches')
      console.error(error)
    } finally {
      setPendingMatchesLoading(false)
    }
  }
  
  // Fetch confirmed matches
  const fetchConfirmedMatches = async () => {
    try {
      setConfirmedMatchesLoading(true)
      setConfirmedMatchesError(null)
      const matches = await getConfirmedMatches()
      setConfirmedMatches(matches)
    } catch (error) {
      setConfirmedMatchesError('Failed to load confirmed matches')
      console.error(error)
    } finally {
      setConfirmedMatchesLoading(false)
    }
  }
  
  // Handle thumb up/down action for potential matches
  const handleMatchInteraction = async (targetUserId: string, action: 'interested' | 'pass') => {
    try {
      await handleMatchAction(targetUserId, action)
      
      // Move to next potential match
      setCurrentPotentialMatchIndex(prev => Math.min(prev + 1, potentialMatches.length))
      
      // Refresh the pending and confirmed matches
      fetchPendingMatches()
      fetchConfirmedMatches()
    } catch (error) {
      console.error('Error handling match action:', error)
    }
  }
  
  // Get the current potential match
  const currentPotentialMatch = potentialMatches.length > 0 && currentPotentialMatchIndex < potentialMatches.length 
    ? potentialMatches[currentPotentialMatchIndex]
    : undefined
    
  // Initial data fetch
  useEffect(() => {
    fetchAllData()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Find Hackathon Teammates</h1>
      
      <Tabs defaultValue="potential">
        <TabsList className="w-full mb-8">
          <TabsTrigger value="potential" className="flex-1">Potential Matches</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">Pending ({pendingMatches.length})</TabsTrigger>
          <TabsTrigger value="matched" className="flex-1">Matched ({confirmedMatches.length})</TabsTrigger>
        </TabsList>
        
        {/* Potential Matches Tab */}
        <TabsContent value="potential" className="space-y-6">
          {potentialMatchesError ? (
            <ErrorComponent 
              error={potentialMatchesError} 
              onRetry={fetchPotentialMatches} 
            />
          ) : potentialMatchesLoading ? (
            <LoadingComponent />
          ) : potentialMatches.length === 0 ? (
            <NoMatchesComponent 
              title="No Potential Matches" 
              message="There are no potential matches available at the moment. Check back later!" 
            />
          ) : (
            <div className="max-w-lg mx-auto">
              <PotentialMatchCard 
                potentialMatch={currentPotentialMatch}
                onAction={handleMatchInteraction}
                loading={potentialMatchesLoading}
              />
            </div>
          )}
        </TabsContent>
        
        {/* Pending Matches Tab */}
        <TabsContent value="pending" className="space-y-6">
          {pendingMatchesError ? (
            <ErrorComponent 
              error={pendingMatchesError} 
              onRetry={fetchPendingMatches} 
            />
          ) : pendingMatchesLoading ? (
            <LoadingComponent />
          ) : pendingMatches.length === 0 ? (
            <NoMatchesComponent 
              title="No Pending Matches" 
              message="You don't have any pending match requests. Start by liking potential matches!" 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingMatches.map(match => (
                <PendingMatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Matched Tab */}
        <TabsContent value="matched" className="space-y-6">
          {confirmedMatchesError ? (
            <ErrorComponent 
              error={confirmedMatchesError} 
              onRetry={fetchConfirmedMatches} 
            />
          ) : confirmedMatchesLoading ? (
            <LoadingComponent />
          ) : confirmedMatches.length === 0 ? (
            <NoMatchesComponent 
              title="No Matches Yet" 
              message="When you and another person both express interest, you'll see your matches here!" 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {confirmedMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
