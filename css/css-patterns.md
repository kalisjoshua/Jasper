# CSS Patterns

```css
html {
  --s: 220px; /* control the size */
  --c1: #774F38;
  --c2: #F1D4AF;
  
  --_g:radial-gradient(#0000 60%,var(--c1) 61% 63%,#0000 64% 77%,var(--c1) 78% 80%,#0000 81%);
  --_c:,#0000 75%,var(--c2) 0;
  background:
    conic-gradient(at 12% 20% var(--_c)) calc(var(--s)* .44) calc(.9*var(--s)),
    conic-gradient(at 12% 20% var(--_c)) calc(var(--s)*-.06) calc(.4*var(--s)),
    conic-gradient(at 20% 12% var(--_c)) calc(.9*var(--s)) calc(var(--s)* .44),
    conic-gradient(at 20% 12% var(--_c)) calc(.4*var(--s)) calc(var(--s)*-.06),
    var(--_g),var(--_g) calc(var(--s)/2) calc(var(--s)/2) var(--c2);
  background-size: var(--s) var(--s);
}

html {
  --s: 120px; /* control the size*/
  
  --_g: radial-gradient(#0000 70%,#1a2030 71%);
  background:
    var(--_g),var(--_g) calc(var(--s)/2) calc(var(--s)/2),
    conic-gradient(#0f9177 25%,#fdebad 0 50%,#d34434 0 75%,#b5d999 0);
  background-size: var(--s) var(--s); 
}

html {
  --s: 80px; /* the size */
  --c: #5E8C6A;
  
  --_s: calc(2*var(--s)) calc(2*var(--s));
  --_g: 35.36% 35.36% at;
  --_c: #0000 66%,#BFB35A 68% 70%,#0000 72%;
  background:
    radial-gradient(var(--_g) 100% 25%,var(--_c)) var(--s) var(--s)/var(--_s),
    radial-gradient(var(--_g) 0    75%,var(--_c)) var(--s) var(--s)/var(--_s),
    radial-gradient(var(--_g) 100% 25%,var(--_c)) 0 0/var(--_s),
    radial-gradient(var(--_g) 0    75%,var(--_c)) 0 0/var(--_s),
    repeating-conic-gradient(var(--c) 0 25%,#0000 0 50%) 0 0/var(--_s),
    radial-gradient(var(--_c)) 0 calc(var(--s)/2)/var(--s) var(--s)
    var(--c);
}

html {
  --s: 60px; /* control the size */
  
  --_g: #0000 83%,#b09f79 85% 99%,#0000 101%;
  background:
    radial-gradient(27% 29% at right ,var(--_g)) calc(var(--s)/ 2) var(--s),
    radial-gradient(27% 29% at left  ,var(--_g)) calc(var(--s)/-2) var(--s),
    radial-gradient(29% 27% at top   ,var(--_g)) 0 calc(var(--s)/ 2),
    radial-gradient(29% 27% at bottom,var(--_g)) 0 calc(var(--s)/-2)
    #476074;
  background-size: calc(2*var(--s)) calc(2*var(--s));
}

html {
  --s: 30px; /* control the size */
  
  --_c: #5E9FA3;
  background:
    conic-gradient(at 50% calc(100%/6),var(--_c) 60deg,#0000 0),
    conic-gradient(at calc(100%/6) 50%,#0000 240deg,var(--_c) 0),
    conic-gradient(from 180deg at calc(100%/6) calc(500%/6),var(--_c) 60deg,#0000 0),
    conic-gradient(from 180deg at calc(500%/6),#0000 240deg,var(--_c) 0) calc(4*.866*var(--s)) 0,
    repeating-linear-gradient(-150deg,#B05574 0 calc(100%/6),#0000   0 50%),
    repeating-linear-gradient(-30deg, #B39C82 0 calc(100%/6),#DCD1B4 0 50%);
  background-size: calc(6*.866*var(--s)) calc(3*var(--s))
}
```