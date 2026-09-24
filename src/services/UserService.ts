import { getApiData, postApiData, putApiData, deleteApiData } from "./ApiClient";
import type { IApiResponse } from "../interfaces/I-ApiResponse";
import type { IEmployee } from "../interfaces/I-Employee";
// import type { User } from "../models/User";

export async function getUser() {
    return getApiData<IApiResponse<IEmployee[]>>(
        "http://localhost:3000/user"
    );
}


// This function is used to create a new user, it takes in an object of type IEmployee
export const createUser = async (user: IEmployee) => {
    return postApiData<IEmployee, IApiResponse<IEmployee>>(
        "http://localhost:3000/user",
        user
    );
}

export const updateUser = async ( user: IEmployee) => {
    return putApiData<IEmployee, IApiResponse<IEmployee>>(
        `http://localhost:3000/user/${user.id}`, 
        user
    );
}

export const deleteUser = async (id: number) => {
    return deleteApiData<IApiResponse<IEmployee>>(
        `http://localhost:3000/user/${id}`
    );
}