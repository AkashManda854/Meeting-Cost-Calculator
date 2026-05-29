// ============================================
// MEETING COST CALCULATOR - JAVASCRIPT LOGIC
// ============================================

// State Management
const state = {
    participants: [],
    meetings: [],
    currentMeetingDuration: 30
};

// DOM Elements
const meetingDurationInput = document.getElementById('meetingDuration');
const displayDuration = document.getElementById('displayDuration');
const participantNameInput = document.getElementById('participantName');
const participantCostInput = document.getElementById('participantCost');
const addParticipantBtn = document.getElementById('addParticipantBtn');
const participantsList = document.getElementById('participantsList');
const totalParticipants = document.getElementById('totalParticipants');
const totalCostElement = document.getElementById('totalCost');
const agendaInput = document.getElementById('agenda');
const charCount = document.getElementById('charCount');
const recommendationBox = document.getElementById('recommendationBox');
const recommendationHeader = document.getElementById('recommendationHeader');
const recommendationContent = document.getElementById('recommendationContent');
const saveMeetingBtn = document.getElementById('saveMeetingBtn');
const meetingsList = document.getElementById('meetingsList');
const historySection = document.getElementById('historySection');

// ============================================
// PART A: Core Functionality
// ============================================

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedMeetings();
    attachEventListeners();
    updateDisplay();
});

// Event Listeners
function attachEventListeners() {
    meetingDurationInput.addEventListener('change', handleDurationChange);
    addParticipantBtn.addEventListener('click', addParticipant);
    participantNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addParticipant();
    });
    participantCostInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addParticipant();
    });
    agendaInput.addEventListener('input', handleAgendaInput);
    saveMeetingBtn.addEventListener('click', saveMeeting);
}

function handleDurationChange(e) {
    const value = parseInt(e.target.value) || 0;
    state.currentMeetingDuration = Math.max(1, value);
    meetingDurationInput.value = state.currentMeetingDuration;
    updateDisplay();
}

function addParticipant() {
    const name = participantNameInput.value.trim();
    const cost = parseFloat(participantCostInput.value);

    // Validation
    if (!name) {
        showValidationError('Please enter a participant name');
        return;
    }
    if (isNaN(cost) || cost < 0) {
        showValidationError('Please enter a valid hourly cost');
        return;
    }

    // Add to state
    const participant = {
        id: Date.now(),
        name: name,
        hourlyRate: cost
    };
    state.participants.push(participant);

    // Clear inputs
    participantNameInput.value = '';
    participantCostInput.value = '';
    participantNameInput.focus();

    updateDisplay();
}

function removeParticipant(id) {
    state.participants = state.participants.filter(p => p.id !== id);
    updateDisplay();
}

function updateDisplay() {
    updateParticipantsList();
    updateCostCalculation();
    updateRecommendation();
}

function updateParticipantsList() {
    participantsList.innerHTML = '';

    if (state.participants.length === 0) {
        participantsList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">No participants added yet</p>';
        return;
    }

    state.participants.forEach(participant => {
        const costForMeeting = calculateParticipantCost(participant.hourlyRate);
        const item = document.createElement('div');
        item.className = 'participant-item';
        item.innerHTML = `
            <div class="participant-info">
                <span class="participant-name">${escapeHtml(participant.name)}</span>
                <span class="participant-cost">$${participant.hourlyRate.toFixed(2)}/hr</span>
            </div>
            <div class="participant-cost-value">$${costForMeeting.toFixed(2)}</div>
            <button class="btn btn-remove" onclick="removeParticipant(${participant.id})">Remove</button>
        `;
        participantsList.appendChild(item);
    });

    totalParticipants.textContent = state.participants.length;
}

function calculateParticipantCost(hourlyRate) {
    const hours = state.currentMeetingDuration / 60;
    return hourlyRate * hours;
}

function updateCostCalculation() {
    const total = state.participants.reduce((sum, participant) => {
        return sum + calculateParticipantCost(participant.hourlyRate);
    }, 0);

    totalCostElement.textContent = `$${total.toFixed(2)}`;
    displayDuration.textContent = `${state.currentMeetingDuration} min`;
}

function showValidationError(message) {
    alert(message);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// PART B: Is This Meeting Worth It?
// ============================================

function handleAgendaInput(e) {
    const text = e.target.value;
    charCount.textContent = text.length;
    updateRecommendation();
}

function updateRecommendation() {
    const agenda = agendaInput.value.trim();
    
    if (!agenda || state.participants.length === 0) {
        recommendationBox.classList.add('hidden');
        return;
    }

    const totalCost = calculateTotalCost();
    const recommendation = assessMeetingWorth(totalCost, agenda);
    
    displayRecommendation(recommendation);
}

function calculateTotalCost() {
    return state.participants.reduce((sum, participant) => {
        return sum + calculateParticipantCost(participant.hourlyRate);
    }, 0);
}

/**
 * Assess whether the meeting is worth the cost
 * 
 * Decision Logic:
 * - Consider total cost relative to meeting duration
 * - Analyze agenda for:
 *   - Key decision words: "decide", "approve", "urgent", "critical", "launch"
 *   - Productive words: "plan", "strategy", "align", "review", "discuss"
 *   - Wasteful words: "update", "fyi", "info", "status"
 * - Recommend based on cost-to-value ratio
 */
function assessMeetingWorth(totalCost, agenda) {
    const agendaLower = agenda.toLowerCase();
    const durationMinutes = state.currentMeetingDuration;
    
    // Calculate cost per minute
    const costPerMinute = totalCost / durationMinutes;
    
    // Score the agenda quality
    const score = scoreAgenda(agendaLower);
    
    // Decision thresholds
    const isHighCost = totalCost > 500;
    const isLongMeeting = durationMinutes > 60;
    const hasGoodAgenda = score > 0.5;
    const hasExcellentAgenda = score > 0.75;
    
    let recommendation = {
        worthIt: true,
        icon: '✅',
        title: 'This meeting looks good!',
        reasons: [],
        color: 'green'
    };
    
    // Analysis logic
    if (isHighCost && !hasGoodAgenda) {
        recommendation.worthIt = false;
        recommendation.icon = '⚠️';
        recommendation.title = 'Expensive with unclear outcomes';
        recommendation.color = 'red';
        recommendation.reasons = [
            `💰 This meeting costs $${totalCost.toFixed(2)} with ${state.participants.length} people`,
            '📋 The agenda lacks clear decision points or action items',
            '💡 Consider: Can this be handled async or in writing?'
        ];
    } else if (isHighCost && hasGoodAgenda && !hasExcellentAgenda) {
        recommendation.icon = '🤔';
        recommendation.title = 'Worth it, but could be optimized';
        recommendation.color = 'warning';
        recommendation.reasons = [
            `💰 Cost: $${totalCost.toFixed(2)} (high investment)`,
            '📋 The agenda is clear but could be more focused',
            '⏱️ Try to limit to 45 minutes or reduce participants'
        ];
    } else if (isLongMeeting && !hasExcellentAgenda) {
        recommendation.worthIt = false;
        recommendation.icon = '⏰';
        recommendation.title = 'Meeting is too long for the agenda';
        recommendation.color = 'red';
        recommendation.reasons = [
            `⏱️ ${durationMinutes} minutes is quite long`,
            '💰 Total cost: $' + totalCost.toFixed(2),
            '💡 Try shorter time blocks or focused discussions'
        ];
    } else if (hasExcellentAgenda && totalCost < 100) {
        recommendation.icon = '🎯';
        recommendation.title = 'Perfect! Focused and cost-effective';
        recommendation.reasons = [
            `✨ Clear agenda with strong decision/action items`,
            `💰 Reasonable cost: $${totalCost.toFixed(2)}`,
            '🚀 This meeting will likely be productive'
        ];
    } else if (hasExcellentAgenda) {
        recommendation.icon = '✅';
        recommendation.title = 'Great meeting - clear purpose and outcomes';
        recommendation.reasons = [
            `✨ Excellent agenda with defined outcomes`,
            `💰 Cost: $${totalCost.toFixed(2)} - justified by the agenda`,
            '✓ Go ahead with this meeting'
        ];
    } else if (totalCost < 50) {
        recommendation.icon = '✅';
        recommendation.title = 'Low cost, good to go';
        recommendation.reasons = [
            `💰 Minimal cost: $${totalCost.toFixed(2)}`,
            '👥 Small group or short duration',
            '✓ The meeting is an efficient use of time'
        ];
    } else {
        recommendation.reasons = [
            `💰 Meeting cost: $${totalCost.toFixed(2)}`,
            '📋 Clear agenda with stated objectives',
            `👥 ${state.participants.length} participants for ${durationMinutes} minutes`,
            '✓ This is a reasonable meeting investment'
        ];
    }
    
    return recommendation;
}

/**
 * Score agenda quality based on content analysis
 * Returns 0-1 score
 */
function scoreAgenda(agendaLower) {
    let score = 0;
    
    // High-value keywords (strong indicators of productive meetings)
    const excellentKeywords = ['decide', 'approve', 'launch', 'critical', 'urgent', 'deadline'];
    const goodKeywords = ['strategy', 'plan', 'align', 'review', 'analyze', 'problem-solve', 'outcome'];
    const weakKeywords = ['update', 'fyi', 'status', 'brief', 'quick sync', 'touch base'];
    
    // Score high-value keywords
    excellentKeywords.forEach(keyword => {
        if (agendaLower.includes(keyword)) score += 0.15;
    });
    
    // Score good keywords
    goodKeywords.forEach(keyword => {
        if (agendaLower.includes(keyword)) score += 0.1;
    });
    
    // Penalize weak keywords
    weakKeywords.forEach(keyword => {
        if (agendaLower.includes(keyword)) score -= 0.1;
    });
    
    // Check for action items or outcomes
    if (agendaLower.includes('action') || agendaLower.includes('outcome') || 
        agendaLower.includes('deliverable') || agendaLower.includes('goal')) {
        score += 0.2;
    }
    
    // Check for vague language
    if (agendaLower.match(/\b(blah|etc|stuff|things|something|anything)\b/)) {
        score -= 0.15;
    }
    
    // Length matters - too short might be unclear
    const words = agendaLower.split(/\s+/).length;
    if (words < 5) score -= 0.1;
    
    // Clamp score between 0 and 1
    return Math.max(0, Math.min(1, score));
}

function displayRecommendation(rec) {
    recommendationBox.className = `recommendation-box ${rec.color}`;
    recommendationBox.classList.remove('hidden');
    
    recommendationHeader.innerHTML = `
        <span class="recommendation-icon">${rec.icon}</span>
        <span>${rec.title}</span>
    `;
    
    recommendationContent.innerHTML = rec.reasons
        .map(reason => `<p>${reason}</p>`)
        .join('');
}

// ============================================
// PART C: Meeting History
// ============================================

function saveMeeting() {
    const agenda = agendaInput.value.trim();
    
    if (state.participants.length === 0) {
        alert('Please add at least one participant before saving');
        return;
    }
    
    if (!agenda) {
        alert('Please add an agenda before saving');
        return;
    }
    
    const totalCost = calculateTotalCost();
    
    const meeting = {
        id: Date.now(),
        timestamp: new Date(),
        duration: state.currentMeetingDuration,
        participants: [...state.participants],
        agenda: agenda,
        totalCost: totalCost
    };
    
    state.meetings.push(meeting);
    saveMeetingsToStorage();
    
    // Show confirmation
    alert(`✅ Meeting saved! Total cost: $${totalCost.toFixed(2)}`);
    
    // Refresh display
    displayMeetingHistory();
}

function displayMeetingHistory() {
    if (state.meetings.length === 0) {
        historySection.classList.add('hidden');
        return;
    }
    
    historySection.classList.remove('hidden');
    meetingsList.innerHTML = '';
    
    // Sort by timestamp, newest first
    const sortedMeetings = [...state.meetings].sort((a, b) => b.timestamp - a.timestamp);
    
    sortedMeetings.forEach(meeting => {
        const dateStr = formatDate(meeting.timestamp);
        const card = document.createElement('div');
        card.className = 'meeting-card';
        card.innerHTML = `
            <div class="meeting-card-info">
                <div class="meeting-title">📋 ${escapeHtml(meeting.agenda.substring(0, 50))}${meeting.agenda.length > 50 ? '...' : ''}</div>
                <div class="meeting-meta">
                    <div>📅 ${dateStr}</div>
                    <div>⏱️ ${meeting.duration} minutes</div>
                    <div>👥 ${meeting.participants.length} participants</div>
                </div>
            </div>
            <div style="text-align: right; display: flex; flex-direction: column; gap: 10px; align-items: flex-end;">
                <div class="meeting-cost">$${meeting.totalCost.toFixed(2)}</div>
                <button class="btn btn-delete" onclick="deleteMeeting(${meeting.id})">Delete</button>
            </div>
        `;
        meetingsList.appendChild(card);
    });
}

function deleteMeeting(id) {
    if (confirm('Are you sure you want to delete this meeting record?')) {
        state.meetings = state.meetings.filter(m => m.id !== id);
        saveMeetingsToStorage();
        displayMeetingHistory();
    }
}

function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateObj = new Date(date);
    const dateStr = dateObj.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();
    
    let dateLabel;
    if (dateStr === todayStr) {
        dateLabel = 'Today';
    } else if (dateStr === yesterdayStr) {
        dateLabel = 'Yesterday';
    } else {
        dateLabel = dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    const timeStr = dateObj.toLocaleTimeString('en-US', { 
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `${dateLabel} at ${timeStr}`;
}

// ============================================
// STORAGE (Local Storage)
// ============================================

function saveMeetingsToStorage() {
    const data = state.meetings.map(m => ({
        ...m,
        timestamp: m.timestamp.toISOString()
    }));
    localStorage.setItem('savedMeetings', JSON.stringify(data));
}

function loadSavedMeetings() {
    const stored = localStorage.getItem('savedMeetings');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            state.meetings = data.map(m => ({
                ...m,
                timestamp: new Date(m.timestamp)
            }));
            displayMeetingHistory();
        } catch (e) {
            console.error('Error loading saved meetings:', e);
        }
    }
}
