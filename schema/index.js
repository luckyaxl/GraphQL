const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

const axios = require("axios");

const _ = require("lodash");

// Array of object
const products = [
  { id: "1", name: "dompet", image: "", price: 20000 },
  { id: "2", name: "tas", image: "", price: 70000 }
];

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/categories/${parentValue.id}/products`)
          .then(res => res.data);
      }
    }
  })
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    price: { type: GraphQLInt },
    category: {
      type: CategoryType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/categories/${parentValue.categoryId}`)
          .then(res => res.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    products: {
      type: new GraphQLList(ProductType),
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/products")
          .then(res => res.data);
      }
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        //return _.find(products, { id: args.id });
        return axios
          .get(`http://localhost:3000/products/${args.id}`)
          .then(res => res.data);
      }
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/categories`)
          .then(res => res.data);
      }
    },
    category: {
      type: CategoryType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/categories/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
