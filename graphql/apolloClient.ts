import { ApolloClient, InMemoryCache } from "@apollo/client";

export const BASE_URL =
  process.env.NODE_ENV !== "development" ? process.env.NEXT_PUBLIC_API_BASE_URL : "http://localhost:3000";

const client = new ApolloClient({
  uri: `${BASE_URL}/api/graphql`,
  cache: new InMemoryCache(),
});

export default client;
