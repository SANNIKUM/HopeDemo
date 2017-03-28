module WebApi::Mutations::DestroyAssignmentRelationResolver
  def self.call(obj, args, ctx)
    ::AssignmentRelation.where(
      assignment_1_id: args[:childAssignmentId],
      assignment_2_id: args[:parentAssignmentId]
    ).first!.destroy!
    return true
  end
end