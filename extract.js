const cheerio = require('cheerio');
const got = require('got');

const url = 'https://en.wikipedia.org/wiki/Global_Warming_(Sonny_Rollins_album)';
let links = [];
let d = {};

// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

const getDolla = async (url) => {
    const res = await got(url);
    return $ = cheerio.load(res.body);
}

const getTitle = async (url) => {
    const $ = await getDolla(url)
    $('h1').each((i, parent) => {
        d['title'] = parent.children[0].data;
    })
}

const getLinks = async (url) => {
    const $ = await getDolla(url)
    $('a').each((i, parent) => {
        links.push(parent.attribs.href);
    })
}

const filterArticleLinks = (links) => {
    let filtered_links = links.filter(link => {
        if (link && !link.includes('#') && link.includes("/wiki/") && !link.includes("/wiki/Wikipedia") && !link.includes("//") && !link.includes(":")) return link;
    })

    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    // remove duplicates
    filtered_links = filtered_links.filter(onlyUnique)
    d['article_links'] = filtered_links.map((link) => {
        return "https://en.wikipedia.org" + link;
    })
}

const filterOtherLinks = (links) => {
    let filtered_links = links.filter(link => {
        if (link && link.includes("https://")) return link;
    })

    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    // remove duplicates
    filtered_links = filtered_links.filter(onlyUnique)
    d['other_links'] = [...filtered_links];
}

const getHeaders = async (url) => {
    headers = [];
    const $ = await getDolla(url)
    $('.mw-headline').each((i, parent) => {
        let id = "#" + parent.attribs.id + "p";
        headers.push(parent.attribs.id);
    })

    // https://stackoverflow.com/questions/31543451/cheerio-extract-text-from-html-with-separators 
    var t = $('p').contents().map(function () {
        return (this.type === 'text') ? $(this).text() + ' ' : '';
    }).get().join('');
    d['text'] = t
}

const getData = async (url) => {
    await getTitle(url);
    await getLinks(url);
    await getHeaders(url);
    filterArticleLinks(links);
    filterOtherLinks(links);
    console.log(d);
}

getData(url);




