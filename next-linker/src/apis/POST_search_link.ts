
export const POST_find_link_from = async (project_id: string, search_link: string) => {
 var myHeaders = new Headers();

      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({project_id, target: _id, tag,});

      var requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

       return fetch("http://localhost:3002/find", requestOptions)
          .then((response) => response.text())
          .then((result) => result)
          .catch((error) => error)
};
