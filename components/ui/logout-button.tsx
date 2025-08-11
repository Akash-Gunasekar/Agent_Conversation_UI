"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {

    setTimeout(() => {
      router.push("/")
    },)
  }

  return (
    <Button
      onClick={handleLogout}
      className="bg-[var(--destructive)] text-white hover:bg-[var(--destructive-foreground)]"
    >
      Logout
    </Button>
  )
}
