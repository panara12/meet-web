const ShowError = ({error})=>{
    return (
        <div className="mt-3 rounded-md border border-red-500 bg-red-100/70 p-3 text-sm text-red-700">
            {error?.response?.data?.message || "Something went wrong"}
        </div>
    )
}

export default ShowError