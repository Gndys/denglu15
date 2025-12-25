import { NextResponse } from 'next/server';
import { auth } from '@libs/auth';
import { creditService } from '@libs/credits';
import type { CreditTransactionType } from '@libs/credits';

/**
 * Get current user's credit transaction history
 */
export async function GET(request: Request) {
  try {
    // Get current user session
    const sessionHeaders = new Headers(request.headers);
    const session = await auth.api.getSession({
      headers: sessionHeaders
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Parse query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const type = url.searchParams.get('type') as CreditTransactionType | null;
    
    const transactions = await creditService.getTransactions(userId, {
      limit: Math.min(limit, 100), // Max 100 per request
      offset,
      type: type || undefined
    });
    
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Failed to fetch credit transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credit transactions' },
      { status: 500 }
    );
  }
}

