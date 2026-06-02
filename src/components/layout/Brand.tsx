import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Brand lockup: the Football IQ icon + optional wordmark. */
export function Brand({
  href = "/",
  size = 40,
  textClass = "text-lg",
  showText = true,
  className,
}: {
  href?: string;
  size?: number;
  textClass?: string;
  showText?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/icon-192.png"
        alt="Football IQ"
        width={size}
        height={size}
        priority
        className="rounded-xl"
        style={{ width: size, height: size }}
      />
      {showText && (
        <span className={cn("font-extrabold tracking-tight", textClass)}>
          Football<span className="text-pitch">IQ</span>
        </span>
      )}
    </Link>
  );
}
