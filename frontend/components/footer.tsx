import Link from "next/link"
import { Dna } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Dna className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold text-foreground">
              GeneScope<span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GeneScope AI
          </p>
        </div>
      </div>
    </footer>
  )
}
