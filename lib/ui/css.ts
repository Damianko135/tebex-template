// CSS Updater, via Cache, redis/valkey

// Does not hold the :root css tag. Generate per user, fetch from valkey or redis
import * as css from "./costum.css" ;

// Default theme
import * as defaultCSS from "./default.css" ;


export default function getCSS() {
    if (css) {
        return css;
    } else {
        return defaultCSS;
    }
}

export function getDefaultCSS() {
    return defaultCSS;
}

export function getCostumCSS() {
    return css;
}


export function updateCSS(newCSS: string) {
    // TODO: 
    // Implement the actual update logic for CSS in the cache or redis/valkey
    console.log("Updating CSS to:", newCSS);
}









// THIS IS THE DEFAULT CSS:
// :root {
//   --background: oklch(1 0 0);
//   --foreground: oklch(0.145 0 0);
//   --card: oklch(1 0 0);
//   --card-foreground: oklch(0.145 0 0);
//   --popover: oklch(1 0 0);
//   --popover-foreground: oklch(0.145 0 0);
//   --primary: oklch(0.205 0 0);
//   --primary-foreground: oklch(0.985 0 0);
//   --secondary: oklch(0.97 0 0);
//   --secondary-foreground: oklch(0.205 0 0);
//   --muted: oklch(0.97 0 0);
//   --muted-foreground: oklch(0.556 0 0);
//   --accent: oklch(0.97 0 0);
//   --accent-foreground: oklch(0.205 0 0);
//   --destructive: oklch(0.577 0.245 27.325);
//   --border: oklch(0.922 0 0);
//   --input: oklch(0.922 0 0);
//   --ring: oklch(0.708 0 0);
//   --chart-1: oklch(0.87 0 0);
//   --chart-2: oklch(0.556 0 0);
//   --chart-3: oklch(0.439 0 0);
//   --chart-4: oklch(0.371 0 0);
//   --chart-5: oklch(0.269 0 0);
//   --radius: 0.625rem;
//   --sidebar: oklch(0.985 0 0);
//   --sidebar-foreground: oklch(0.145 0 0);
//   --sidebar-primary: oklch(0.205 0 0);
//   --sidebar-primary-foreground: oklch(0.985 0 0);
//   --sidebar-accent: oklch(0.97 0 0);
//   --sidebar-accent-foreground: oklch(0.205 0 0);
//   --sidebar-border: oklch(0.922 0 0);
//   --sidebar-ring: oklch(0.708 0 0);
// }
// .dark {
//   --background: oklch(0.145 0 0);
//   --foreground: oklch(0.985 0 0);
//   --card: oklch(0.205 0 0);
//   --card-foreground: oklch(0.985 0 0);
//   --popover: oklch(0.205 0 0);
//   --popover-foreground: oklch(0.985 0 0);
//   --primary: oklch(0.922 0 0);
//   --primary-foreground: oklch(0.205 0 0);
//   --secondary: oklch(0.269 0 0);
//   --secondary-foreground: oklch(0.985 0 0);
//   --muted: oklch(0.269 0 0);
//   --muted-foreground: oklch(0.708 0 0);
//   --accent: oklch(0.269 0 0);
//   --accent-foreground: oklch(0.985 0 0);
//   --destructive: oklch(0.704 0.191 22.216);
//   --border: oklch(1 0 0 / 10%);
//   --input: oklch(1 0 0 / 15%);
//   --ring: oklch(0.556 0 0);
//   --chart-1: oklch(0.87 0 0);
//   --chart-2: oklch(0.556 0 0);
//   --chart-3: oklch(0.439 0 0);
//   --chart-4: oklch(0.371 0 0);
//   --chart-5: oklch(0.269 0 0);
//   --sidebar: oklch(0.205 0 0);
//   --sidebar-foreground: oklch(0.985 0 0);
//   --sidebar-primary: oklch(0.488 0.243 264.376);
//   --sidebar-primary-foreground: oklch(0.985 0 0);
//   --sidebar-accent: oklch(0.269 0 0);
//   --sidebar-accent-foreground: oklch(0.985 0 0);
//   --sidebar-border: oklch(1 0 0 / 10%);
//   --sidebar-ring: oklch(0.556 0 0);
// }