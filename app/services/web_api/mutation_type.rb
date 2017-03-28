def at_path(f); return File.expand_path("app/services/web_api/mutations/#{f}", Rails.root); end

require_dependency at_path "create_assignment"
require_dependency at_path "update_assignment"
require_dependency at_path "destroy_assignment"
require_dependency at_path "create_assignment_relation"
require_dependency at_path "destroy_assignment_relation"

WebApi::AssignmentPropertyInput = GraphQL::InputObjectType.define do
  name "AssignmentPropertyInput"
  description "Describes the value and type of a property, with an optional type label."

  argument :value,      !types.String
  argument :type,       !types.String
  argument :typeLabel,   types.String
end

WebApi::UpdateAssignmentPropertyInput = GraphQL::InputObjectType.define do
  name "UpdateAssignmentPropertyInput"
  description "An input type specific to updating assignment properties."

  argument :newValue,      types.String
  argument :type,         !types.String
  argument :newTypeLabel,  types.String
end

WebApi::CreateAssignmentInput = GraphQL::InputObjectType.define do
  name "CreateAssignmentInput"
  description "An assignment input type specifically for creation; it cannot be used to update an assignment."

  argument :name,       !types.String
  argument :type,       !types.String
  argument :label,       types.String
  argument :properties,  types[WebApi::AssignmentPropertyInput]
end

WebApi::UpdateAssignmentInput = GraphQL::InputObjectType.define do
  name "UpdateAssignmentInput"
  description "An input type specific to updating assignments; it disallows changing the assignment type."

  argument :name,       !types.String
  argument :label,       types.String
  argument :properties,  types[WebApi::UpdateAssignmentPropertyInput]
end

WebApi::MutationType = GraphQL::ObjectType.define do
  name "Mutation"
  description "The mutation root of this schema."

  field :createAssignment do
    description <<-END
Create a new assignment. If the assignment type does not exist, it will be created;
duplicate assignment types are not allowed. However, duplicate assignments are allowed.
If the assignment property type does not exist, it will be created; duplicate assignment
types are not allowed. However, duplicate properties are allowed.
    END

    type      WebApi::Assignment
    argument  :assignment, !WebApi::CreateAssignmentInput
    resolve   WebApi::Mutations::CreateAssignmentResolver
  end
    
  field :updateAssignment do
    description "Update an assignment. Note that neither the assignment type nor property types can be changed."

    type      WebApi::Assignment
    argument  :assignmentId,      !types.Int
    argument  :update,  !WebApi::UpdateAssignmentInput
    resolve   WebApi::Mutations::UpdateAssignmentResolver
  end

  field :destroyAssignment do
    description <<-END
Destroy an assignment. Any assignment relations, assignment properties, and form
value options involving this assignment will also be destroyed.
    END

    type      types.Boolean
    argument  :id, !types.Int
    resolve   WebApi::Mutations::DestroyAssignmentResolver
  end

  field :createAssignmentRelation do
    description <<-END
Create a parent/child, has/belongs-to relationship between two assignments.
The parent assignment is the one that "has" the child assignments. Conversely,
the child assignment "belongs to" the parent. For instance, if there was a user
to be assigned to a team, the parent would be the team and the child would be
the user — a team "has" a user and a user "belongs to" a team.
    END

    type      WebApi::AssignmentRelation
    argument  :parentAssignmentId, !types.Int
    argument  :childAssignmentId,  !types.Int
    resolve   WebApi::Mutations::CreateAssignmentRelationResolver
  end
  
  field :destroyAssignmentRelation do
    description <<-END
Destroy a relationship between two assignments. Its arguments are
the same as createAssignmentRelation, so you should use them in the
same fashion.
    END

    type      types.Boolean
    argument  :parentAssignmentId, !types.Int
    argument  :childAssignmentId, !types.Int
    resolve   WebApi::Mutations::DestroyAssignmentRelationResolver
  end
end
