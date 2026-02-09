import { useQueryClient, useMutation } from "@tanstack/react-query";
import subadminServices from "../../services/subadminService";

export function useSubAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subadminServices.subAdminLogin,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllSubAdmins']); 
    }
  });
}
