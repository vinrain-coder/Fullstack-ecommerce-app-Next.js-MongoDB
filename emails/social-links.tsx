import { Img, Link } from "@react-email/components";

export default function SocialLinks() {
  const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL || "#";
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL || "#";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";

  return (
    <div className="text-gray-500 text-sm mt-4 text-center">
      <p className="font-semibold">Follow us for the latest drops & deals:</p>
      <p className="flex justify-center gap-3 mt-2">
        <Link href={instagramUrl} target="_blank">
          <Img
            src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/instagram.svg"
            alt="Instagram"
            width="24"
            height="24"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
        </Link>
        <Link href={tiktokUrl} target="_blank">
          <Img
            src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tiktok.svg"
            alt="TikTok"
            width="24"
            height="24"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
        </Link>
        <Link href={facebookUrl} target="_blank">
          <Img
            src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/facebook.svg"
            alt="Facebook"
            width="24"
            height="24"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
        </Link>
        <Link href={twitterUrl} target="_blank">
          <Img
            src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/x.svg"
            alt="X/Twitter"
            width="24"
            height="24"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
        </Link>
      </p>
    </div>
  );
}
