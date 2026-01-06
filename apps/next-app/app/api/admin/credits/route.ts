import { NextRequest, NextResponse } from 'next/server';
import { db } from '@libs/database';
import { user } from '@libs/database/schema/user';
import { creditTransaction } from '@libs/database/schema/credit-transaction';
import { creditService } from '@libs/credits';
import { and, asc, count, desc, eq, like, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const searchField = searchParams.get('searchField');
    const searchValue = searchParams.get('searchValue');
    const typeFilter = searchParams.get('type');

    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    const whereConditions: any[] = [];

    if (searchValue && searchField) {
      switch (searchField) {
        case 'id':
          whereConditions.push(eq(creditTransaction.id, searchValue));
          break;
        case 'userId':
          whereConditions.push(eq(creditTransaction.userId, searchValue));
          break;
        case 'userEmail':
          whereConditions.push(like(user.email, `%${searchValue}%`));
          break;
      }
    }

    if (typeFilter && typeFilter !== 'all') {
      whereConditions.push(eq(creditTransaction.type, typeFilter));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const totalResult = await db
      .select({ count: count() })
      .from(creditTransaction)
      .leftJoin(user, eq(creditTransaction.userId, user.id))
      .where(whereClause);

    const total = totalResult[0]?.count || 0;

    let orderBy;
    switch (sortBy) {
      case 'id':
        orderBy = sortDirection === 'desc' ? desc(creditTransaction.id) : asc(creditTransaction.id);
        break;
      case 'userId':
        orderBy = sortDirection === 'desc' ? desc(creditTransaction.userId) : asc(creditTransaction.userId);
        break;
      case 'userEmail':
        orderBy = sortDirection === 'desc' ? desc(user.email) : asc(user.email);
        break;
      case 'amount':
        orderBy = sortDirection === 'desc'
          ? desc(sql`CAST(${creditTransaction.amount} AS DECIMAL)`)
          : asc(sql`CAST(${creditTransaction.amount} AS DECIMAL)`);
        break;
      case 'balance':
        orderBy = sortDirection === 'desc'
          ? desc(sql`CAST(${creditTransaction.balance} AS DECIMAL)`)
          : asc(sql`CAST(${creditTransaction.balance} AS DECIMAL)`);
        break;
      case 'createdAt':
      default:
        orderBy = sortDirection === 'desc'
          ? desc(creditTransaction.createdAt)
          : asc(creditTransaction.createdAt);
        break;
    }

    const transactions = await db
      .select({
        id: creditTransaction.id,
        userId: creditTransaction.userId,
        type: creditTransaction.type,
        amount: creditTransaction.amount,
        balance: creditTransaction.balance,
        description: creditTransaction.description,
        metadata: creditTransaction.metadata,
        createdAt: creditTransaction.createdAt,
        userEmail: user.email,
        userName: user.name,
      })
      .from(creditTransaction)
      .leftJoin(user, eq(creditTransaction.userId, user.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      transactions,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching credit transactions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, action, reason, type } = body as {
      userId?: string;
      amount?: number;
      action?: 'add' | 'deduct';
      reason?: string;
      type?: 'bonus' | 'refund' | 'adjustment';
    };

    if (!userId || !amount || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    if (action === 'add') {
      const transaction = await creditService.addCredits({
        userId,
        amount: numericAmount,
        type: type || 'adjustment',
        description: reason || 'Manual credit adjustment',
        metadata: { source: 'admin-console' }
      });

      return NextResponse.json({
        success: true,
        transactionId: transaction.id,
        balance: Number(transaction.balance)
      });
    }

    const result = await creditService.consumeCredits({
      userId,
      amount: numericAmount,
      description: reason || 'Admin deduction',
      metadata: { source: 'admin-console' }
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to deduct credits' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      balance: result.newBalance
    });
  } catch (error) {
    console.error('Error adjusting credits:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
