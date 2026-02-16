import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import categoryServices from '../../services/categoryService'

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryServices.updateCategory,
    onSuccess: (res) => {
        // console.log(res);
        queryClient.invalidateQueries(['AllCategories']); 
    }
  });
}
