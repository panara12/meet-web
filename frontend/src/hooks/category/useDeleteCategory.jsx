import { useQuery } from '@tanstack/react-query'
import categoryServices from '../../services/categoryService'

export function useDeleteCategory() {
  return useQuery({
    queryKey:["AllCategories"],
    queryFn:()=>categoryServices.deleteCategory(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
