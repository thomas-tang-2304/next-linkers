
 export  const GET_links_result_pagination = (
    id_: string,
    _filter_tabs: string[],
    pagination_state: {limit: number, page: number},
    search_input: string,
    setSpinning: (state: boolean) => void,
    setTotalLink: (data: any) => void,
    setLinksData: (data: any) => void
  ): any => {
    var requestOptions: any = {
      method: "GET",
      redirect: "follow",
    };
    setSpinning(true);
    fetch(
      `http://localhost:3002/links/get-crawled-link-data?project_id=${id_}&filter_tab=${JSON.stringify(
        _filter_tabs
      )}&search_input=${search_input}&limit=${pagination_state.limit}&page=${pagination_state.page}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result: any) => {
        setTotalLink(JSON.parse(result).total);
        setLinksData(JSON.parse(result).data);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setSpinning(false);
      });
  };
