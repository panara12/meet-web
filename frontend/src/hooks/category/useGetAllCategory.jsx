import { useQuery } from '@tanstack/react-query'
import categoryServices from '../../services/categoryService'

export function useGetAllCategory() {
  return useQuery({
    queryKey:["AllCategories"],
    queryFn:()=>categoryServices.getAllCategoryList(),
    onSuccess:(res)=>{
        return res.data;
    }
  })
}
