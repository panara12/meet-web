import { useMutation, useQueryClient } from '@tanstack/react-query'
import categoryServices from '../../services/categoryService'

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryServices.addCategory,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['AllCategories']); 
    }
  });
}
