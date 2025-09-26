import { useEffect, useState } from "react";

export function useScrollTo() {
  const scrollTo = (elementId: string) => {
    try {
      const element = document.getElementById(elementId);
      if (element) {
        // Add offset to ensure the element is clearly visible
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 100;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // Add temporary visual feedback
        element.style.transition = "opacity 0.3s ease";
        element.style.opacity = "0.7";
        setTimeout(() => {
          element.style.opacity = "1";
        }, 300);
      } else {
        console.warn(`Element with id '${elementId}' not found for scrollTo`);
      }
    } catch (error) {
      console.error("ScrollTo error:", error);
      // Fallback: try to scroll to top if there's an error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return scrollTo;
}

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}
