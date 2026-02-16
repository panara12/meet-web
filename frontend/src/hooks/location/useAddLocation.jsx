import { useQueryClient, useMutation } from "@tanstack/react-query";
import locationServices from "../../services/locationService";

export function useAddLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationServices.AddLocation,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['SalesmanLocation']); 
    }
  });
}
