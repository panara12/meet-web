import { useQueryClient, useMutation } from "@tanstack/react-query";
import subadminServices from "../../services/subadminService";

export function useUpdateSubAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subadminServices.editSubadmin,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllSubAdmins']); 
    }
  });
}
