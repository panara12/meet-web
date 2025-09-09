import { useMutation } from '@tanstack/react-query'
import distributerServices from '../../services/distributerService'
import { useNavigate } from 'react-router-dom';

export function addSalesman() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn:distributerServices.AddSalesman,
    onSuccess : (res)=>{
        if(res.status == 200){
            navigate('/distributer/salesman')
        }
    },
    onError : (err)=>{
        console.log(err);
    }
  })
}
