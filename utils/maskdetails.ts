export function maskCardNumber(cardNumber: string): string {
    if (cardNumber.length < 4) return '****'
    return '*'.repeat(cardNumber.length - 4) + cardNumber.slice(-4)
  }
  
  export function maskEmail(email: string): string {
    const [local, domain] = email.split('@')
    if (local.length <= 2) return '*' + local.slice(-1) + '@' + domain
    return local.slice(0, 1) + '*'.repeat(local.length - 2) + local.slice(-1) + '@' + domain
  }
  
  export function maskCard(num: string) {
    return `**** **** **** ${num.slice(-4)}`;
  }