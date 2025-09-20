import { createContext, useContext, useState } from "react";

const CompanyContext = createContext(undefined);

// Initial mock data
const initialCompanies = [
  {
    id: "comp-001",
    name: "TechCorp Solutions",
    description: "Leading technology solutions provider",
    industry: "Technology",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    phone: "+1 (555) 123-4567",
    email: "contact@techcorp.com",
    website: "https://techcorp.com",
    establishedDate: "2010-01-15",
    status: "active",
    gstNumber: "29AABCT1332L2ZG",
    panNumber: "AABCT1332L",
    accountNumber: "1234567890123456",
    bankDetails: {
      bankName: "State Bank of India",
      branchName: "Silicon Valley Branch",
      ifscCode: "SBIN0001234",
      accountHolderName: "TechCorp Solutions Pvt Ltd",
      accountType: "current",
      swiftCode: "SBININBB123",
    },
    productsCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "comp-002",
    name: "Green Earth Industries",
    description: "Sustainable products and eco-friendly solutions",
    industry: "Environmental",
    address: "456 Green Avenue, Portland, OR 97201",
    phone: "+1 (555) 987-6543",
    email: "info@greenearth.com",
    website: "https://greenearth.com",
    establishedDate: "2015-03-22",
    status: "active",
    gstNumber: "27AABCG1234H1ZX",
    panNumber: "AABCG1234H",
    accountNumber: "9876543210987654",
    bankDetails: {
      bankName: "HDFC Bank",
      branchName: "Portland Main Branch",
      ifscCode: "HDFC0004567",
      accountHolderName: "Green Earth Industries Ltd",
      accountType: "current",
      swiftCode: "HDFCINBB456",
    },
    productsCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState(initialCompanies);

  const addCompany = (companyData) => {
    const newCompany = {
      ...companyData,
      id: `comp-${Date.now()}`,
      productsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCompanies((prev) => [...prev, newCompany]);
    return newCompany.id;
  };

  const updateCompany = (id, updates) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id
          ? { ...company, ...updates, updatedAt: new Date().toISOString() }
          : company
      )
    );
    return true;
  };

  const deleteCompany = (id) => {
    setCompanies((prev) => prev.filter((company) => company.id !== id));
    return true;
  };

  const getCompany = (id) => {
    return companies.find((company) => company.id === id);
  };

  const incrementProductsCount = (companyId) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === companyId
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
        company.id === companyId
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
        company.id === companyId
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
