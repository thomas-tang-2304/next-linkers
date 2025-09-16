import axios from "axios";

export const GET_project_general = async (project_id: string) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:3002/links/send-link?project_id=${project_id}`,
    headers: {},
  };

  return axios.request(config);
};
