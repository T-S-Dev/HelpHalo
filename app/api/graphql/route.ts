import { NextRequest } from "next/server";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { resolvers } from "@/graphql/resolvers";
import { typeDefs } from "@/graphql/typeDefs";
import getCurrentUser from "@/features/auth/services/clerk/get-current-auth.service";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const { userId } = await getCurrentUser();

    return {
      req,
      userId,
    };
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
