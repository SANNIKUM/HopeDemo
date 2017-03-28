
WebApi::PropertiesType = GraphQL::ScalarType.define do
  name "PropertiesType"
end


WebApi::AssignmentType = GraphQL::ObjectType.define do
  name "AssignmentType"
  field :id, !types.Int, hash_key: :id
  field :name, !types.String, hash_key: :name
end

WebApi::Assignment = GraphQL::ObjectType.define do
  name "Assignment"
  field :id, !types.Int, hash_key: :id
  field :name, !types.String, hash_key: :name
  field :label, types.String, hash_key: :label
  field :assignmentType, WebApi::AssignmentType, hash_key: :assignmentType
  field :properties, WebApi::PropertiesType, hash_key: :properties
end

WebApi::AssignmentRelation = GraphQL::ObjectType.define do
  name "AssignmentRelation"
  field :id, !types.Int, hash_key: :id
  field :assignment1Id, !types.Int, hash_key: :assignment_1_id
  field :assignment2Id, !types.Int, hash_key: :assignment_2_id
end


WebApi::AssignmentGraph = GraphQL::ObjectType.define do
  name "AssignmentGraph"
  description "Assignments and their AssignmentRelations"
  field :assignments, !types[WebApi::Assignment], hash_key: :assignments
  field :assignmentRelations, !types[WebApi::AssignmentRelation], hash_key: :assignmentRelations
end

WebApi::AssignmentGraphTypeInput = GraphQL::InputObjectType.define do
  name "AssignmentTypeInput"
  argument :name, !types.String
  argument :properties, !types[!types.String]
end

WebApi::QueryType = GraphQL::ObjectType.define do
  name "Query"
  description "The query root of this schema"

  field :test do
    description "For testing that the GraphQL server is up and running"
    type !types.String
    resolve ->(obj, args, ctx) { "hello world" }
  end

  field :assignmentGraph do
    description "Assignments and their AssignmentRelations"
    type WebApi::AssignmentGraph
    argument :contextAssignmentIds, !types[!types.Int]
    argument :types, !types[WebApi::AssignmentGraphTypeInput]

    resolve ->(obj, args, ctx) {
      args = args.to_h.to_snake_keys.deep_symbolize_keys!
      result = AssignmentGraph::Main.run(args)
      CamelizeKeys.run(result).deep_symbolize_keys
    }
  end
end
