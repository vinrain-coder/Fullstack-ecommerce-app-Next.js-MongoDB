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
            src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000"
            alt="Instagram"
            width="24"
            height="24"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
        </Link>
        <Link href={tiktokUrl} target="_blank">
          <Img
            src="https://img.icons8.com/?size=100&id=118640&format=png&color=000000"
            alt="TikTok"
            width="24"
            height="24"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
        </Link>
        <Link href={facebookUrl} target="_blank">
          <Img
            src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000"
            alt="Facebook"
            width="24"
            height="24"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          />
        </Link>
        <Link href={twitterUrl} target="_blank">
          <Img
            src="https://img.icons8.com/?size=100&id=phOKFKYpe00C&format=png&color=000000"
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
