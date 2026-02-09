import { useQueryClient, useMutation } from "@tanstack/react-query";
import companyServices from "../../services/companyServices";

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyServices.deleteCompany,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllCompany']); 
    }
  });
}
