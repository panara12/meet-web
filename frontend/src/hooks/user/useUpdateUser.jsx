import { useQueryClient, useMutation } from "@tanstack/react-query";
import userServices from "../../services/userService";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userServices.updateUser,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllUser']); 
    }
  });
}
