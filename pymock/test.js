function Main(args) {
    const [[N], ansers, ...oinput] = args.split('\n')
        .map(a => a.split(' ').map(a => parseInt(a, 10)));
    const tgMapper = {};
    const tgmapList = oinput.slice(N * 2 + 1);
    let tgList = [];
    for (let i = 0; i < tgmapList.length; i = i + 2) {
        const tgmap = tgmapList[i];
        tgList.push(tgmap.slice(0, 2));
        const tl = tgmap.slice(2);
        for (const t of tl) {
            tgMapper[t] = tgmap[0];
        }
    }
    console.log(tgList);
    tgList = tgList.sort((a, b) => a[1] - b[1]).map(t => t[0]);
    const anserList = [];
    for (let i = 0; i < N; i++) {
        const t = oinput[i * 2 + 1];
        const tMap = {};
        for (const o of t) {
            if (!tMap[tgMapper[o]]) {
                tMap[tgMapper[o]] = new Set();
            }
            tMap[tgMapper[o]].add(o);
        }
        anserList.push({
            id: ansers[i],
            tMap
        });
    }
    console.log(tgList);
    console.log(anserList);
}
Main(`4
0 1 2 3
4
1 2 3 8
5
1 5 0 3 9
5
6 4 7 2 10
3
0 1 10
4
0 1 0 1 2 3
3
1 2 4 5 6
4
2 3 7 8 9 10`);
