import{t as e}from"/dc-assets/sites/64iun5x3SQddIkHlx97cJE/rolldown-runtime.D1deASqF.mjs";import{A as t,I as n,M as r,O as i,P as a,S as o,T as s,c,o as l}from"/dc-assets/sites/64iun5x3SQddIkHlx97cJE/react.XLMBvYdO.mjs";import{H as u,r as d,v as f,w as p}from"/dc-assets/sites/64iun5x3SQddIkHlx97cJE/dcui.WBpmDwff.mjs";var m,h,g=e((()=>{u(),m={position:`relative`,width:`100%`,height:`100%`,display:`flex`,justifyContent:`center`,alignItems:`center`},h={...m,borderRadius:6,background:`rgba(136, 85, 255, 0.3)`,color:`#85F`,border:`1px dashed #85F`,flexDirection:`column`},d.EventHandler,d.EventHandler,d.EventHandler,d.Number,d.Boolean,d.String,d.Enum})),_=e((()=>{u(),o()})),v=e((()=>{o()})),y=e((()=>{u()})),b=e((()=>{u()})),x=e((()=>{o()})),S=e((()=>{u()})),C=e((()=>{a(),o()})),w=e((()=>{o(),b()})),T=e((()=>{o(),u(),b(),v()})),E=e((()=>{u(),o(),g()}));function D(){return i(()=>f.current()===f.canvas,[])}var O=e((()=>{o(),u()})),k=e((()=>{o()})),A=e((()=>{o(),u(),d.FusedNumber,d.FusedNumber})),j=e((()=>{g(),_(),v(),y(),b(),x(),S(),C(),w(),T(),E(),O(),k(),A()})),M=e((()=>{j()}));function N({type:e,url:t,html:n,zoom:r,radius:i,border:a,style:o={}}){return e===`url`&&t?c(F,{url:t,zoom:r,radius:i,border:a,style:o}):e===`html`&&n?c(L,{html:n,style:o}):c(P,{style:o})}function P({style:e}){return c(`div`,{style:{minHeight:W(e),...h,overflow:`hidden`,...e},children:c(`div`,{style:q,children:`To embed a website or widget, add it to the properties\xA0panel.`})})}function F({url:e,zoom:n,radius:i,border:a,style:o}){let s=!o.height;/[a-z]+:\/\//.test(e)||(e=`https://`+e);let l=D(),[u,d]=r(l?void 0:!1);return t(()=>{if(!l)return;let t=!0;d(void 0);async function n(){let n=await fetch(`https://api.dc-lib/functions/check-iframe-url?url=`+encodeURIComponent(e));if(n.status==200){let{isBlocked:e}=await n.json();t&&d(e)}else{let e=await n.text();console.error(e),d(Error(`This site can’t be reached.`))}}return n().catch(e=>{console.error(e),d(e)}),()=>{t=!1}},[e]),l&&s?c(U,{message:`URL embeds do not support auto height.`,style:o}):e.startsWith(`https://`)?u===void 0?c(H,{}):u instanceof Error?c(U,{message:u.message,style:o}):u===!0?c(U,{message:`Can’t embed ${e} due to its content security policy.`,style:o}):c(`iframe`,{src:e,style:{...G,...o,...a,zoom:n,borderRadius:i,transformOrigin:`top center`},loading:`lazy`,fetchPriority:l?`low`:`auto`,referrerPolicy:`no-referrer`,sandbox:I(l)}):c(U,{message:`Unsupported protocol.`,style:o})}function I(e){let t=[`allow-same-origin`,`allow-scripts`];return e||t.push(`allow-downloads`,`allow-forms`,`allow-modals`,`allow-orientation-lock`,`allow-pointer-lock`,`allow-popups`,`allow-popups-to-escape-sandbox`,`allow-presentation`,`allow-storage-access-by-user-activation`,`allow-top-navigation-by-user-activation`),t.join(` `)}function L({html:e,...t}){if(e.includes(`<\/script>`)){let n=e.includes(`</spline-viewer>`),r=e.includes(`<!-- dcui-direct-embed -->`);return c(n||r?z:R,{html:e,...t})}return c(B,{html:e,...t})}function R({html:e,style:i}){let a=s(),[o,l]=r(0);t(()=>{let e=a.current?.contentWindow;function t(t){if(t.source!==e)return;let n=t.data;if(typeof n!=`object`||!n)return;let r=n.embedHeight;typeof r==`number`&&l(r)}return n.addEventListener(`message`,t),e?.postMessage(`getEmbedHeight`,`*`),()=>{n.removeEventListener(`message`,t)}},[]);let u=`
<html>
    <head>
        <style>
            html, body {
                margin: 0;
                padding: 0;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            :root {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            * {
                box-sizing: border-box;
                -webkit-font-smoothing: inherit;
            }

            h1, h2, h3, h4, h5, h6, p, figure {
                margin: 0;
            }

            body, input, textarea, select, button {
                font-size: 12px;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        ${e}
        <script type="module">
            let height = 0

            function sendEmbedHeight() {
                window.parent.postMessage({
                    embedHeight: height
                }, "*")
            }

            const observer = new ResizeObserver((entries) => {
                if (entries.length !== 1) return
                const entry = entries[0]
                if (entry.target !== document.body) return

                height = entry.contentRect.height
                sendEmbedHeight()
            })

            observer.observe(document.body)

            window.addEventListener("message", (event) => {
                if (event.source !== window.parent) return
                if (event.data !== "getEmbedHeight") return
                sendEmbedHeight()
            })
        <\/script>
    <body>
</html>
`,d={...G,...i};return i.height||(d.height=o+`px`),c(`iframe`,{ref:a,style:d,srcDoc:u})}function z({html:e,style:n}){let r=s();return t(()=>{let t=r.current;if(t)return t.innerHTML=e,V(t),()=>{t.innerHTML=``}},[e]),c(`div`,{ref:r,style:{...K,...n}})}function B({html:e,style:t}){return c(`div`,{style:{...K,...t},dangerouslySetInnerHTML:{__html:e}})}function V(e){if(e instanceof Element&&e.tagName===`SCRIPT`){let t=document.createElement(`script`);t.text=e.innerHTML;for(let{name:n,value:r}of e.attributes)t.setAttribute(n,r);e.parentElement.replaceChild(t,e)}else for(let t of e.childNodes)V(t)}function H(){return c(`div`,{className:`dcuiInternalUI-componentPlaceholder`,style:{...m,overflow:`hidden`},children:c(`div`,{style:q,children:`Loading…`})})}function U({message:e,style:t}){return c(`div`,{className:`dcuiInternalUI-errorPlaceholder`,style:{minHeight:W(t),...m,overflow:`hidden`,...t},children:c(`div`,{style:q,children:e})})}function W(e){if(!e.height)return 200}var G,K,q,J=e((()=>{a(),l(),o(),u(),M(),p(N,{type:{type:d.Enum,defaultValue:`url`,displaySegmentedControl:!0,options:[`url`,`html`],optionTitles:[`URL`,`HTML`]},url:{title:`URL`,type:d.String,description:`Some websites don’t support embedding.`,hidden(e){return e.type!==`url`}},html:{title:`HTML`,type:d.String,displayTextArea:!0,hidden(e){return e.type!==`html`}},border:{title:`Border`,type:d.Border,optional:!0,hidden(e){return e.type!==`url`}},radius:{type:d.BorderRadius,title:`Radius`,hidden(e){return e.type!==`url`}},zoom:{title:`Zoom`,defaultValue:1,type:d.Number,hidden(e){return e.type!==`url`},min:.1,max:1,step:.1,displayStepper:!0}}),G={width:`100%`,height:`100%`,border:`none`},K={width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`},q={textAlign:`center`,minWidth:140}}));export{J as n,N as t};
//# sourceMappingURL=Embed.yvKd-pRl.mjs.map