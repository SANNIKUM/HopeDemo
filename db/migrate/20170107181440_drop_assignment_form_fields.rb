class DropAssignmentFormFields < ActiveRecord::Migration[5.0]
  def change
    drop_table :assignment_form_fields
  end
end
