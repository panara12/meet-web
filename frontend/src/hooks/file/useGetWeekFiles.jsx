import { useQuery } from "@tanstack/react-query";
import fileServices from "../../services/fileService";

export function useGetWeekFiles() {
  return useQuery({
    queryKey: ['GetWeekFiles'],
    queryFn: fileServices.getWeekFiles,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}