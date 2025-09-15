 
 

export const POST_create_file = async (initialProject: any) => {
var myHeaders = new Headers();

      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(initialProject);

      var requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

       return fetch("http://localhost:3002/links/create-file", requestOptions)
          .then((response) => response.text())
          .then((result) => result)
          .catch((error) => error)
         
};


export const POST_delete_file = async (project_id: any) => {
var myHeaders = new Headers();

      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({project_id});

      var requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

       return fetch("http://http://localhost/:3002/links/delete-file", requestOptions)
          .then((response) => response.text())
          .then((result) => result)
          .catch((error) => error)
         
};
