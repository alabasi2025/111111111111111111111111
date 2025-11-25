export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ar-SA').format(date);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
};
