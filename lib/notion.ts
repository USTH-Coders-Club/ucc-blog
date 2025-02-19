import "server-only";
import React from "react";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export const fetchPages = async () => {
  return notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      status: {
        equals: "Live",
      },
    },
  });
};

export const fetchMorePost = async () => {
  return notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      status: {
        equals: "Live",
      },
    },
    page_size: 3,
  });
};

export const fetchBySlug = React.cache(async (slug: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "slug",
      rich_text: {
        equals: slug,
      },
    },
  });
  return response.results[0] as PageObjectResponse | undefined;
});

export const fetchPagesBlocks = React.cache(async (pageId: string) => {
  const response = await notion.blocks.children.list({
    block_id: pageId,
  });
  return response.results as BlockObjectResponse[];
});

export const searchPages = React.cache(async (query: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Status",
          status: {
            equals: "Live",
          },
        },
        {
          or: [
            {
              property: "Title",
              rich_text: {
                contains: query,
              },
            },
          ],
        },
      ],
    },
  });
  return response.results as PageObjectResponse[];
});

export const fetchPaginatedPages = async (page: number = 1, pageSize: number = 5, category: string = "All") => {
  const baseFilter = {
    property: "Status",
    status: {
      equals: "Live",
    },
  };

  const categoryFilter = category !== "All" ? {
    property: "Categories",
    multi_select: {
      contains: category,
    },
  } : undefined;

  const filter = categoryFilter 
    ? { and: [baseFilter, categoryFilter] }
    : baseFilter;

  const allPages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter,
  });

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    results: allPages.results.slice(start, end),
    total: allPages.results.length,
    page,
    pageSize,
    totalPages: Math.ceil(allPages.results.length / pageSize),
  };
};
