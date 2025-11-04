import { createContext, useContext, useEffect, useState } from "react";
import { useDeleteProduct } from "../../hooks/product/useDeleteProduct";
import { useUpdateProduct } from "../../hooks/product/useUpdateProduct";
import { useAddProduct } from "../../hooks/product/useAddProduct";
import { useGetAllProduct, useGetAllProductCountByCompany } from "../../hooks/product/useGetAllProduct";

const InventoryContext = createContext(undefined);

// Sample categories
const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Books",
  "Sports & Outdoors",
  "Health & Beauty",
  "Automotive",
  "Toys & Games",
  "Food & Beverages",
  "Office Supplies",
];

// Initial mock data
const initialProducts = [];

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const { 
  data: getProductList, 
  isPending: productListPending, 
  isError: isProductListError, 
  error: productListError 
} = useGetAllProduct({});

useEffect(() => {
  if (getProductList?.product) {
    console.log("Fetched Product List:", getProductList);
    setProducts(getProductList.product);
  }
}, [getProductList]);
console.log("Fetched Products:", getProductList);


const { 
  data: getAllProductCountByCompany, 
  isPending: productCountPending, 
  isError: isProductCountError, 
  error: productCountError 
} = useGetAllProductCountByCompany();



const { 
  mutate: addProductFn, 
  isPending: isAddProductFnPending, 
  isError: isAddProductFnError, 
  error: addProductFnError 
} = useAddProduct({});

const { 
  mutate: updateProductFn, 
  isPending: isUpdateProductFnPending, 
  isError: isUpdateProductFnError, 
  error: updateProductFnError 
} = useUpdateProduct({});

const { 
  mutate: deleteProductFn, 
  isPending: isDeleteProductFnPending, 
  isError: isDeleteProductFnError, 
  error: deleteProductFnError 
} = useDeleteProduct({});


  const addProduct = (formDataToSend) => {
    addProductFn(formDataToSend)
  };

  const updateProduct = ({id, formDataToSend}) => {
    console.log("Calling updateProductFn with:", {id, formDataToSend});
    updateProductFn({id, formDataToSend})
    return true;
  };

  const deleteProduct = (id) => {
    deleteProductFn({id})
    return true;
  };

  const deleteProductsByCompany = (companyId) => {
    let deletedCount = getAllProductCountByCompany({id:companyId})?.data?.count || 0;
    return deletedCount;
  };

  const getProduct = (id) => {
    return products.find((product) => product._id === id);
  };

  const getProductsByCompany = (companyId) => {
    return products.filter((product) => product.companyId === companyId);
  };

  const updateStock = (id, quantity) => {
    setProducts((prev) =>
      prev.map((product) =>
        product._id === id
          ? {
              ...product,
              stockQuantity: quantity,
              lastRestocked: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : product
      )
    );
    return true;
  };

  const getInventoryStats = () => {
    const stats = {
      totalProducts: products.length,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalValue: 0,
      activeProducts: 0,
      categories: {},
    };

    products.forEach((product) => {
      // Stock status
      if (product.stockQuantity === 0) {
        stats.outOfStockProducts++;
      } else if (product.stockQuantity <= product.lowStockThreshold) {
        stats.lowStockProducts++;
      }

      // Total value
      stats.totalValue += product.price * product.stockQuantity;

      // Active products
      if (product.status === "active") {
        stats.activeProducts++;
      }

      // Categories
      stats.categories[product.category] =
        (stats.categories[product.category] || 0) + 1;
    });

    return stats;
  };

  const searchProducts = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.sku.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.brand.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category);
  };

  const getLowStockProducts = () => {
    return products.filter(
      (product) =>
        product.stockQuantity > 0 &&
        product.stockQuantity <= product.lowStockThreshold
    );
  };

  const getOutOfStockProducts = () => {
    return products.filter((product) => product.stockQuantity === 0);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteProductsByCompany,
        getProduct,
        getProductsByCompany,
        updateStock,
        getInventoryStats,
        searchProducts,
        getProductsByCategory,
        getLowStockProducts,
        getOutOfStockProducts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

// Export categories for use in components
export { categories };
