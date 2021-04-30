const cheerio = require('cheerio');

// source: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

const getTitle = ($) => {
    let title = ''
    $('h1').each((i, parent) => {
        title = parent.children[0].data;
    })
    return title;
}

const getLinks = ($) => {
    let links = [];
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
    return filtered_links.filter(onlyUnique);
}

const getText = ($) => {
    //source: https://stackoverflow.com/questions/37217791/using-cherrio-to-select-text-from-paragraph-tags-p-with-no-class
    let text = [];
    $('p').each(function (i, el) {
        text[i] = $(this).text()
    });

    return text.filter((txt) => {
        if (txt.length !== 0) {
            return txt;
        }
    });
}

const getImgs = ($) => {
    //source: https://stackoverflow.com/questions/37217791/using-cherrio-to-select-text-from-paragraph-tags-p-with-no-class
    let imgs = [];
    $('img').each(function (i, el) {

        imgs.push({ "src": $(this).attr('src'), "alt": $(this).attr('alt') });
    });
    return imgs;
}

const getCitations = ($) => {
    //source: https://stackoverflow.com/questions/37217791/using-cherrio-to-select-text-from-paragraph-tags-p-with-no-class
    let citations = [];
    $('cite').each(function (i, el) {
        citations.push($(this).text());
    });
    return citations;
}

const getData = (req) => {
    const $ = cheerio.load(req.body);
    let data = {}
    const links = getLinks($);
    data['title'] = getTitle($);
    data['text'] = getText($);
    data['imgs'] = getImgs($);
    data['citations'] = getCitations($);
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
