import { useQueryClient,useMutation } from '@tanstack/react-query'
import categoryServices from '../../services/categoryService'

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryServices.deleteCategory,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['AllCategories']); 
    }
  });
}
