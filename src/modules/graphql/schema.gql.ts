
import {
   GraphQLBoolean,
   GraphQLID,
   GraphQLInt,
   GraphQLList,
   GraphQLNonNull,
   GraphQLObjectType,
   GraphQLOutputType,
   GraphQLSchema,
   GraphQLString
} from 'graphql'
import { GraphQLUniform } from './types.gql';





let users:{id:number; name:string; email:string ; gender:string ;password:string ; followers:number[];}[] = [
    {id:1,name:"mooo",email:"mohamed@gmail.com",gender:"male",followers:[]},
    {id:2,name:"ahmed",email:"ahmed@gmail.com",gender:"male",followers:[]},
    {id:3,name:"sara",email:"sara@gmail.com",gender:"female",followers:[]},
]
  export const schema=new GraphQLSchema({
      query:new GraphQLObjectType({
         name:"mainQueryName",
         description:"optional text",
         fields:{
            sayHi:{
               type: GraphQLString,
               description:"test ",
               resolve:()=> "Hello GraphQl",
            },
            checkBoolean:{
               type:GraphQLBoolean,
               resolve:():Boolean=> true
            },
            allUsers:{
               type:new GraphQLList(new GraphQLObjectType({
                  name:"OneUser",
                  fields:{
                     id:{type:GraphQLID},
                     name:{type:GraphQLString},
                     email:{type:GraphQLString},
                  }
               })),
               args:{
                  name:{type:GraphQLString},
               },
               resolve:(parent:unknown,args:{name?:string})=>{
                  if(args.name) return users.filter(ele=>ele.name===args.name)
                  return users
               }
            },
            searchUser: {
               type:GraphQLUniform({
                  name:"SearchUserResponse",
                  data:new GraphQLObjectType({
                     name:"UserObject",
                     fields:{
                        id:{type:GraphQLID},
                        name:{type:GraphQLString},
                        email:{type:GraphQLString},
                        gender:{type:GraphQLString},
                     }
                  })
               }) ,
               args: {
                  email: {
                     type: new GraphQLNonNull(GraphQLString),
                     description: "this email used to find unique account",
                  },
               },
               resolve: (parent: unknown, args: { email: string }) => {
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
    mutation:new GraphQLObjectType({
   name:"RootSchemaMutation",
   description:"hold all RootSchemaMutation",
   fields:{
     addFollowers:{
        type: GraphQLUniform({
           name:"AddFollowerResponse",
           data:new GraphQLObjectType({
              name:"UserWithFollowers",
              fields:{
                 id:{type:GraphQLID},
                 name:{type:GraphQLString},
                 email:{type:GraphQLString},
                 gender:{type:GraphQLString},
                 followers:{type:new GraphQLList(GraphQLID)},
              }
           })
        }),
        args:{
           friendId:{type:new GraphQLNonNull(GraphQLID)},
           myId:{type:new GraphQLNonNull(GraphQLID)}
        },
        resolve:(parent,args:{friendId:number,myId:number})=>{
           const friend = users.find(u=>u.id===Number(args.friendId));
           if(!friend){
              return {
                 message:"Friend not found",
                 statusCode:404,
                 data:followers
              }
           }
           // add follower
           if(!friend.followers.includes(args.myId)){
              friend.followers.push(args.myId);
           }
           return {
              message:"Follower added successfully",
              statusCode:200,
              data:friend
           }
        }
     }
   },
}),

   });