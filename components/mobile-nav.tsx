"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Users, Bed, Calendar, CreditCard, UserCheck, Settings, Home } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/guests", label: "Guests", icon: Users },
    { href: "/rooms", label: "Rooms", icon: Bed },
    { href: "/bookings", label: "Bookings", icon: Calendar },
    { href: "/payments", label: "Payments", icon: CreditCard },
    { href: "/staff", label: "Staff", icon: UserCheck },
    { href: "/services", label: "Services", icon: Settings },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col space-y-4 mt-8">
          <div className="px-2">
            <h2 className="text-lg font-semibold">Guest House</h2>
            <p className="text-sm text-muted-foreground">Management System</p>
          </div>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
