import { useQueryClient, useMutation } from "@tanstack/react-query";
import fileServices from "../../services/fileService";

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fileServices.deleteFile,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['GetAllFiles']); 
    }
  });
}
