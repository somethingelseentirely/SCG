// https://observablehq.com/@somethingelseentirely/papers@985
function _1(md,toc){return(
md`# Papers
Utility functions for writing scientific papers in observable.

${toc()}`
)}

function _2(md,chapter){return(
md`
${chapter`1 Structure`}
${chapter`1.1 Title`}`
)}

function _bannerHeight(){return(
320
)}

function _title(DOM,html,bannerHeight){return(
(
  title1,
  title2,
  backgroundColor = "#c8d9dd",
  textColor = "#282b2c",
  pageTitle = title1 + " " + title2
) => {
  const { id, href } = DOM.uid("banner");
  return html`
    <h1 style="display: none">${pageTitle}</h1> <!-- extracted title -->
    <svg id="${id}" width="100%" viewBox="0 0 960 ${bannerHeight}">
      <text x="50%" y="50%" text-anchor="middle">
        <tspan x="50%" dy="-0.34em">${title1}</tspan>
        <tspan x="50%" dy="1.3em">${title2}</tspan>
      </text>
    </svg>
    <style>
      #${id} {background: ${backgroundColor};}
      #${id} text {fill: ${textColor}; font-size: 36px; font-weight: bold;}
    </style>
  `;
}
)}

function _5(md,chapter){return(
md`
${chapter`1.2 Chapters and Tables Of Content`}
You can auto generate a TOC by adding 'chapter' literals to the markdown of your notebook.

Use ${"`toc()`"} to render a table of content, and the ${"`chapter`"} string literal, to add a chapter to the TOC, also rendered as a chapter headline.
`
)}

function _chapter_index(immutable){return(
immutable.Set()
)}

function _toc_fresh(){return(
false
)}

function _chapter(toc_fresh,$0,immutable,md){return(
strings => {
  const [, index, title] = strings[0].match(/^((?:[0-9]*\.?)*)\s*(.*)$/);
  const level = index.split(".").filter(s => s.length !== 0).length - 1;
  if (toc_fresh) {
    $0.value = $0.value.add(
      immutable.Map({ index, level, title })
    );
  }
  return md`${"#".repeat(
    level + 1
  )} <span style="color:#BDC3C7;font-size:0.8em">${index}</span> ${title}`;
}
)}

function _toc($0,$1,immutable,chapter_index,md){return(
() => {
  if (!$0.value) {
    $0.value = true;
    $1.value = immutable.Set();
    setTimeout(() => console.log(($0.value = false)), 10000);
  }
  let idx = "";
  for (const { index, level, title } of [
    ...chapter_index.map(e => e.toObject())
  ].sort((a, b) => a.index.localeCompare(b.index))) {
    idx = idx + `${"  ".repeat(level)}* __${index}__ ${title} \n`;
  }
  return md`${idx}`;
}
)}

function _10(md,chapter){return(
md`${chapter`1.2 Bibliographies`}

For citations and references.

\`bibliography\` renders a bibliography for the given references.`
)}

function _bibliography_references(immutable){return(
immutable.Set()
)}

function _bib_fresh(){return(
false
)}

function _bibliography($0,$1,immutable,bibliography_references){return(
() => {
  if (!$0.value) {
    $0.value = true;
    $1.value = immutable.Set();
    setTimeout(() => console.log(($0.value = false)), 10000);
  }
  let bib = "";
  for (const { name, title, link } of [
    ...bibliography_references.map(e => e.toObject())
  ].sort((a, b) => a.name.localeCompare(b.name))) {
    bib = bib + `* __\[${name}\]__ \n ${title} :\n [${link}](${link})\n\n`;
  }
  return bib;
}
)}

function _14(md){return(
md`\`ref\` adds another reference to the references and renders a shorthand in place.`
)}

function _ref(bib_fresh,$0,immutable){return(
(name, title, link) => {
  if (bib_fresh) {
    $0.value = $0.value.add(
      immutable.Map({ name, title, link })
    );
  }
  return `__[\[${name}\]](${link})__</a>`;
}
)}

function _16(md,ref){return(
md`For example the Paper, "Out of the Tar Pit" ${ref(
  "Moseley2006",
  "Out of the Tar Pit",
  "http://curtclifton.net/papers/MoseleyMarks06a.pdf"
)}`
)}

function _17(md,bibliography){return(
md`### References
${bibliography()}`
)}

function _18(md,chapter){return(
md`${chapter`2 Ornaments`}
${chapter`2.1 Quotes`}
For when you want a pretty quote.`
)}

function _quote(html){return(
(quote, author) =>
  html`<link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet">
<div style="display:flex;
            flex-flow: column nowrap;
            align-items: flex-end;
            padding:50px;">
<div style="display:flex;
            flex-flow: column nowrap;
            align-items: flex-end;
            max-width: 30em;
            color:#303030;
            font-family: 'Caveat', cursive;">
  <div style="padding-left: 50px;
              font-weight: 300;
              font-size:1.3em">
    ${quote}
  </div>
  <span style="font-weight: 800; padding-left: 0px">- ${author}</span>
</div>
</div>`
)}

function _20(quote){return(
quote(
  "It seems that perfection is attained not when there is nothing more to add, but when there is nothing more to remove.",
  "Antoine de Saint Exupéry"
)
)}

function _21(md,chapter){return(
md`${chapter`3 Formatting`}
${chapter`3.1 Notes`}
For when you want to add some notes.`
)}

function _note(html,md){return(
(strings, ...args) =>
  html`
<div style="background:#FFFF88;
                   padding: 10px;
                   max-width: 30em;
                   color:#303030;
                   font-family: 'Roboto', sans-serif;">
  <div style="font-weight: 700;
               font-size:0.8em">Note:</div>
  <div style="padding-left: 10px;
              font-weight: 300;
              font-size:0.7em">
    ${md(strings, ...args)}
  </div>
</div>`
)}

function _23(note){return(
note`You can create quick notes that are visually distinct from the rest of the Document.`
)}

function _24(md,chapter){return(
md`${chapter`3.2 Warnings`}
For when you want to add some warnings...`
)}

function _warn(html,md){return(
(strings, ...args) =>
  html`
<div style="position: relative;
            background:#FF8888;
            padding: 10px;
            max-width: 30em;
            color:#303030;
            font-family: 'Roboto', sans-serif;
            overflow: hidden">
  <svg style = "position: absolute;
                width: 100px;
                height: 100px;
                z-index: -1;
                overflow: hidden;"
       viewBox="0 0 15 15">
    <text x="0" y="12" font-size="15px" style="fill:white; fill-opacity:0.25;">⚠</text></svg>
  <div style="background: none;
              padding-left: 10px;
              font-weight: 700;
              font-size:1em">
    ${md(strings, ...args)}
  </div>
</div>`
)}

function _26(warn){return(
warn`Here be dragons!</br>
Red sky at night, sailors' delight.</br>
Red sky at morning, sailors' warning`
)}

function _27(md,chapter){return(
md`${chapter`3.3 Command Line`}
For when you want to show some command line scripts...`
)}

function _shell(html,copyHelper){return(
(strings, ...args) => {
  let string = "";
  for (const [i, val] of args.entries()) {
    string += strings[i] + val;
  }
  string += strings[strings.length - 1];

  return html`
  <div>
  <style type="text/css">
  .bultmann-papers-cli {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    background:#171717;
    padding: 1px 5px 1px 10px;
    color:#fff;
    font-family: 'Roboto Mono', monospace;
    cursor: copy;
  }
  .bultmann-papers-cli svg {
    color:#B2B2B2;
  }
  .bultmann-papers-cli:hover svg {
    color:#fff;
  }
  </style>
  <div class="bultmann-papers-cli"
    onclick= ${() => copyHelper(string)}>
    <div style="font-weight: 300;
                font-size:1em">
    <span style="font-weight: 700;
                 user-select: none;">$</span>
    ${html(strings, ...args)}
    </div>
    <div style="display:flex;
                flex-flow: column nowrap;
                justify-content: center;">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clipboard"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
    </div>
  </div>
  </div>`;
}
)}

function _29(shell){return(
shell`echo "hello world!" > out.txt`
)}

function _styledShell(html,copyHelper){return(
({
  color = "#fff",
  backgroundColor = "#171717",
  highlightColor = "#B2B2B2"
} = {}) => (strings, ...args) => {
  let string = "";
  for (const [i, val] of args.entries()) {
    string += strings[i] + val;
  }
  string += strings[strings.length - 1];

  return html`
  <div>
  <style type="text/css">
  .papers-styled-cli {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    background: ${backgroundColor};
    padding: 1px 5px 1px 10px;
    color:${color};
    font-family: 'Roboto Mono', monospace;
    cursor: copy;
  }
  .papers-styled-cli svg {
    color: ${color};
  }
  .papers-styled-cli svg {
    color: ${highlightColor};
  }
  </style>
  <div class="papers-styled-cli"
    onclick= ${() => copyHelper(string)}>
    <div style="font-weight: 300;
                font-size:1em">
    <span style="font-weight: 700;
                 user-select: none;">$</span>
    ${html(strings, ...args)}
    </div>
    <div style="display:flex;
                flex-flow: column nowrap;
                justify-content: center;">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clipboard"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
    </div>
  </div>
  </div>`;
}
)}

function _31(styledShell){return(
styledShell({
  backgroundColor: "white",
  color: "black",
  highlightColor: "red"
})`echo "hello world!" > out.txt`
)}

function _shellerr(html){return(
(strings, ...args) => html`
  <div>
    <div style="padding: 1px 5px 1px 10px;
                background:#ff261b;
                color:#fff;
                font-family: 'Roboto Mono', monospace;
                font-weight: 300;
                font-size:1em">
    <span style="font-weight: 700;
                 user-select: none;">$</span>
    ${html(strings, ...args)}
    </div>
  </div>`
)}

function _33(shellerr){return(
shellerr`missing parameters`
)}

function _34(md,chapter,copy){return(
md`${chapter`3.4 Quick Copy`}
Sometimes users need a convenient way to copy ${copy(
  "something 📋",
  "surprise!"
)}!`
)}

function _copy(html,copyHelper){return(
(text, copyText) => {
  return html`
  <style type="text/css">
  .bultmann-papers-copy {
    display: inline;
    cursor: copy;
  
  }
  .bultmann-papers-copy:hover {
        color:#BBB;
  }
  </style>
  <span class="bultmann-papers-copy"
    onclick= ${() => copyHelper(copyText)}>
    ${text}
  </span>`;
}
)}

function _copyHelper(){return(
function copyHelper(text) {
  const fake = document.body.appendChild(document.createElement("textarea"));
  fake.style.position = "absolute";
  fake.style.left = "-9999px";
  fake.setAttribute("readonly", "");
  fake.value = "" + text;
  fake.select();
  try {
    return document.execCommand("copy");
  } catch (err) {
    return false;
  } finally {
    fake.parentNode.removeChild(fake);
  }
}
)}

function _37(md){return(
md`## Imports:`
)}

function _immutable(require){return(
require("immutable")
)}

function _htl(require){return(
require("htl@0.2")
)}

function _html(htl){return(
htl.html
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md","toc"], _1);
  main.variable(observer()).define(["md","chapter"], _2);
  main.variable(observer("bannerHeight")).define("bannerHeight", _bannerHeight);
  main.variable(observer("title")).define("title", ["DOM","html","bannerHeight"], _title);
  main.variable(observer()).define(["md","chapter"], _5);
  main.define("initial chapter_index", ["immutable"], _chapter_index);
  main.variable(observer("mutable chapter_index")).define("mutable chapter_index", ["Mutable", "initial chapter_index"], (M, _) => new M(_));
  main.variable(observer("chapter_index")).define("chapter_index", ["mutable chapter_index"], _ => _.generator);
  main.define("initial toc_fresh", _toc_fresh);
  main.variable(observer("mutable toc_fresh")).define("mutable toc_fresh", ["Mutable", "initial toc_fresh"], (M, _) => new M(_));
  main.variable(observer("toc_fresh")).define("toc_fresh", ["mutable toc_fresh"], _ => _.generator);
  main.variable(observer("chapter")).define("chapter", ["toc_fresh","mutable chapter_index","immutable","md"], _chapter);
  main.variable(observer("toc")).define("toc", ["mutable toc_fresh","mutable chapter_index","immutable","chapter_index","md"], _toc);
  main.variable(observer()).define(["md","chapter"], _10);
  main.define("initial bibliography_references", ["immutable"], _bibliography_references);
  main.variable(observer("mutable bibliography_references")).define("mutable bibliography_references", ["Mutable", "initial bibliography_references"], (M, _) => new M(_));
  main.variable(observer("bibliography_references")).define("bibliography_references", ["mutable bibliography_references"], _ => _.generator);
  main.define("initial bib_fresh", _bib_fresh);
  main.variable(observer("mutable bib_fresh")).define("mutable bib_fresh", ["Mutable", "initial bib_fresh"], (M, _) => new M(_));
  main.variable(observer("bib_fresh")).define("bib_fresh", ["mutable bib_fresh"], _ => _.generator);
  main.variable(observer("bibliography")).define("bibliography", ["mutable bib_fresh","mutable bibliography_references","immutable","bibliography_references"], _bibliography);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("ref")).define("ref", ["bib_fresh","mutable bibliography_references","immutable"], _ref);
  main.variable(observer()).define(["md","ref"], _16);
  main.variable(observer()).define(["md","bibliography"], _17);
  main.variable(observer()).define(["md","chapter"], _18);
  main.variable(observer("quote")).define("quote", ["html"], _quote);
  main.variable(observer()).define(["quote"], _20);
  main.variable(observer()).define(["md","chapter"], _21);
  main.variable(observer("note")).define("note", ["html","md"], _note);
  main.variable(observer()).define(["note"], _23);
  main.variable(observer()).define(["md","chapter"], _24);
  main.variable(observer("warn")).define("warn", ["html","md"], _warn);
  main.variable(observer()).define(["warn"], _26);
  main.variable(observer()).define(["md","chapter"], _27);
  main.variable(observer("shell")).define("shell", ["html","copyHelper"], _shell);
  main.variable(observer()).define(["shell"], _29);
  main.variable(observer("styledShell")).define("styledShell", ["html","copyHelper"], _styledShell);
  main.variable(observer()).define(["styledShell"], _31);
  main.variable(observer("shellerr")).define("shellerr", ["html"], _shellerr);
  main.variable(observer()).define(["shellerr"], _33);
  main.variable(observer()).define(["md","chapter","copy"], _34);
  main.variable(observer("copy")).define("copy", ["html","copyHelper"], _copy);
  main.variable(observer("copyHelper")).define("copyHelper", _copyHelper);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("immutable")).define("immutable", ["require"], _immutable);
  main.variable(observer("htl")).define("htl", ["require"], _htl);
  main.variable(observer("html")).define("html", ["htl"], _html);
  return main;
}
