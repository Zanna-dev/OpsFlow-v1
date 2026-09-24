// Generic API service that can be reused across the app
// Resusable function to make an http request and return the response data
// import type { Employee } from "../models/Employee";
// import type { IEmployee } from "../interfaces/I-Employee";


export async function getApiData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// url is the url of the resource to be created, data is the data to be sent in the request body
export async function postApiData<requestType, responseType>(
    url: string, data: requestType): Promise<responseType> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}


// url is the url of the resource to be updated, data is the data to be sent in the request body
export async function putApiData<requestType, responseType>(url: string, data: requestType): Promise<responseType> {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}


export async function deleteApiData<responseType>(url: string): Promise<responseType> {
    const response = await fetch(url, {
        method: "DELETE",
    });

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}
