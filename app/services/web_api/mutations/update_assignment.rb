module WebApi::Mutations::UpdateAssignmentResolver
  def self.call(obj, args, ctx)
    update_hash = args[:update].to_h.deep_symbolize_keys!

    assignment = Assignment.find(args[:assignmentId])
    updates = {}
    updates[:name] = update_hash[:name] if update_hash.has_key?(:name)
    updates[:label] = update_hash[:label] if update_hash.has_key?(:label)
    assignment.update! updates

    (args[:update][:properties] || []).each do |property_input|
      property_hash = property_input.to_h.deep_symbolize_keys!

      if !property_hash.has_key?(:newValue) && !property_hash.has_key?(:newTypeLabel)
        raise "newValue and/or newTypeLabel inputs are required to update or create properties"
      end

      property_type = AssignmentPropertyType.find_or_create_by!(
        name: property_hash[:type]
      ) { |type|
        type.label = property_hash[:newTypeLabel]
      }

      if property_hash.has_key?(:newTypeLabel) && property_hash[:newTypeLabel] != property_type.label
        property_type.update! label: property_hash[:newTypeLabel]
      end

      next unless property_hash.has_key?(:newValue)
      not_created = true
      property = AssignmentProperty.find_or_create_by!(
        assignment_id: args[:id], assignment_property_type_id: property_type.id
      ) { |p|
        not_created = false
        p.value = property_hash[:newValue]
      }

      property.update! value: property_hash[:newValue] if not_created
    end

    return assignment
  end
end