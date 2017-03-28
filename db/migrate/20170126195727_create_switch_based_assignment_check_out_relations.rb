class CreateSwitchBasedAssignmentCheckOutRelations < ActiveRecord::Migration[5.0]
  def change
    create_table :switch_based_check_outs do |t|
      t.string :name
      t.integer :target_assignment_type_id, index: true
      t.integer :helper_assignment_type_id, index: true
    end
  end
end
