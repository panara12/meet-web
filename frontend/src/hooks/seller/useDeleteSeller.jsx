import { useQueryClient, useMutation } from "@tanstack/react-query";
import sellerServices from "../../services/clientService";

export function useDeleteSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sellerServices.deleteSeller,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllSeller']);
    }
  });
}
