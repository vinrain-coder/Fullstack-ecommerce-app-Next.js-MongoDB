import WishlistPage from "@/components/shared/wishlist";
import { getWishlistProducts } from "@/lib/actions/wishlist.actions";

export default async function Wishlist() {
  const products = await getWishlistProducts(); // ✅ Fetch data on the server

  return <WishlistPage products={products} />;
}
