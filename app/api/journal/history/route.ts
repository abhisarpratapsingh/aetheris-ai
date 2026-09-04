import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = await verifyAuthToken(authHeader);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing authentication credentials.' },
        { status: 401 }
      );
    }

    // In mock demo mode, return curated sample entries if Firestore not yet connected
    if (user.isMockUser || !adminDb) {
      return NextResponse.json({
        success: true,
        source: 'mock_sandbox',
        entries: getMockHistory(user.uid),
      });
    }

    // Isolated read: query strictly scoped to authenticated user's subcollection
    const snapshot = await adminDb
      .collection('users')
      .doc(user.uid)
      .collection('journal_entries')
      .orderBy('timestamp', 'desc')
      .limit(30)
      .get();

    const entries = snapshot.docs.map(doc => doc.data());

    return NextResponse.json({
      success: true,
      source: 'firestore_isolated',
      entries,
    });
  } catch (error: any) {
    console.error('[API /history GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve journal history.', details: error.message },
      { status: 500 }
    );
  }
}

function getMockHistory(uid: string) {
  return [
    {
      id: 'mock_entry_01',
      userId: uid,
      rawText: "Planning the Q4 product roadmap. Feeling torn between shipping new features quickly vs paying down technical debt. I know velocity matters for market share, but our test coverage is slipping and the team is showing subtle signs of fatigue.",
      category: 'reflection',
      timestamp: Date.now() - 1000 * 60 * 60 * 26,
      analysis: {
        executiveTakeaway: "Strategic tension between shipping velocity and architectural resilience requires an explicit 70/30 resource allocation framework.",
        mentalReframing: "Technical debt is not a moral failure; it is financial leverage. Repay it methodically rather than treating it like a sudden crisis.",
        subconsciousBlockers: ["Fear of being perceived as slow by stakeholders", "All-or-nothing thinking regarding code perfection"],
        actionItems: [
          {
            id: 'mock_act_1',
            title: 'Institute 1 day/sprint dedicated strictly to refactoring and test coverage',
            quadrant: 'do-first',
            priority: 'high',
            estimatedMinutes: 30,
            completed: true,
            context: 'Engineering leadership alignment'
          },
          {
            id: 'mock_act_2',
            title: 'Define top 3 core flows that require 95%+ integration test guarantees',
            quadrant: 'schedule',
            priority: 'critical',
            estimatedMinutes: 60,
            completed: false,
            context: 'Core reliability milestone'
          }
        ],
        emotionalTelemetry: {
          sentiment: 'reflective',
          sentimentScore: 0.15,
          burnoutRiskScore: 42,
          cognitiveLoadScore: 65,
          clarityScore: 78,
          dominantEmotions: ['Analytical', 'Pragmatic Tension', 'Duty']
        },
        conceptNodes: [
          { id: 'm1', label: 'Q4 Roadmap', group: 'project', weight: 5, connections: ['m2', 'm3'] },
          { id: 'm2', label: 'Tech Debt', group: 'blocker', weight: 4, connections: ['m1', 'm4'] },
          { id: 'm3', label: 'Team Velocity', group: 'insight', weight: 4, connections: ['m1'] },
          { id: 'm4', label: 'Test Coverage', group: 'habit', weight: 3, connections: ['m2'] }
        ],
        securityStamp: {
          sanitized: false,
          threatAssessmentScore: 0,
          secretManagerResolved: true,
          uidValidated: true,
          owaspRulePassed: ['LLM01', 'LLM02', 'A01'],
          executionTimeMs: 382,
          threatDetails: 'Verified clean payload.'
        }
      }
    }
  ];
}
