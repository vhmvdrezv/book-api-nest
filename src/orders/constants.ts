export const orderSelectFields = {
    id: true,
    userId: true,
    orderDate: true,
    status: true,
    totalPrice: true,
    orderBook: {
        select: {
            bookId: true,
            book: {
                select: {
                    id: true,
                    title: true,
                }
            }
        }
    }
}
