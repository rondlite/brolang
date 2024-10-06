const e=document.getElementById("codeInput"),t=document.getElementById("lineNumbers");function n(){let n=e.value.split("\n").length;t.innerHTML=Array.from({length:n},(e,t)=>`<span>${t+1}</span>`).join(""),e.style.height="auto",e.style.height=e.scrollHeight+"px"}e.addEventListener("input",n),e.addEventListener("scroll",()=>{t.scrollTop=e.scrollTop}),n();
//# sourceMappingURL=index.bcb4445e.js.map
