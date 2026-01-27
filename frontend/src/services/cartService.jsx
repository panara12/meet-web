import apiHelper from '../utils/Url'

const cartServices = {
    // Get cart
    getCart: async () => await apiHelper.get(`/cart/getcart`),

    
    // Add to cart (initial creation)
    addToCart: async (payload) => {
        const res = await apiHelper.post('/cart/addtocart', payload);
        return res.data;
    },
    
    // UNIFIED UPDATE - Send entire cart data
    updateCart: async (payload) => {
        const res = await apiHelper.put(`/cart/updatecart/${payload.cartId}`, {
            clients: payload.clients,
            salesman_data: payload.salesman_data
        });
        return res.data;
    },
    
    // Delete entire cart
    deleteCart: async (payload) => {
        const res = await apiHelper.delete(`/cart/deletecart/${payload.cartId}`);
        return res.data;
    }
}

export default cartServices;