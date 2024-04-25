export const formatPrice = (price?: number) => {
  console.log(price)
  if (!price) {
    return 'No price provided'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}