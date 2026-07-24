// Theme module: pages
//
// Presentation for Tebex CMS pages (app/(store)/pages/[slug]). `CMSPage` is
// the only piece: the page itself is just a title plus a rich-text body, so
// there's nothing else here to split out without introducing a wrapper
// component that would only ever have this one caller.
export { CMSPage } from "./cms-page";
