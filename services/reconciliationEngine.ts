
import { TransactionRecord, MatchStatus } from '../types';
import { generateSystemRecords } from './mockData';

const systemRecords = generateSystemRecords(500); // Expanded pool for matching

export const reconcileRecords = (uploaded: TransactionRecord[]): TransactionRecord[] => {
  const processed: TransactionRecord[] = [];
  const txnIdCounts = new Map<string, number>();

  // First pass: Mark duplicates in the uploaded set
  uploaded.forEach(rec => {
    txnIdCounts.set(rec.transactionId, (txnIdCounts.get(rec.transactionId) || 0) + 1);
  });

  return uploaded.map(u => {
    // 1. Check Duplicates
    if ((txnIdCounts.get(u.transactionId) || 0) > 1) {
      return { ...u, status: MatchStatus.DUPLICATE };
    }

    // 2. Exact Match (TX ID + Amount)
    const exactMatch = systemRecords.find(s => 
      s.transactionId === u.transactionId && 
      s.amount === u.amount
    );
    if (exactMatch) {
      return { ...u, status: MatchStatus.MATCHED, matchedId: exactMatch.id };
    }

    // 3. Partial Match (Ref Match + Amount Variance ±2%)
    const partialMatch = systemRecords.find(s => {
      const isRefMatch = s.referenceNumber === u.referenceNumber;
      if (!isRefMatch) return false;

      const variance = Math.abs(s.amount - u.amount) / s.amount;
      return variance <= 0.02; // Configurable rule: 2% variance
    });

    if (partialMatch) {
      const mismatchedFields: string[] = [];
      if (partialMatch.amount !== u.amount) mismatchedFields.push('amount');
      if (partialMatch.transactionId !== u.transactionId) mismatchedFields.push('transactionId');
      
      return { 
        ...u, 
        status: MatchStatus.PARTIAL, 
        matchedId: partialMatch.id,
        mismatchedFields
      };
    }

    // 4. No Match
    return { ...u, status: MatchStatus.UNMATCHED };
  });
};
