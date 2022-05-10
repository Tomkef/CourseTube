import { useState } from "react";
import axios, { AxiosResponse } from "axios";

type Data = {
  result?: any;
  message: string;
  status: "Success" | "Error" | "Pending" | "Idle";
};

type getDataParams = {
  url: string;
  method: "PUT" | "DELETE" | "POST" | "PATCH" | "GET";
  body?: string;
};

export default function useAxios() {
  const [data, setData] = useState<Data>({
    result: null,
    message: null,
    status: "Idle",
  });
  const fetchData = async ({ url, method, body }: getDataParams) => {
    try {
      let response: AxiosResponse;
      setData((prev) => ({ ...prev, status: "Idle" }));
      switch (method) {
        case "PUT":
          response = await axios.put(url, body);
        case "DELETE":
          response = await axios.delete(url);
          break;

        case "POST":
          response = await axios.post(url, body);
          break;

        case "PATCH":
          response = await axios.patch(url, body);
          break;

        case "GET":
          response = await axios.get(url);
          break;

        default:
          break;
      }
      setData({
        status: "Success",
        result: response.data.result,
        message: response.data.message,
      });
    } catch (error) {
      setData({ status: "Error", message: error.response.data.message });
    }
  };

  return { data, fetchData };
}
