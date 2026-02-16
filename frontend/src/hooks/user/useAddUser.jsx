import { useQueryClient, useMutation } from "@tanstack/react-query";
import userServices from "../../services/userService";

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userServices.addUser,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllUser']);
    }
  });
}
