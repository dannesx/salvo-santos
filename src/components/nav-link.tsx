import type { ReactNode } from "react"
import { Link, type LinkProps } from "react-router"
import { Button } from "./ui/button"

type Props = LinkProps & {
  children: ReactNode
}

const NavLink = ({ children, ...linkProps }: Props) => {
  return (
    <Button asChild variant="link" className="text-lg hover:brightness-80">
      <Link {...linkProps} className="">
        {children}
      </Link>
    </Button>
  )
}

export default NavLink
