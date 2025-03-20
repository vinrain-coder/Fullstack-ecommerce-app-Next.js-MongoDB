import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import WishlistPage from "@/components/shared/wishlist";

export default async function Wishlist() {
  return (
    <>
      <WishlistPage />
      <div className="p-4 bg-background">
        <BrowsingHistoryList />
      </div>
    </>
  );
}
