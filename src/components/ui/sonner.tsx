import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-noto group-[.toaster]:bg-zinc-200 group-[.toaster]:text-zinc-900 group-[.toaster]:border-zinc-300 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-zinc-600",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-zinc-300 group-[.toast]:text-zinc-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
