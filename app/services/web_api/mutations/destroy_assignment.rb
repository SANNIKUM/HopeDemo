module WebApi::Mutations::DestroyAssignmentResolver
  def self.call(obj, args, ctx)
  	assignment = ::Assignment.find(args[:id])
  	allowed_types = ["user", "team"]
  	type_name = assignment.assignment_type.name
  	raise "Only assignmentes of #{allowed_types.join('/')} type may be destroyed. Assignment #{args[:id]} is #{type_name} type." unless allowed_types.include? type_name

  	::AssignmentRelation.where("assignment_1_id = ? OR assignment_2_id = ?", args[:id], args[:id]).destroy_all
  	assignment.assignment_properties.destroy_all
  	assignment.form_value_options.destroy_all
  	assignment.destroy!

  	return true
  end
end