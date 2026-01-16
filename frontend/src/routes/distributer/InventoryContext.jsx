import { createContext, useContext, useEffect, useState } from "react";
import { useDeleteProduct } from "../../hooks/product/useDeleteProduct";
import { useUpdateProduct } from "../../hooks/product/useUpdateProduct";
import { useAddProduct } from "../../hooks/product/useAddProduct";
import { useGetAllProduct, useGetAllProductCountByCompany } from "../../hooks/product/useGetAllProduct";
import { useAddCategory } from "../../hooks/category/useAddCategory";
import { useGetAllCategory } from "../../hooks/category/useGetAllCategory";
import { useDeleteCategory } from "../../hooks/category/useDeleteCategory";
import { useUpdateCategory } from "../../hooks/category/useUpdateCategory";

const InventoryContext = createContext(undefined);

export function InventoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [companyFilter, setCompanyFilter] = useState(undefined);
  
  // Sort States
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get Products with pagination and filters
  const { 
    data: getProductList, 
    isPending: productListPending, 
    isError: isProductListError, 
    error: productListError 
  } = useGetAllProduct({
    page: currentPage,
    limit: limit,
    search: debouncedSearch,
    status: statusFilter,
    category: categoryFilter,
    companyId: companyFilter,
    sortField: sortField,
    sortDirection: sortDirection
  });

  const { data: categoriesAll } = useGetAllCategory();

  // Update products and categories when data changes
  useEffect(() => {
    if (categoriesAll?.category) {
      setCategories(categoriesAll.category);
    }
  }, [categoriesAll]);

  useEffect(() => {
    if (getProductList?.product) {
      setProducts(getProductList.product);
      
      if (getProductList.pagination) {
        setTotalPages(getProductList.pagination.totalPages);
        setTotalRecords(getProductList.pagination.totalProducts);
      }
    }
  }, [getProductList]);

  // Product Count by Company
  const { 
    data: getAllProductCountByCompany 
  } = useGetAllProductCountByCompany();

  // Category Mutations
  const { 
    mutate: addCtegory, 
    isPending: isaddCtegoryPending 
  } = useAddCategory({
    onSuccess: () => {
      setCurrentPage(1);
    }
  });

  const { 
    mutate: updateCategoryFn, 
    isPending: isupdateCategoryPending 
  } = useUpdateCategory({});

  const { 
    mutate: deleteCategoryFn, 
    isPending: isDeleteCategoryFnPending 
  } = useDeleteCategory({});

  // Product Mutations
  const { 
    mutate: addProductFn, 
    isPending: isAddProductFnPending 
  } = useAddProduct({
    onSuccess: () => {
      setCurrentPage(1);
    }
  });

  const { 
    mutate: updateProductFn, 
    isPending: isUpdateProductFnPending 
  } = useUpdateProduct({});

  const { 
    mutate: deleteProductFn, 
    isPending: isDeleteProductFnPending 
  } = useDeleteProduct({});

  // Category Methods
  const addCategory = (formDataToSend) => {
    addCtegory(formDataToSend);
  };

  const updateCategory = ({ id, categoryData }) => {
    updateCategoryFn({ id, categoryData });
    return true;
  };

  const deleteCategory = (id) => {
    deleteCategoryFn({ id });
    return true;
  };

  // Product Methods
  const addProduct = (formDataToSend) => {
    addProductFn(formDataToSend);
  };

  const updateProduct = ({ id, formDataToSend }) => {
    updateProductFn({ id, formDataToSend });
    return true;
  };

  const deleteProduct = (id) => {
    deleteProductFn({ id });
    return true;
  };

  const deleteProductsByCompany = (companyId) => {
    let deletedCount = getAllProductCountByCompany?.data?.count || 0;
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
      totalProducts: totalRecords,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalValue: 0,
      activeProducts: 0,
      categories: categories,
    };

    products.forEach((product) => {
      if (product.stockQuantity === 0) {
        stats.outOfStockProducts++;
      } else if (product.stockQuantity <= product.lowStockThreshold) {
        stats.lowStockProducts++;
      }

      stats.totalValue += product.price * product.stockQuantity;

      if (product.status === "active") {
        stats.activeProducts++;
      }
    });

    return stats;
  };

  const searchProducts = (query) => {
    // Search is now handled by backend
    return products;
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
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
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

        // Pagination and search state
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        companyFilter,
        setCompanyFilter,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
        totalPages,
        totalRecords,
        isLoading: productListPending,
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