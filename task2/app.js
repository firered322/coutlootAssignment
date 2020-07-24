const express = require("express");

const Product = require("./models/Product");

const app = express();
app.use(express.urlencoded({ extended: false }));

const PER_PAGE_LIMIT = 30;

// routes
app.get("/", (req, res) => {
  res.send("Hi from home");
});

// Subtask 1
app.post("/product/list", async (req, res) => {
  const { userId, deviceId } = req.headers;
  const { type, sort, pageNo, filters, extraParam } = req.body;
  const pageLowerLimit = (parseInt(pageNo) - 1) * PER_PAGE_LIMIT;
  const pageUpperLimit = parseInt(pageNo) * PER_PAGE_LIMIT;
  try {
    // querying the Products
    const products = await Product.find({
      brand: type,
      "variants.priceDetails.labelPrice": {
        $gt: filters.price[0].slice(0, filters.price[0].indexOf("-")),
        $lt: filters.price[0].slice(filters.price[0].indexOf("-") + 1),
      },
      color: { $in: [filters.color[0], filters.color[1]] },
    })
      .sort(sort)
      .lean();

    const results = {};

    // adding nextPage property if more results are available
    if (pageUpperLimit < products.length) {
      results.nextPage = {
        page: parseInt(pageNo) + 1,
      };
    }

    results.results = products.slice(pageLowerLimit, pageUpperLimit);
    res.json(results);
  } catch (err) {
    console.error(err);
  }
});

// Subtask 2
app.post("/product/details", async (req, res) => {
  const { userId, deviceId } = req.headers;
  const { productId } = req.body;
  try {
    const product = Product.findById(productId).lean();
    // setting the product views in the localstorage
    viewCounter =
      window.localStorage.getItem(`productView${product["_id"]}`) || 0;
    viewCounter += 1;
    window.localStorage.setItem(`productView${product["_id"]}`, viewCounter);
    const updateViewCount = await product.update({ views: viewCounter });
    if (!updateViewCount) {
      console.error("Update view failed");
    }
  } catch (err) {
    console.error(err);
  }
});

// Subtask 3
app.post("/product/action/edit", async (req, res) => {
  const { userId, deviceId } = req.headers;
  const { productId, sku, price } = req.body;
  try {
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.send("Product not found");
    } else {
      if (price > product.variants.priceDetails.labelPrice) {
        return res.send("Price cant be more than the listed price");
      } else {
        product = await Product.findOneAndUpdate({
          _id: productId,
          "variants.sku": sku,
          "variants.priceDetails.labelPrice": price,
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => {
  console.log("server up and running at port 3000");
});
