import { GraphQLInt, GraphQLObjectType, GraphQLOutputType, GraphQLString } from "graphql"

export const GraphQLUniform=({ name ,data}:{name:string,data:GraphQLOutputType}):GraphQLOutputType=>{
   return new GraphQLObjectType({
      name, 
      fields: {
         message: { type: GraphQLString },
         statusCode: { type: GraphQLInt },
         data: { type: data },
      },
   })
}