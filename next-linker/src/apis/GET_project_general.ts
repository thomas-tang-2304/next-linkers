import axios from "axios";

export const GET_project_general = async (project_id: string, is_started: boolean) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:3002/links/send-link?project_id=${project_id}&is_started=${is_started}`,
    headers: {},
  };

  return axios.request(config);
};
