# EXAMPLE OF USE

Get content from scraper service. Input scraper service output into transformer service. JSON now in article_data variable.
Make sure to set Content-Type as text/html.

```js
const url = "http://flip1.engr.oregonstate.edu:7043/?query=" + req.query.input;
const page = await axios.get(url);
const page_data = page.data;
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
