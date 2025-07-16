import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      duration={2500} // ⏱️ Reduced stay time
      toastOptions={{
        className:
          "border border-neutral-300 dark:border-neutral-700 bg-gradient-to-br from-background to-muted text-foreground shadow-xl rounded-2xl px-4 py-3 backdrop-blur-md transition-all duration-300 ease-in-out",
        style: {
          animation: "fadeInUp 0.3s ease-out",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
