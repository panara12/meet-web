import { useQueryClient, useMutation } from "@tanstack/react-query";
import subadminServices from "../../services/subadminService";

export function useDeleteSubAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subadminServices.deleteSubadmin,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllSubAdmins']); 
    }
  });
}
