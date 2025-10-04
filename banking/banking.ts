import { BankAccount, WithdrawalRequest, WithdrawalResult, WithdrawalError } from "./types";

function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createAccount(account: BankAccount): BankAccount | WithdrawalError {
  if (account.balance < 0) {
    return {
      code: "INVALID_AMOUNT",
      message: "Account balance cannot be negative",
    };
  }

  if (account.balance === 0) {
    return {
      code: "INVALID_AMOUNT",
      message: "Initial account balance must be positive",
    };
  }

  return account;
}

export function processWithdrawal(
  account: BankAccount,
  withdrawal: WithdrawalRequest,
): WithdrawalResult | WithdrawalError {
  // 1. Walidacja konta
  if (account.id !== withdrawal.accountId) {
    return {
      code: "ACCOUNT_NOT_FOUND",
      message: "Konto nie zostało znalezione",
    };
  }

  // 2. Walidacja kwoty wypłaty
  if (withdrawal.amount <= 0) {
    return {
      code: "INVALID_AMOUNT",
      message: "Kwota wypłaty musi być dodatnia",
    };
  }

  // 3. Walidacja waluty
  if (account.currency !== withdrawal.currency) {
    return {
      code: "INVALID_AMOUNT",
      message: "Niezgodna waluta wypłaty",
    };
  }

  // 4. Sprawdzenie dostępności środków
  if (withdrawal.amount > account.balance) {
    return {
      code: "INSUFFICIENT_FUNDS",
      message: "Niewystarczające środki na koncie",
    };
  }

  // 5. Przetwarzanie udanej wypłaty
  const remainingBalance = account.balance - withdrawal.amount;

  // 6. Rejestracja transakcji
  return {
    success: true,
    transaction: {
      id: generateTransactionId(),
      amount: withdrawal.amount,
      currency: withdrawal.currency,
      timestamp: withdrawal.timestamp,
      remainingBalance,
    },
  };
}
