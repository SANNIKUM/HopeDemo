module WebApi::Mutations::CreateAssignmentRelationResolver
  def self.call(obj, args, ctx)
  	parent = ::Assignment.find args[:parentAssignmentId]
  	child = ::Assignment.find args[:childAssignmentId]
  	parent_type = parent.assignment_type
  	child_type = child.assignment_type
  	raise "No assignment type exists for parent assignment with ID #{parentAssignmentId}" unless parent_type
  	raise "No assignment type exists for child assignment with ID #{childAssignmentId}" unless child_type

  	relation_type = ::AssignmentRelationType.find_or_create_by!(
  		assignment_1_type_id: child_type.id,
  		assignment_2_type_id: parent_type.id
  	) { |type|
  		type.name = "#{child_type.name.titleize} to #{parent_type.name.titleize}"
  	}

  	relation = ::AssignmentRelation.find_or_create_by!(
  		assignment_1_id: child.id,
  		assignment_2_id: parent.id,
  		assignment_relation_type_id: relation_type.id
  	)

  	return relation
  end
end