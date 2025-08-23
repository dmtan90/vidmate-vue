import { api, searchParams } from "@/config/api";
import type { EditorTemplate } from "@/types/editor";
import { useInfiniteQuery } from "@tanstack/vue-query";

const baseQuery = "/customer/ads/api/v1/editor";
// const HOST = "https://0.0.0.0";

export interface FetchTemplateParams {
  is_published: boolean;
  limit: number;
  offset?: number;
}

interface FetchTemplatesResponse {
  data: {
    templates: EditorTemplate[];
  };
}

export async function fetchVideoTemplates(url: string) {
  console.log("fetchVideoTemplates", url);
  const sParams = searchParams(url);
  const query = sParams.get("query");
  const published = sParams.get("public") || true;
  const page = parseInt(sParams.get("page") || '0');
  const perPage = parseInt(sParams.get("per_page") || '100');
  const params = {
    is_published: published,
    limit: perPage,
    offset: page,
    query: query
  };

  const response = await api.get<FetchTemplatesResponse>(`${baseQuery}/video-templates/all`, { params });
  let templateMap : EditorTemplate[] = [];
  try{
    const templates = response.data.data.templates;
    // const data: EditorTemplate = await response.json();
    templates.forEach(template => {
      try{
        const pages = JSON.parse(template.pages);
        template.pages = pages;
      }catch(err){
        console.log(err);
        template.pages = [];
      }
      templateMap.push(template);
    })
    return {
      success: true,
      error: "",
      status: 200,
      data: {
        templates: templateMap,
        total_results: templateMap.length,
        page: page,
        per_page: perPage,
        next_page: perPage == templateMap.length ? true : false,
        prev_page: page > 0 ? true : false,
      }
    };
  }catch(err){
    console.error("Template API error:", error);
    return {
      success: false,
      error: "Failed to fetch templates",
      status: 500,
    }
  }
}

// function useFetchVideoTemplates(params: FetchTemplateParams) {
//   return useInfiniteQuery({
//     queryKey: [fetchVideoTemplates.name],
//     queryFn: ({ pageParam: offset }) => fetchVideoTemplates({ ...params, offset }),
//     initialPageParam: 0,
//     getNextPageParam: (page, _, param) => {
//       console.log(page, _, param);
//       if (!page.length) return undefined;
//       return param + params.limit;
//     },
//   });
// }

// export { fetchVideoTemplates, useFetchVideoTemplates };
