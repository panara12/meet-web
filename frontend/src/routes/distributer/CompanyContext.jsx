import { createContext, useContext, useState, useEffect } from "react";
import { useAddCompany } from "../../hooks/company/useAddCompany";
import { useGetAllCompany } from "../../hooks/company/useGetAllCompany";
import { useUpdateCompany } from "../../hooks/company/useUpdateCompany";
import { useDeleteCompany } from "../../hooks/company/useDeleteCompany";

const CompanyContext = createContext(undefined);

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: getCompanyList, isPending: companyListPending, isError: isCompanyListError, error: companyListError } = useGetAllCompany({
    page: currentPage,
    limit: limit,
    search: debouncedSearch,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sortField: sortField,
    sortDirection: sortDirection
  });

  useEffect(() => {
    if (getCompanyList?.company) {
      setCompanies(getCompanyList.company.data || []);
      if (getCompanyList.company.pagination) {
        setTotalPages(getCompanyList.company.pagination.totalPages);
        setTotalRecords(getCompanyList.company.pagination.totalRecords);
      }
    }
  }, [getCompanyList]);

  const { mutate: addCompanyFn, isPending: isAddCompanyFnPending } = useAddCompany({
    onSuccess: () => {
      // Refetch or update the list
      setCurrentPage(1);
    }
  });
  
  const { mutate: updateCompanyFn, isPending: isUpdateCompanyFnPending } = useUpdateCompany({
    onSuccess: () => {
      // Data will be refetched automatically
    }
  });
  
  const { mutate: deleteCompanyFn, isPending: isDeleteCompanyFnPending } = useDeleteCompany({
    onSuccess: () => {
      // Data will be refetched automatically
    }
  });

  const addCompany = (companyData) => {
    addCompanyFn(companyData);
  };

  const updateCompany = (id, updates) => {
    updateCompanyFn({ id, updates });
  };

  const deleteCompany = (id) => {
    deleteCompanyFn({ id });
  };

  const getCompany = (id) => {
    return companies.find((company) => company._id === id);
  };

  const incrementProductsCount = (companyId) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company._id === companyId
          ? {
              ...company,
              productsCount: company.productsCount + 1,
              updatedAt: new Date().toISOString(),
            }
          : company
      )
    );
  };

  const decrementProductsCount = (companyId) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company._id === companyId
          ? {
              ...company,
              productsCount: Math.max(0, company.productsCount - 1),
              updatedAt: new Date().toISOString(),
            }
          : company
      )
    );
  };

  const resetProductsCount = (companyId) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company._id === companyId
          ? { ...company, productsCount: 0, updatedAt: new Date().toISOString() }
          : company
      )
    );
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        addCompany,
        updateCompany,
        deleteCompany,
        getCompany,
        incrementProductsCount,
        decrementProductsCount,
        resetProductsCount,
        // Pagination and filters
        currentPage,
        setCurrentPage,
        limit,
        setLimit,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
        totalPages,
        totalRecords,
        isLoading: companyListPending,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};