import axios from "axios"

interface ApiOptions {
  method: string
  path: string
  body?: object
  query?: object
}

export async function apiBuilder({ method, path, body, query }: ApiOptions) {
  const API_SERVER = import.meta.env.VITE_API_URL

  switch (method) {
    case "GET":
      return await axios.get(API_SERVER + path, { params: query || {} })
    case "PUT":
      return await axios.put(API_SERVER + path, body)
    case "POST":
      return await axios.post(API_SERVER + path, body)
    case "DELETE":
      return await axios.delete(API_SERVER + path, { data: body })
    case "PATCH":
      return await axios.patch(API_SERVER + path, body)
    default:
      throw new Error("Invalid HTTP method")
  }
}
