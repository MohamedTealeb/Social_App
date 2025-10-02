"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const types_gql_1 = require("./types.gql");
let users = [
    { id: 1, name: "mooo", email: "mohamed@gmail.com", gender: "male", followers: [] },
    { id: 2, name: "ahmed", email: "ahmed@gmail.com", gender: "male", followers: [] },
    { id: 3, name: "sara", email: "sara@gmail.com", gender: "female", followers: [] },
];
exports.schema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: "mainQueryName",
        description: "optional text",
        fields: {
            sayHi: {
                type: graphql_1.GraphQLString,
                description: "test ",
                resolve: () => "Hello GraphQl",
            },
            checkBoolean: {
                type: graphql_1.GraphQLBoolean,
                resolve: () => true
            },
            allUsers: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLObjectType({
                    name: "OneUser",
                    fields: {
                        id: { type: graphql_1.GraphQLID },
                        name: { type: graphql_1.GraphQLString },
                        email: { type: graphql_1.GraphQLString },
                    }
                })),
                args: {
                    name: { type: graphql_1.GraphQLString },
                },
                resolve: (parent, args) => {
                    if (args.name)
                        return users.filter(ele => ele.name === args.name);
                    return users;
                }
            },
            searchUser: {
                type: (0, types_gql_1.GraphQLUniform)({
                    name: "SearchUserResponse",
                    data: new graphql_1.GraphQLObjectType({
                        name: "UserObject",
                        fields: {
                            id: { type: graphql_1.GraphQLID },
                            name: { type: graphql_1.GraphQLString },
                            email: { type: graphql_1.GraphQLString },
                            gender: { type: graphql_1.GraphQLString },
                        }
                    })
                }),
                args: {
                    email: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                        description: "this email used to find unique account",
                    },
                },
                resolve: (parent, args) => {
                    const user = users.find((ele) => ele.email === args.email);
                    if (!user) {
                        return {
                            message: "User not found",
                            statusCode: 404,
                            data: null,
                        };
                    }
                    return {
                        message: "User found",
                        statusCode: 200,
                        data: user,
                    };
                },
            }
        },
    }),
    mutation: new graphql_1.GraphQLObjectType({
        name: "RootSchemaMutation",
        description: "hold all RootSchemaMutation",
        fields: {
            addFollowers: {
                type: (0, types_gql_1.GraphQLUniform)({
                    name: "AddFollowerResponse",
                    data: new graphql_1.GraphQLObjectType({
                        name: "UserWithFollowers",
                        fields: {
                            id: { type: graphql_1.GraphQLID },
                            name: { type: graphql_1.GraphQLString },
                            email: { type: graphql_1.GraphQLString },
                            gender: { type: graphql_1.GraphQLString },
                            followers: { type: new graphql_1.GraphQLList(graphql_1.GraphQLID) },
                        }
                    })
                }),
                args: {
                    friendId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                    myId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
                },
                resolve: (parent, args) => {
                    const friend = users.find(u => u.id === Number(args.friendId));
                    if (!friend) {
                        return {
                            message: "Friend not found",
                            statusCode: 404,
                            data: followers
                        };
                    }
                    // add follower
                    if (!friend.followers.includes(args.myId)) {
                        friend.followers.push(args.myId);
                    }
                    return {
                        message: "Follower added successfully",
                        statusCode: 200,
                        data: friend
                    };
                }
            }
        },
    }),
});
//# sourceMappingURL=schema.gql.js.map