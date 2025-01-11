import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type MorePost = PageObjectResponse & {
  properties: {
    Title: { title: Array<{ plain_text: string }> };
    Date: { created_time: string };
    Excerpt: { rich_text: Array<{ plain_text: string }> };
    Categories: { multi_select: Array<{ name: string }> };
    slug: { rich_text: Array<{ plain_text: string }> };
  };
  cover?: {
    external?: { url: string };
    file?: { url: string };
  };
};
