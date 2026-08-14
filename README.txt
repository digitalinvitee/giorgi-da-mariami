MARIAM & GIORGI — RESPONSIVE FIXED BUILD
========================================

Main fixes:
- Removed malformed stray HTML character in the cinematic section.
- HTML / CSS / JS cinematic selectors now match each other.
- Current assets are preserved: back1.png, dancing-woman.png, dancing-man.webp, couple.png, music.png, waiter.png, waiter-shadow.png, cupid.png.
- Cinematic animation is autoplay/time-driven, not scroll-progress-driven.
- Background is static; the wedding-character world moves slowly; waiter crosses independently.
- Animation automatically pauses off-screen and when the browser tab is hidden.
- Added a soft loop curtain so the restart does not flash.
- Added desktop / tablet / mobile sizing for the cinematic scene.
- Added a no-GSAP fallback so the site cannot remain permanently locked if the CDN fails.
- Existing envelope, gallery fallback, details, dress code, countdown and RSVP validation remain intact.

Put these files next to your existing assets/ folder:
index.html
style.css
script.js
