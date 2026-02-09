import { useQueryClient, useMutation } from "@tanstack/react-query";
import userServices from "../../services/userService";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userServices.deleteUser,
    onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(['GetAllUser']);
    }
  });
}
