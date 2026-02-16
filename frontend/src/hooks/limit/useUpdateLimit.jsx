import { useQueryClient, useMutation } from "@tanstack/react-query";
import limitServices from "../../services/limitService";

export function useUpdateLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: limitServices.UpdateLimits,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllLimits']); 
    }
  });
}
