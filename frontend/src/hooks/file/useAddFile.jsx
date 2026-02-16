import { useQueryClient, useMutation } from "@tanstack/react-query";
import fileServices from "../../services/fileService";

export function useAddFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fileServices.addFile,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllFiles']); 
    }
  });
}
