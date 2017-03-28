class AddAssignmentRelationTypeIdToAutomaticAssignments < ActiveRecord::Migration[5.0]
  def change
    add_column :automatic_assignments, :assignment_relation_type_id, :integer, index: true
  end
end
