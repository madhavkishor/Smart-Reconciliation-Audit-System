
import { TransactionRecord } from '../types';

export const generateSystemRecords = (count: number): TransactionRecord[] => {
  const records: TransactionRecord[] = [];
  const baseDate = new Date();

  for (let i = 0; i < count; i++) {
    records.push({
      id: `sys-${i}`,
      transactionId: `TXN-${1000 + i}`,
      amount: Math.floor(Math.random() * 5000) + 100,
      referenceNumber: `REF-${2000 + i}`,
      date: new Date(baseDate.getTime() - i * 86400000).toISOString().split('T')[0],
      source: 'SYSTEM'
    });
  }

  return records;
};
