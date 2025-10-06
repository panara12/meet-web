import { createContext, useContext, useState } from "react";
import { useAddCompany } from "../../hooks/company/useAddCompany";
import { useGetAllCompany } from "../../hooks/company/useGetAllCompany";
import { useEffect } from "react";
import { useUpdateCompany } from "../../hooks/company/useUpdateCompany";
import { useDeleteCompany } from "../../hooks/company/useDeleteCompany";


const CompanyContext = createContext(undefined);

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const { data: getCompantList, isPending:CompantListPending, isError:isCompantListError, error:CompantListError } = useGetAllCompany();
  
  useEffect(()=>{
    if(getCompantList?.data){
      setCompanies(getCompantList.data.company)
    }
  },[getCompantList])

  const {mutate:addCompanyFn,isPending:isAddCompanyFnPending, isError:isAddCompanyFnError, error:addCompanyFnError} = useAddCompany({})
  const {mutate:updateCompanyFn,isPending:isUpdateCompanyFnPending, isError:isUpdateCompanyFnError, error:updateCompanyFnError} = useUpdateCompany({})
  const {mutate:deleteCompanyFn,isPending:isDeleteCompanyFnPending, isError:isDeleteCompanyFnError, error:deleteCompanyFnError} = useDeleteCompany({})

  const addCompany = (companyData) => {
    addCompanyFn(companyData)
  };

  const updateCompany = (id, updates) => {
    updateCompanyFn({id,updates})
  };

  const deleteCompany = (id) => {
    deleteCompanyFn({id})
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
