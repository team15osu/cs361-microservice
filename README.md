# EXAMPLE OF USE IN NODE.JS EXPRESS SERVER

```js
// Get article html from scraper microservice
const url = "http://flip1.engr.oregonstate.edu:7043/?query=" + req.query.input;
const page = await axios.get(url);
const page_data = page.data;

// use scraped data as input for transformer service
const article_data = await axios({
  method: "post",
  url: "https://cs361-microservice.wl.r.appspot.com/",
  headers: {
    "Content-Type": "text/html",
  },
  data: {
    page_data,
  },
});
```
