import { useQueryClient, useMutation } from "@tanstack/react-query";
import sellerServices from "../../services/clientService";

export function useUpdateSeller() {
  console.log("clalled")
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sellerServices.updateSeller,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllSeller']); 
    }
  });
}
