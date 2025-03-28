export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex flex-col p-4">{children}</main>;
}
