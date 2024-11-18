const pageList = `./61/main.html
./95/index.html
./59/main.html
./92/static/join/index.html
./92/static/game/index.html
./66/main.html
./104/index.html
./50/index.html
./68/index.html
./103/index.html
./57/index.html
./57/main/main.html
./32/index.html
./35/index3.html
./35/old/index.html
./102/index.html
./69/index.html
./56/index.html
./51/index.html
./58/main.html
./67/index.html
./93/index.html
./94/index.html
./60/main.html
./34/index.html
./33/index.html
./20/index.html
./20/pendulum/index.html
./18/julia.html
./27/main/demo/main.jserver.html
./27/main/main.jserver.html
./27/main.jserver.html
./9/main/main.jserver.html
./9/main.jserver.html
./11/main.jserver.html
./7/t/main.html
./7/t/main.jserver.html
./7/x/main.html
./7/x/main.jserver.html
./29/main.html
./29/main/main2.html
./16/circleTest/index.html
./16/angle/index.html
./42/index3.html
./42/old/index.html
./89/index.html
./45/itr2/main.html
./45/itr3/main.html
./45/itr1/main.html
./73/index.html
./87/index.html
./80/index.html
./74/index.html
./6/main.html
./6/main.jserver.html
./28/index.html
./17/index.html
./1/mandel.html
./10/xdemo/main.jserver.html
./10/ngenerator/demo/main.jserver.html
./10/ngenerator/main.jserver.html
./10/main/demo/main.jserver.html
./10/main/main.jserver.html
./19/index.html
./26/index.html
./8/main.html
./8/main.jserver.html
./21/index.html
./75/index.html
./81/index.html
./86/index.html
./72/index.html
./44/main.jserver.html
./43/main.jserver.html
./88/index.html
./38/index3.html
./38/old/index.html
./36/index3.html
./36/old/index.html
./31/index.html
./91/index.html
./65/main.html
./62/main.html
./96/index.html
./100/index.html
./54/index.html
./54/plot/index.html
./54/buddy/index.html
./98/index.html
./53/index.html
./30/main2.html
./37/index3.html
./37/old/index.html
./39/index3.html
./39/old/index.html
./99/index.html
./52/index3.html
./52/index.html
./101/index.html
./55/index.html
./97/index.html
./63/main.html
./64/main.html
./90/index.html
./46/main.html
./79/index.html
./41/index3.html
./41/old/index.html
./83/index.html
./77/index.html
./48/main.html
./70/index.html
./84/index.html
./24/index.html
./23/branch/index.html
./23/index.html
./4/main.html
./15/nenwari/index.html
./15/hiwari/index.html
./3/dots/main.html
./3/boxes/main.html
./12/omake2/main.jserver.html
./12/omake/counter.html
./12/main.jserver.html
./85/index.html
./71/index.html
./76/index.html
./82/index.html
./49/index.html
./40/index3.html
./40/old/index.html
./47/main.html
./78/index.html
./2/mandel.html
./13/index.html
./5/polygon/main.html
./5/wiremesh/main.html
./5/shade/main.html
./14/index.html
./14/montecarlo/index.html
./14/13/index.html
./22/index.html
./22/22.0/index.html
./25/index.html`.trim().split("\n");

const pages = [];
for(let i = 0; i < 104; i++){
    pages.push({
        day: i+1,
        entries: []
    });
}


for(let item of pageList){
    let [pageNumber, ...path] = item.slice(2).split("/");
    pageNumber = parseInt(pageNumber);
    path = path.join("/"); 
    console.log(pageNumber, path);
    pages[pageNumber-1].entries.push(path);
}
console.log(pages);

const body = document.body;
for(let {day, entries} of pages){
    const row = document.createElement("div");
    const t = document.createElement("div");
    t.innerHTML = `Day ${day}`;
    row.appendChild(t);
    for(let path of entries){
        const a = document.createElement("a");
        a.style.display = "block";
        a.href = `https://martian17.github.io/100-days/${day}/${path}`;
        a.innerHTML = `* ${path}`
        row.appendChild(a);
    }
    body.appendChild(row);
}
