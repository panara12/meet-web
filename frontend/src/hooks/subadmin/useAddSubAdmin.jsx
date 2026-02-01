import { useQueryClient, useMutation } from "@tanstack/react-query";
import subadminServices from "../../services/subadminService";

export function useAddSubAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subadminServices.addSubadmin,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllSubAdmins']); 
    }
  });
}
