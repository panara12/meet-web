import { useMutation, useQueryClient } from "@tanstack/react-query";
import tenantServices from "../../services/tenantService";

export function useAddTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tenantServices.addTenant,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllTenant']); 
    }
  });
}
