const cheerio = require('cheerio');
const got = require('got');
var DOMParser = require('dom-parser');

// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

const getTitle = (req, data) => {
    const $ = cheerio.load(req.body);
    let title = ''
    $('h1').each((i, parent) => {
        title = parent.children[0].data;
    })

    return title;
}

const getLinks = (req) => {
    let links = [];
    const $ = cheerio.load(req.body);
    $('a').each((i, parent) => {
        links.push(parent.attribs.href);
    })

    return links;
}

const filterArticleLinks = (links) => {
    let filtered_links = links.filter(link => {
        if (link && !link.includes('#') && link.includes("/wiki/") && !link.includes("/wiki/Wikipedia") && !link.includes("//") && !link.includes(":")) return link;
    })

    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    filtered_links = filtered_links.filter(onlyUnique)
    return filtered_links.map((link) => {
        return "https://en.wikipedia.org" + link;
    });
}

const filterOtherLinks = (links) => {
    let filtered_links = links.filter(link => {
        if (link && link.includes("https://")) return link;
    })

    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    // remove duplicates
    return filtered_links.filter(onlyUnique);
}

const getText = (req) => {
    const $ = cheerio.load(req.body)

    //source: https://stackoverflow.com/questions/37217791/using-cherrio-to-select-text-from-paragraph-tags-p-with-no-class
    let text = [];
    $('p').each(function (i, el) {
        text[i] = $(this).text()
    });



    return text.filter((sentence) => {
        if (sentence.length !== 0) {
            return sentence;
        }
    });

    // // https://stackoverflow.com/questions/31543451/cheerio-extract-text-from-html-with-separators 
    // return $('p').contents().map(function () {
    //     return (this.type === 'text') ? $(this).text() + ' ' : '';
    // }).get().join('');
}

const getData = (req) => {
    let data = {}
    var xmlString = req.body;
    var doc = new DOMParser().parseFromString(xmlString, "text/xml");
    data['title'] = getTitle(req, data);
    data['text'] = getText(req);
    const links = getLinks(req);
    data['article_links'] = filterArticleLinks(links);
    data['other_links'] = filterOtherLinks(links);
    return data;
}

const postBody = async (req, res, next) => {
    const data = getData(req);
    res.status(201).json({ ...data });
};

module.exports = {
    postBody
};
