export interface MortgageFormValues {
  loanAmount: string
  interestRate: string
  loanTerm: string
}

export interface MortgageValidationErrors {
  loanAmount?: string
  interestRate?: string
  loanTerm?: string
}

export interface MortgageResult {
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
}
