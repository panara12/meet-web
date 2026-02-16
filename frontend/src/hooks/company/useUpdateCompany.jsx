import { useQueryClient, useMutation } from "@tanstack/react-query";
import companyServices from "../../services/companyServices";

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyServices.UpdateCompany,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllCompany']); 
    }
  });
}
