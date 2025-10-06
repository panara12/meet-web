import { useQueryClient, useMutation } from "@tanstack/react-query";
import companyServices from "../../services/companyServices";

export function useAddCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyServices.AddCompany,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllCompany']); 
    }
  });
}
