module WebApi::Mutations::CreateAssignmentResolver
  def self.call(obj, args, ctx)
    assignment_type = ::AssignmentType.find_or_create_by!(name: args[:assignment][:type])
    assignment = ::Assignment.find_or_create_by!(
      name: args[:assignment][:name],
      label: args[:assignment][:label],
      assignment_type_id: assignment_type.id
    )
    
    (args[:assignment][:properties] || []).each do |property_input|
      assignment_property_type = AssignmentPropertyType.find_or_create_by!(
        name: property_input[:type]
      ) { |type|
        type.label = property_input[:typeLabel]
      }

      # TODO Should this check for an existing property of this type on this assignment and raise?
      assignment_property = AssignmentProperty.create!(
        value: property_input[:value],
        assignment_id: assignment.id,
        assignment_property_type_id: assignment_property_type.id
      )
    end
    return assignment
  end
end