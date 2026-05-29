import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticipantsSection from './components/ParticipantsSection';
import DurationSection from './components/DurationSection';
import AgendaSection from './components/AgendaSection';
import CostDisplay from './components/CostDisplay';
import RecommendationCard from './components/RecommendationCard';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import AdvancedInputs from './components/AdvancedInputs';
import ShockValueMetrics from './components/ShockValueMetrics';
import AIAgendaAnalyzer from './components/AIAgendaAnalyzer';
import PanicButton from './components/PanicButton';
import MeetingHistoryLog from './components/MeetingHistoryLog';

export default function App() {
  const [participants, setParticipants] = useState([]);
  const [duration, setDuration] = useState(30);
  const [agenda, setAgenda] = useState('');
  const [newParticipant, setNewParticipant] = useState({ name: '', cost: '' });
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Advanced Module 1: Input Parameters
  const [meetingType, setMeetingType] = useState('decision');
  const [includeOverhead, setIncludeOverhead] = useState(false);
  const [includeOppCost, setIncludeOppCost] = useState(false);
  const [engagement, setEngagement] = useState(100);
  
  // Module 2: Live Ticker
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState(0);
  
  // Module 3: AI Analysis
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Module 4: History Log
  const [meetingHistory, setMeetingHistory] = useState(() => {
    const saved = localStorage.getItem('meetingHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [meetingName, setMeetingName] = useState('');
  const [showRating, setShowRating] = useState(false);

  // Apply theme on mount and change
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  // Live ticker effect
  useEffect(() => {
    let interval;
    if (isLiveTracking && participants.length > 0) {
      interval = setInterval(() => {
        setLiveElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLiveTracking, participants.length]);

  // Calculate costs with advanced parameters
  const baseCost = participants.reduce((sum, p) => {
    return sum + (p.cost * duration) / 60;
  }, 0);

  // Meeting type multipliers
  const typeMultipliers = {
    decision: 1.0,
    brainstorming: 0.8,
    standup: 0.5,
    allhands: 0.7,
  };

  const typeMultiplier = typeMultipliers[meetingType] || 1.0;
  
  // Overhead costs
  let overheadCost = 0;
  if (includeOverhead && participants.length > 0) {
    const avgParticipantCost = baseCost / participants.length;
    // 15 min prep for organizer + 10 min follow-up per attendee
    const prepTime = (15 + 10 * participants.length) / 60;
    overheadCost = avgParticipantCost * prepTime;
  }

  // Opportunity cost (15% markup)
  const opportunityCost = includeOppCost ? baseCost * 0.15 : 0;

  // Engagement penalty - higher engagement = lower wasted capital
  const wasteFactor = (100 - engagement) / 100;

  // Total cost calculation
  const totalCost = (baseCost * typeMultiplier + overheadCost + opportunityCost) * (1 + wasteFactor * 0.3);
  const wastedCapital = totalCost * wasteFactor;

  // Live tracker cost
  const liveCost = isLiveTracking 
    ? (totalCost / (duration * 60)) * liveElapsedSeconds 
    : 0;

  const addParticipant = () => {
    if (newParticipant.name.trim() && newParticipant.cost) {
      setParticipants([
        ...participants,
        {
          id: Date.now(),
          name: newParticipant.name,
          cost: parseFloat(newParticipant.cost),
        },
      ]);
      setNewParticipant({ name: '', cost: '' });
    }
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleSaveMeeting = (rating) => {
    const newEntry = {
      id: Date.now(),
      name: meetingName || 'Untitled Meeting',
      cost: totalCost,
      rating,
      date: new Date().toLocaleDateString(),
      attendees: participants.length,
      duration,
    };
    const updated = [...meetingHistory, newEntry];
    setMeetingHistory(updated);
    localStorage.setItem('meetingHistory', JSON.stringify(updated));
    setShowRating(false);
    setMeetingName('');
  };

  const handleEndMeeting = () => {
    setIsLiveTracking(false);
    setShowRating(true);
  };

  const assessMeeting = () => {
    if (!agenda.trim() || participants.length === 0) return null;

    const agendaLower = agenda.toLowerCase();
    const excellentKeywords = ['decide', 'approve', 'launch', 'critical', 'urgent', 'deadline'];
    const weakKeywords = ['update', 'fyi', 'status', 'brief', 'quick sync'];

    let score = 0;
    excellentKeywords.forEach(kw => {
      if (agendaLower.includes(kw)) score += 0.2;
    });
    weakKeywords.forEach(kw => {
      if (agendaLower.includes(kw)) score -= 0.15;
    });

    if (totalCost > 500 && score < 0.3) {
      return { type: 'expensive', label: 'Too Expensive', color: 'red' };
    }
    if (totalCost > 200 && score < 0.2) {
      return { type: 'optimize', label: 'Consider Optimizing', color: 'yellow' };
    }
    if (score > 0.5) {
      return { type: 'worth', label: 'Worth It', color: 'green' };
    }
    return { type: 'worth', label: 'Looks Good', color: 'cyan' };
  };

  const recommendation = assessMeeting();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      <AnimatedBackground isDarkMode={isDarkMode} />
      
      <div className="relative z-10">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Left Column - Inputs */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <ParticipantsSection
                participants={participants}
                newParticipant={newParticipant}
                setNewParticipant={setNewParticipant}
                onAdd={addParticipant}
                onRemove={removeParticipant}
              />

              <DurationSection duration={duration} setDuration={setDuration} />

              <AdvancedInputs
                meetingType={meetingType}
                setMeetingType={setMeetingType}
                includeOverhead={includeOverhead}
                setIncludeOverhead={setIncludeOverhead}
                includeOppCost={includeOppCost}
                setIncludeOppCost={setIncludeOppCost}
                engagement={engagement}
                setEngagement={setEngagement}
                isDarkMode={isDarkMode}
              />

              <AgendaSection agenda={agenda} setAgenda={setAgenda} />
            </motion.div>

            {/* Right Column - Display & Analytics */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <CostDisplay 
                cost={isLiveTracking ? liveCost : totalCost} 
                participants={participants.length} 
                duration={isLiveTracking ? liveElapsedSeconds : duration}
                isLive={isLiveTracking}
              />
              
              {recommendation && (
                <RecommendationCard recommendation={recommendation} cost={totalCost} />
              )}

              {participants.length > 0 && (
                <ShockValueMetrics 
                  cost={isLiveTracking ? liveCost : totalCost}
                  isDarkMode={isDarkMode}
                />
              )}

              {isLiveTracking && (
                <PanicButton
                  onStop={handleEndMeeting}
                  currentCost={liveCost}
                  isDarkMode={isDarkMode}
                />
              )}

              {!isLiveTracking && participants.length > 0 && (
                <>
                  <motion.button
                    onClick={() => setIsLiveTracking(true)}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400'
                        : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ▶ Start Live Meeting Tracker
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      const newMeeting = {
                        id: Date.now(),
                        name: meetingName || `${meetingType} Meeting`,
                        cost: totalCost,
                        rating: recommendation?.type === 'worth' ? 5 : recommendation?.type === 'optimize' ? 3 : 2,
                        date: new Date().toLocaleDateString(),
                        attendees: participants.length,
                        duration: duration,
                        expensive: recommendation?.type === 'expensive',
                        agendaQuality: assessMeeting(),
                      };
                      const updated = [...meetingHistory, newMeeting];
                      setMeetingHistory(updated);
                      localStorage.setItem('meetingHistory', JSON.stringify(updated));
                      setMeetingName('');
                      setParticipants([]);
                      setAgenda('');
                    }}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30'
                        : 'bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    💾 Save This Meeting
                  </motion.button>
                </>
              )}
            </motion.div>
          </div>

          {/* AI Analyzer Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <AIAgendaAnalyzer
              agenda={agenda}
              meetingType={meetingType}
              attendeeCount={participants.length}
              totalCost={totalCost}
              onAnalysis={setAiAnalysis}
              aiAnalysis={aiAnalysis}
              isDarkMode={isDarkMode}
              isLoading={aiLoading}
              setIsLoading={setAiLoading}
            />
          </motion.div>


          {/* Meeting History Log */}
          <motion.div variants={itemVariants}>
            <MeetingHistoryLog
              history={meetingHistory}
              isDarkMode={isDarkMode}
            />
          </motion.div>

          {/* Rating Modal */}
          {showRating && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Rate This Meeting
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  How valuable was this meeting? (1-5 stars)
                </p>
                <input
                  type="text"
                  placeholder="Meeting name (optional)"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg mb-4 border ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                />
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleSaveMeeting(star)}
                      className="text-3xl transition hover:scale-110"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowRating(false)}
                  className={`w-full py-2 rounded-lg ${
                    isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Cancel
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
