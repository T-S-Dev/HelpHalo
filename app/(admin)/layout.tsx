import ApolloProvider from "@/features/admin/shared/components/ApolloProvider";
import Header from "@/features/admin/shared/components/Header";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProvider>
      <div className="flex flex-1 flex-col">
        <Header />
        {children}
      </div>
    </ApolloProvider>
  );
}
