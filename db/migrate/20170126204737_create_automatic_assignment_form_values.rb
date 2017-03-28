class CreateAutomaticAssignmentFormValues < ActiveRecord::Migration[5.0]
  def change
    create_table :automatic_assignment_form_values do |t|
      t.integer :trigger_type_id, index: true
      t.integer :target_type_id, index: true
    end
  end
end
