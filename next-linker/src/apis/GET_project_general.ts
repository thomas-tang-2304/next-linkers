import axios from "axios";

export const GET_project_general = async (project_id: string) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://192.168.1.229:3002/links/send-link?project_id=${project_id}`,
    headers: {},
  };

  return axios.request(config);
};
