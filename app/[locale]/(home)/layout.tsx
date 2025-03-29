export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex flex-col">{children}</main>;
}
