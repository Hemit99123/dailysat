import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const handleShowError = (error: any) => {
    if (!(error instanceof AxiosError)) {
        toast.error("Cannot retrieve user data at this time");
        return;
    }
    
    toast.error(error.response?.data.error);
}