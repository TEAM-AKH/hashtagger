
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft, PanelLeftClose, PanelRight, PanelRightClose } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

type SidebarContextProps = {
  isMobile: boolean
  isDesktopExpanded: boolean
  isMobileExpanded: boolean
  setIsDesktopExpanded: React.Dispatch<React.SetStateAction<boolean>>
  setIsMobileExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)
function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [isDesktopExpanded, setIsDesktopExpanded] = React.useState(true)
  const [isMobileExpanded, setIsMobileExpanded] = React.useState(false)

  return (
    <SidebarContext.Provider
      value={{
        isMobile,
        isDesktopExpanded: isMobile ? false : isDesktopExpanded,
        isMobileExpanded: isMobile ? isMobileExpanded : false,
        setIsDesktopExpanded,
        setIsMobileExpanded,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isDesktopExpanded } = useSidebar()
    return (
      <div
        ref={ref}
        data-expanded={isDesktopExpanded}
        className={cn("hidden md:flex text-sidebar-foreground flex-col border-r transition-all duration-300 ease-in-out", isDesktopExpanded ? 'w-64' : 'w-16', className)}
        {...props}
      >
        <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col items-center bg-sidebar p-2"
          >
            {children}
          </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-auto w-full items-stretch py-2",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col items-stretch gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative w-full", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-gradient-to-r from-blue-500 to-cyan-400 data-[active=true]:font-semibold data-[active=true]:text-white [&>span]:truncate [&>svg]:size-6 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
      size: {
        default: "h-10 text-sm",
        sm: "h-8 text-xs",
        lg: "h-12 text-base font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isDesktopExpanded } = useSidebar()
    
    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), !isDesktopExpanded && "justify-center", className)}
        {...props}
      >
        {children}
      </Comp>
    )
    
    return button
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

function SidebarTrigger({ className }: { className?: string }) {
  const { isDesktopExpanded, setIsDesktopExpanded } = useSidebar()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("hidden md:flex", className)}
      onClick={() => setIsDesktopExpanded(!isDesktopExpanded)}
    >
      {isDesktopExpanded ? <PanelLeftClose /> : <PanelLeft />}
    </Button>
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
  SidebarTrigger,
}
